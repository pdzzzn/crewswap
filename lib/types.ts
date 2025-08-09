
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

export interface Duty {
  id: string;
  date: string;
  legs: FlightLeg[];
  user?: User;
  pairing: string | null; // string is common UUID for all duties in a pairing
}

export interface FlightLeg {
  id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
  isDeadhead: boolean;
}


export const roles = [
  { value: 'CAPTAIN', label: 'Captain' },
  { value: 'FIRST_OFFICER', label: 'First Officer' },
  { value: 'PURSER', label: 'Purser' },
  { value: 'CABIN_ATTENDANT', label: 'Cabin Attendant' },
];

export const bases = [
  { value: 'PMI', label: 'Palma de Mallorca (PMI)' },
  { value: 'ARN', label: 'Stockholm (ARN)' },
  { value: 'PRG', label: 'Prague (PRG)' },
  { value: 'SZG', label: 'Salzburg (SZG)' },
  { value: 'VIE', label: 'Vienna (VIE)' },
  { value: 'WP_PMI', label: 'WP-Palma de Mallorca' },
  { value: 'WP_BCN', label: 'WP-Barcelona' },
  { value: 'WP_PRG', label: 'WP-Prague' },
];

// Duty staging types for modal and import API
export type DutyType = 'FLIGHT' | 'DEADHEAD' | 'STANDBY' | 'OFF';

export interface StagedDutyLeg {
  id: string;
  date: string; // YYYY-MM-DD (UTC)
  depTime?: string; // HH:mm (UTC) optional for all-day
  arrTime?: string; // HH:mm (UTC) optional for all-day
  dep: string; // IATA (no validation here)
  arr: string; // IATA (no validation here)
  code: string; // e.g., "EW 9500", "DH/EW 9575", "STBY_S3", or "O_S"
  type: DutyType;
  notes?: string;
}

export interface StagedDutyBlock {
  id: string;
  startDate: string; // first leg date (UTC)
  endDate: string;   // last leg date (UTC)
  type: DutyType;    // OFF/STANDBY or FLIGHT/DEADHEAD when legs exist
  legs: StagedDutyLeg[];
}