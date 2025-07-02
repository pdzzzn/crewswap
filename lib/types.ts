
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

export interface Duty {
  id: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
  user?: User;
}

export const roles = [
  { value: 'CAPTAIN', label: 'Captain' },
  { value: 'FIRST_OFFICER', label: 'First Officer' },
  { value: 'PURSER', label: 'Purser' },
  { value: 'CABIN_ATTENDANT', label: 'Cabin Attendant' },
];