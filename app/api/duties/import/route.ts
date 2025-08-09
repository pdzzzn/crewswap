import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import type { StagedDutyBlock, DutyType } from '@/lib/types';
import { logToFile } from '@/lib/logger';

function tsFrom(date: string, time?: string, fallback: 'start' | 'end' = 'start'): string {
  const t = time && time.trim() ? time : (fallback === 'start' ? '00:00' : '23:59');
  return new Date(`${date}T${t}:00Z`).toISOString();
}

function isAllowedType(t: DutyType) {
  // CHECKIN/CHECKOUT/PICKUP are never sent in blocks, but harden here
  return t === 'OFF' || t === 'STANDBY' || t === 'DEADHEAD' || t === 'FLIGHT';
}

function isDeadheadCode(code: string) {
  return code.toUpperCase().startsWith('DH/');
}

function legKey(userId: string, leg: { code: string; date: string; depTime?: string; arrTime?: string; dep: string; arr: string; }) {
  const depTs = tsFrom(leg.date, leg.depTime, 'start');
  const arrTs = tsFrom(leg.date, leg.arrTime, 'end');
  return [userId, leg.code.toUpperCase(), depTs, arrTs, leg.dep.toUpperCase(), leg.arr.toUpperCase()].join('|');
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { blocks?: StagedDutyBlock[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const blocks = body.blocks || [];
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return NextResponse.json({ error: 'No duties provided' }, { status: 400 });
  }

  const supabase = await createClient();

  // Build existing keys for dedup: fetch recent duties+legs for this user
  // We scope to a window around provided dates to keep query reasonable
  const dates = blocks.flatMap((b) => b.legs.map((l) => l.date));
  const minDate = dates.reduce((a, d) => (a < d ? a : d));
  const maxDate = dates.reduce((a, d) => (a > d ? a : d));
  const minTs = `${minDate}T00:00:00Z`;
  const maxTs = `${maxDate}T23:59:59Z`;

  const { data: existingDuties, error: fetchErr } = await supabase
    .from('duties')
    .select('id, date, flight_legs(id, flight_number, departure_time, arrival_time, departure_location, arrival_location)')
    .eq('user_id', user.id)
    .gte('date', minTs)
    .lte('date', maxTs);

  if (fetchErr) {
    logToFile(`Import fetch error: ${fetchErr.message}`, 'error.log');
    return NextResponse.json({ error: 'Failed to query existing duties' }, { status: 500 });
  }

  const existingKeys = new Set<string>();
  for (const d of existingDuties || []) {
    for (const fl of (d as any).flight_legs || []) {
      const key = [
        user.id,
        String(fl.flight_number).toUpperCase(),
        new Date(fl.departure_time).toISOString(),
        new Date(fl.arrival_time).toISOString(),
        String(fl.departure_location).toUpperCase(),
        String(fl.arrival_location).toUpperCase(),
      ].join('|');
      existingKeys.add(key);
    }
  }

  const results: { createdDutyId?: string; legsInserted: number; legsSkipped: number }[] = [];

  for (const block of blocks) {
    // Filter legs by allowed types and remove duplicates
    const legs = (block.legs || []).filter((l) => isAllowedType(l.type));
    const newLegs = legs.filter((l) => !existingKeys.has(legKey(user.id, l)));

    if (newLegs.length === 0) {
      results.push({ legsInserted: 0, legsSkipped: legs.length });
      continue; // nothing new in this block
    }

    // Create duty for this block using first leg dep time as duty date
    const first = newLegs[0];
    const dutyDate = tsFrom(first.date, first.depTime, 'start');
    const { data: dutyIns, error: dutyErr } = await supabase
      .from('duties')
      .insert({ user_id: user.id, date: dutyDate, pairing: null })
      .select('id')
      .single();

    if (dutyErr || !dutyIns) {
      logToFile(`Duty insert error: ${dutyErr?.message}`, 'error.log');
      results.push({ legsInserted: 0, legsSkipped: legs.length });
      continue;
    }

    const rows = newLegs.map((l) => ({
      duty_id: dutyIns.id,
      flight_number: l.code,
      departure_time: tsFrom(l.date, l.depTime, 'start'),
      arrival_time: tsFrom(l.date, l.arrTime, 'end'),
      departure_location: l.dep,
      arrival_location: l.arr,
      is_deadhead: isDeadheadCode(l.code),
    }));

    const { error: legsErr } = await supabase.from('flight_legs').insert(rows);
    if (legsErr) {
      logToFile(`Legs insert error: ${legsErr.message}`, 'error.log');
      results.push({ createdDutyId: dutyIns.id, legsInserted: 0, legsSkipped: legs.length });
      continue;
    }

    // Update existing keys to include newly inserted legs to avoid duplicates within the same import
    for (const l of newLegs) existingKeys.add(legKey(user.id, l));

    results.push({ createdDutyId: dutyIns.id, legsInserted: newLegs.length, legsSkipped: legs.length - newLegs.length });
  }

  logToFile(`Import completed: ${JSON.stringify(results)}`, 'import.log');
  return NextResponse.json({ ok: true, results });
}
