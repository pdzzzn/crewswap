
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Get duties from other users that are available for swap
    const { data: duties, error } = await supabase
      .from('duties')
      .select(`
        *,
        user:users!user_id(id, name, role),
        legs(*)
      `)
      .neq('user_id', user.id) // Exclude current user's duties
      .gte('date', new Date().toISOString()) // Only future duties
      .order('date', { ascending: true });

    if (error) {
      console.error('Fetch available duties error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ duties });
  } catch (error) {
    console.error('Fetch available duties error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
