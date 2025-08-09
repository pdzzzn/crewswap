import type { ParsedDuty } from '@/lib/ics';
import type { DutyType, StagedDutyBlock, StagedDutyLeg } from '@/lib/types';

function isCheckin(code: string) {
  return code.toUpperCase() === 'C/I';
}
function isCheckout(code: string) {
  return code.toUpperCase() === 'C/O';
}
function isPickup(code: string) {
  const u = code.toUpperCase();
  return u === 'PICK' || u === 'PICKUP';
}
function isStandby(code: string) {
  return code.toUpperCase().startsWith('STBY');
}
function isOff(code: string) {
  const u = code.toUpperCase();
  return u === 'OFF' || u.startsWith('OFF') || u.startsWith('O_');
}
function isDeadhead(code: string) {
  // Per requirement: only detect DEADHEAD by the DH/ prefix
  return code.toUpperCase().startsWith('DH/');
}

function classify(code: string): DutyType {
  if (isOff(code)) return 'OFF';
  if (isStandby(code)) return 'STANDBY';
  if (isDeadhead(code)) return 'DEADHEAD';
  return 'FLIGHT';
}

function sortKey(d: ParsedDuty): string {
  const t = d.departureTime || '00:00';
  return `${d.date}T${t}`;
}

export function transformParsedDutiesToStagedBlocks(items: ParsedDuty[]): StagedDutyBlock[] {
  // Sort by date then time (times are UTC strings like HH:mm)
  const sorted = [...items].sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : sortKey(a) > sortKey(b) ? 1 : 0));

  const blocks: StagedDutyBlock[] = [];
  let blockCounter = 0;
  let legCounter = 0;
  let current: StagedDutyBlock | null = null;

  const closeCurrent = () => {
    if (!current || current.legs.length === 0) {
      current = null;
      return;
    }
    const allDh = current.legs.every((l) => isDeadhead(l.code));
    current.type = allDh ? 'DEADHEAD' : 'FLIGHT';
    current.startDate = current.legs[0].date;
    current.endDate = current.legs[current.legs.length - 1].date;
    blocks.push(current);
    current = null;
  };

  for (const it of sorted) {
    const code = it.flightNumber || '';

    if (isOff(code)) {
      closeCurrent();
      const leg: StagedDutyLeg = {
        id: `leg-${++legCounter}`,
        date: it.date,
        depTime: it.departureTime || undefined,
        arrTime: it.arrivalTime || undefined,
        dep: it.departureLocation,
        arr: it.arrivalLocation,
        code,
        type: 'OFF',
      };
      blocks.push({ id: `block-${++blockCounter}`, startDate: it.date, endDate: it.date, type: 'OFF', legs: [leg] });
      continue;
    }

    if (isStandby(code)) {
      closeCurrent();
      const leg: StagedDutyLeg = {
        id: `leg-${++legCounter}`,
        date: it.date,
        depTime: it.departureTime || undefined,
        arrTime: it.arrivalTime || undefined,
        dep: it.departureLocation,
        arr: it.arrivalLocation,
        code,
        type: 'STANDBY',
      };
      blocks.push({ id: `block-${++blockCounter}`, startDate: it.date, endDate: it.date, type: 'STANDBY', legs: [leg] });
      continue;
    }

    if (isCheckin(code)) {
      closeCurrent();
      current = { id: `block-${++blockCounter}`, startDate: it.date, endDate: it.date, type: 'FLIGHT', legs: [] };
      continue;
    }

    if (isCheckout(code)) {
      closeCurrent();
      continue;
    }

    if (isPickup(code)) {
      continue; // not uploaded
    }

    const leg: StagedDutyLeg = {
      id: `leg-${++legCounter}`,
      date: it.date,
      depTime: it.departureTime || undefined,
      arrTime: it.arrivalTime || undefined,
      dep: it.departureLocation,
      arr: it.arrivalLocation,
      code,
      type: classify(code),
    };

    if (!current) {
      current = { id: `block-${++blockCounter}`, startDate: it.date, endDate: it.date, type: leg.type, legs: [] };
    }
    current.legs.push(leg);
  }

  closeCurrent();
  return blocks;
}
