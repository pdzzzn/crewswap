import { createClient } from '../../../lib/supabase-server';
import { getCurrentUser } from '../../../lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();
  const { data: duties, error } = await supabase
    .from('duties')
    .select('*, flight_legs(*), users(name, role)')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(duties);
}