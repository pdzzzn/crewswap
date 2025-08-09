import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Small, realistic route set
const routes = [
  { flightNumber: 'EW1100', dep: 'DUS', arr: 'PMI', depTime: '06:20', arrTime: '08:55', days: [1,3,5,7] },
  { flightNumber: 'EW1101', dep: 'PMI', arr: 'DUS', depTime: '09:30', arrTime: '12:05', days: [1,3,5,7] },
  { flightNumber: 'EW402',  dep: 'CGN', arr: 'BCN', depTime: '09:10', arrTime: '11:30', days: [2,4,6] },
  { flightNumber: 'EW403',  dep: 'BCN', arr: 'CGN', depTime: '12:00', arrTime: '14:20', days: [2,4,6] },
  { flightNumber: 'EW758',  dep: 'HAM', arr: 'LHR', depTime: '07:45', arrTime: '09:00', days: [1,2,3,4,5] },
  { flightNumber: 'EW759',  dep: 'LHR', arr: 'HAM', depTime: '09:30', arrTime: '12:45', days: [1,2,3,4,5] },
  { flightNumber: 'EW9464', dep: 'DUS', arr: 'MXP', depTime: '12:15', arrTime: '14:05', days: [2,4,6] },
  { flightNumber: 'EW9465', dep: 'MXP', arr: 'DUS', depTime: '14:45', arrTime: '16:35', days: [2,4,6] },
  { flightNumber: 'EW1200', dep: 'BER', arr: 'PMI', depTime: '06:00', arrTime: '08:30', days: [1,2,3,4,5,6,7] },
  { flightNumber: 'EW1201', dep: 'PMI', arr: 'BER', depTime: '09:00', arrTime: '11:30', days: [1,2,3,4,5,6,7] },
];

function createDate(baseDate: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

function weekday(date: Date): number {
  return date.getDay() === 0 ? 7 : date.getDay();
}

function connections(route: any, all: any[], date: Date) {
  const arrAp = route.arr;
  const minTurn = 45 * 60 * 1000;
  const maxTurn = 180 * 60 * 1000;
  const arrTime = createDate(date, route.arrTime).getTime();
  return all.filter(n => n.dep === arrAp).filter(n => {
    const depTime = createDate(date, n.depTime).getTime();
    const diff = depTime - arrTime;
    return diff >= minTurn && diff <= maxTurn;
  });
}

function createDuty(all: any[], date: Date) {
  const avail = all.filter(r => r.days.includes(weekday(date)));
  if (!avail.length) return null;
  const first = avail[Math.floor(Math.random() * avail.length)];
  const legs = [first];
  const legCount = Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 2 : 3; // 1-3 legs
  let cur = first;
  for (let i = 1; i < legCount; i++) {
    const opts = connections(cur, avail, date);
    if (!opts.length) break;
    const next = opts[Math.floor(Math.random() * opts.length)];
    legs.push(next);
    cur = next;
  }
  return {
    flightNumber: legs[0].flightNumber,
    date: date.toISOString().split('T')[0], // YYYY-MM-DD
    legs: legs.map((leg: any, idx: number) => ({
      n: idx + 1,
      depTime: leg.depTime,
      arrTime: leg.arrTime,
      dep: leg.dep,
      arr: leg.arr,
    })),
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pairing(): string {
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const N = '0123456789';
  return L[Math.floor(Math.random()*26)] + L[Math.floor(Math.random()*26)] + N[Math.floor(Math.random()*10)] + N[Math.floor(Math.random()*10)];
}

async function main() {
  console.log('🚀 Seeding duties for existing users (no user creation)');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing env vars NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, name')
    .order('created_at', { ascending: true });

  if (usersError) {
    console.error('❌ Fetch users failed:', usersError.message);
    process.exit(1);
  }
  if (!users || users.length === 0) {
    console.log('ℹ️ No users found; aborting.');
    return;
  }
  console.log(`👥 ${users.length} users found`);

  const start = new Date(); start.setDate(start.getDate() - 3);
  const end = new Date(); end.setDate(end.getDate() + 21);

  const duties: any[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const perDay = Math.floor(Math.random() * 7) + 8; // 8-14/day
    for (let i = 0; i < perDay; i++) {
      const duty = createDuty(routes, new Date(d));
      if (duty) duties.push(duty);
    }
  }
  console.log(`📅 Prepared ${duties.length} duties`);

  const shuffledUsers = shuffle(users);
  let inserted = 0;

  for (const duty of duties) {
    try {
      const assign = Math.random() < 0.8;
      const user = assign ? shuffledUsers[inserted % shuffledUsers.length] : null;

      const { data: insertedDuty, error: dutyErr } = await supabase
        .from('duties')
        .insert({
          date: `${duty.date}T00:00:00Z`,
          user_id: user?.id ?? null,
          pairing: pairing(),
        })
        .select()
        .single();

      if (dutyErr || !insertedDuty) {
        console.error('❌ Insert duty failed:', dutyErr?.message);
        continue;
      }

      for (const leg of duty.legs) {
        const { error: legErr } = await supabase
          .from('flight_legs')
          .insert({
            duty_id: insertedDuty.id,
            flight_number: duty.flightNumber,
            departure_time: `${duty.date}T${leg.depTime}:00Z`,
            arrival_time: `${duty.date}T${leg.arrTime}:00Z`,
            departure_location: leg.dep,
            arrival_location: leg.arr,
            is_deadhead: false,
          });
        if (legErr) console.error('❌ Insert leg failed:', legErr.message);
      }

      inserted++;
      if (inserted % 50 === 0) console.log(`📊 Inserted ${inserted}`);
    } catch (e) {
      console.error('❌ Error inserting duty:', e);
    }
  }

  console.log(`✅ Done. Inserted ${inserted} duties`);
}

main().catch((e) => {
  console.error('❌ Seeding run failed:', e);
  process.exit(1);
});
