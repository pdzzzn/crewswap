
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function PATCH(request: Request, context: any) {
  try {
    const user = await requireAuth();
    const { action, responseMessage } = await request.json();
    const { id } = context?.params ?? {};
    const supabase = await createClient();

    if (!action || !['approve', 'deny'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Find the swap request with related data
    const { data: swapRequest, error: findError } = await supabase
      .from('swap_requests')
      .select(`
        *,
        sender:users!sender_id(id, name),
        sender_duty:duties!sender_duty_id(*),
        target_duty:duties!target_duty_id(*)
      `)
      .eq('id', id)
      .eq('receiver_id', user.id)
      .eq('status', 'PENDING')
      .single();

    if (findError || !swapRequest) {
      return NextResponse.json(
        { error: 'Swap request not found or already processed' },
        { status: 404 }
      );
    }

    const status = action === 'approve' ? 'APPROVED' : 'DENIED';
    
    // Update swap request status
    const { data: updatedRequest, error: updateError } = await supabase
      .from('swap_requests')
      .update({
        status,
        response_message: responseMessage || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update swap request error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Validate duty IDs exist
    if (!swapRequest.sender_duty_id || !swapRequest.target_duty_id) {
      return NextResponse.json(
        { error: 'Invalid swap request payload: missing duty IDs' },
        { status: 400 }
      );
    }

    // If approved, swap the duties between users
    if (action === 'approve') {
      // Update sender duty to belong to receiver (current user)
      const { error: senderDutyError } = await supabase
        .from('duties')
        .update({ user_id: user.id })
        .eq('id', swapRequest.sender_duty_id as string);

      if (senderDutyError) {
        console.error('Update sender duty error:', senderDutyError);
        return NextResponse.json({ error: 'Failed to swap duties' }, { status: 500 });
      }

      // Update target duty to belong to sender
      const { error: targetDutyError } = await supabase
        .from('duties')
        .update({ user_id: swapRequest.sender_id })
        .eq('id', swapRequest.target_duty_id as string);

      if (targetDutyError) {
        console.error('Update target duty error:', targetDutyError);
        return NextResponse.json({ error: 'Failed to swap duties' }, { status: 500 });
      }
    }

    // Create notification for sender
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: swapRequest.sender_id,
        type: action === 'approve' ? 'SWAP_REQUEST_APPROVED' : 'SWAP_REQUEST_DENIED',
        title: `Swap Request ${action === 'approve' ? 'Approved' : 'Denied'}`,
        message: `${user.name} has ${action === 'approve' ? 'approved' : 'denied'} your swap request`,
        swap_request_id: id,
        is_read: false
      });

    if (notificationError) {
      console.error('Create notification error:', notificationError);
      // Don't fail the request if notification creation fails
    }

    return NextResponse.json({
      message: `Swap request ${action === 'approve' ? 'approved' : 'denied'} successfully`,
      swapRequest: updatedRequest
    });
  } catch (error) {
    console.error('Respond to swap request error:', error);
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
