export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const body = await request.json().catch(() => ({}));
    const { requests, globalMessage, atomic = true } = body || {};

    if (!Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json({ error: 'requests[] is required' }, { status: 400 });
    }

    // Call Postgres function (SECURITY DEFINER) to handle batch insert
    const { data, error } = await supabase.rpc('batch_create_swap_requests', {
      requests,
      global_message: globalMessage ?? null,
      atomic,
    });

    if (error) {
      // Try to parse results array from error.details (we set DETAIL in the function)
      let results: any[] | undefined;
      try {
        if (error.details && typeof error.details === 'string') {
          const parsed = JSON.parse(error.details);
          if (Array.isArray(parsed)) results = parsed;
          else if (parsed && Array.isArray(parsed.results)) results = parsed.results;
        }
      } catch {}

      return NextResponse.json(
        {
          error: error.message,
          results,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Batch swap request error:', error);
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
