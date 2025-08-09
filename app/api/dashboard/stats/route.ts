
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const now = new Date().toISOString();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    // Get total duties count
    const { count: totalDuties, error: totalError } = await supabase
      .from('duties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (totalError) {
      console.error('Total duties count error:', totalError);
      return NextResponse.json({ error: totalError.message }, { status: 500 });
    }

    // Get upcoming duties count
    const { count: upcomingDuties, error: upcomingError } = await supabase
      .from('duties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('date', now)
      .lte('date', thirtyDaysFromNow);

    if (upcomingError) {
      console.error('Upcoming duties count error:', upcomingError);
      return NextResponse.json({ error: upcomingError.message }, { status: 500 });
    }

    // Get pending swap requests count
    const { count: pendingSwaps, error: pendingError } = await supabase
      .from('swap_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (pendingError) {
      console.error('Pending swaps count error:', pendingError);
      return NextResponse.json({ error: pendingError.message }, { status: 500 });
    }

    // Get completed swaps this month count
    const { count: completedSwaps, error: completedError } = await supabase
      .from('swap_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'APPROVED')
      .gte('updated_at', startOfMonth)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (completedError) {
      console.error('Completed swaps count error:', completedError);
      return NextResponse.json({ error: completedError.message }, { status: 500 });
    }

    const stats = {
      totalDuties,
      upcomingDuties,
      pendingSwaps,
      completedSwaps
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
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
