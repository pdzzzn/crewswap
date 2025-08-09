export const dynamic = 'force-dynamic';

import RosterPageClient from '@/components/roster/roster-page-client';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import type { Duty as DutyType, User as UserType } from '@/lib/types';
import { format as formatDate } from 'date-fns';

// Server-side data types and mappers
type DbUser = {
  id: string;
  name: string;
  role: string;
  email: string;
  is_admin: boolean | null;
};

type DbLeg = {
  id: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  departure_location: string;
  arrival_location: string;
  is_deadhead: boolean | null;
};

type DbDuty = {
  id: string;
  date: string;
  pairing: string | null;
  user: DbUser | null;
  legs: DbLeg[] | null;
};

function mapUser(u: DbUser): UserType {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isAdmin: u.is_admin ?? false,
  };
}

function mapLeg(l: DbLeg) {
  return {
    id: l.id,
    flightNumber: l.flight_number,
    departureTime: l.departure_time,
    arrivalTime: l.arrival_time,
    departureLocation: l.departure_location,
    arrivalLocation: l.arrival_location,
    isDeadhead: l.is_deadhead ?? false,
  };
}

function mapDuty(d: DbDuty): DutyType {
  return {
    id: d.id,
    date: d.date,
    pairing: d.pairing,
    user: d.user ? mapUser(d.user) : undefined,
    legs: (d.legs ?? []).map(mapLeg),
  };
}

export default async function RosterPage() {
  const authUser = await requireAuth('/roster');
  const supabase = await createClient();

  const select = `
    id, date, pairing,
    user:users!duties_user_id_fkey(id, name, role, email, is_admin),
    legs:flight_legs!flight_legs_duty_id_fkey(
      id, flight_number, departure_time, arrival_time,
      departure_location, arrival_location, is_deadhead
    )
  `;

  const today = formatDate(new Date(), 'yyyy-MM-dd');

  const [userDutiesRes, availableRes] = await Promise.all([
    supabase
      .from('duties')
      .select(select)
      .eq('user_id', authUser.id)
      .order('date', { ascending: true })
      .order('departure_time', { ascending: true, foreignTable: 'flight_legs' }),
    supabase
      .from('duties')
      .select(select)
      .neq('user_id', authUser.id)
      .gte('date', today)
      .order('date', { ascending: true })
      .order('departure_time', { ascending: true, foreignTable: 'flight_legs' }),
  ]);


  const duties: DutyType[] = (userDutiesRes.data ?? []).map(mapDuty as (d: any) => DutyType);
  const availableDuties: DutyType[] = (availableRes.data ?? []).map(mapDuty as (d: any) => DutyType);

  const user: UserType = {
    id: authUser.id,
    email: authUser.email,
    name: authUser.name,
    role: authUser.role,
    isAdmin: authUser.isAdmin,
  };
  return (
    <RosterPageClient
      user={user}
      duties={duties}
      availableDuties={availableDuties}
    />
    
  );
}