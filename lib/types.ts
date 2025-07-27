
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