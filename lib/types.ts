
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Duty {
  id: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
}