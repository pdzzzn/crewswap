
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Get sent requests
    const { data: sentRequests, error: sentError } = await supabase
      .from('swap_requests')
      .select(`
        *,
        receiver:users!receiver_id(id, name, role),
        sender_duty:duties!sender_duty_id(*),
        target_duty:duties!target_duty_id(*)
      `)
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    if (sentError) {
      console.error('Fetch sent requests error:', sentError);
      return NextResponse.json({ error: sentError.message }, { status: 500 });
    }

    // Get received requests
    const { data: receivedRequests, error: receivedError } = await supabase
      .from('swap_requests')
      .select(`
        *,
        sender:users!sender_id(id, name, role),
        sender_duty:duties!sender_duty_id(*),
        target_duty:duties!target_duty_id(*)
      `)
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });

    if (receivedError) {
      console.error('Fetch received requests error:', receivedError);
      return NextResponse.json({ error: receivedError.message }, { status: 500 });
    }

    return NextResponse.json({ sentRequests, receivedRequests });
  } catch (error) {
    console.error('Fetch swap requests error:', error);
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

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { senderDutyId, targetDutyId, receiverId, message } = await request.json();
    const supabase = await createClient();

    if (!senderDutyId || !targetDutyId || !receiverId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the sender owns the sender duty
    const { data: senderDuty, error: senderDutyError } = await supabase
      .from('duties')
      .select('*')
      .eq('id', senderDutyId)
      .eq('user_id', user.id)
      .single();

    if (senderDutyError || !senderDuty) {
      return NextResponse.json(
        { error: 'Invalid sender duty' },
        { status: 400 }
      );
    }

    // Verify the target duty exists and belongs to the receiver
    const { data: targetDuty, error: targetDutyError } = await supabase
      .from('duties')
      .select('*')
      .eq('id', targetDutyId)
      .eq('user_id', receiverId)
      .single();

    if (targetDutyError || !targetDuty) {
      return NextResponse.json(
        { error: 'Invalid target duty' },
        { status: 400 }
      );
    }

    // Check for existing pending request between same duties
    const { data: existingRequest, error: existingError } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('sender_duty_id', senderDutyId)
      .eq('target_duty_id', targetDutyId)
      .eq('status', 'PENDING')
      .single();

    if (existingRequest && !existingError) {
      return NextResponse.json(
        { error: 'A swap request already exists for these duties' },
        { status: 400 }
      );
    }

    // Create swap request
    const { data: swapRequest, error: swapError } = await supabase
      .from('swap_requests')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        sender_duty_id: senderDutyId,
        target_duty_id: targetDutyId,
        message: message || null,
        status: 'PENDING'
      })
      .select()
      .single();

    if (swapError) {
      console.error('Create swap request error:', swapError);
      return NextResponse.json({ error: swapError.message }, { status: 500 });
    }

    // Create notification for receiver
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: receiverId,
        type: 'SWAP_REQUEST_RECEIVED',
        title: 'New Swap Request',
        message: `${user.name} wants to swap duties with you`,
        swap_request_id: swapRequest.id,
        is_read: false
      });

    if (notificationError) {
      console.error('Create notification error:', notificationError);
      // Don't fail the request if notification creation fails
    }

    return NextResponse.json({
      message: 'Swap request sent successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
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
