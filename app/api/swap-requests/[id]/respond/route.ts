
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import {Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { action, responseMessage } = await request.json();
    const { id } = params;

    if (!action || !['approve', 'deny'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Find the swap request
    const swapRequest = await prisma.swapRequest.findFirst({
      where: {
        id,
        receiverId: user.id,
        status: 'PENDING'
      },
      include: {
        sender: { select: { id: true, name: true } },
        senderDuty: true,
        targetDuty: true,
      }
    });

    if (!swapRequest) {
      return NextResponse.json(
        { error: 'Swap request not found or already processed' },
        { status: 404 }
      );
    }

    const status = action === 'approve' ? 'APPROVED' : 'DENIED';
    
    // Start transaction for swap approval
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update swap request status
      const updatedRequest = await tx.swapRequest.update({
        where: { id },
        data: {
          status,
          responseMessage: responseMessage || null,
        }
      });

      if (action === 'approve') {
        // Swap the duties between users
        await tx.duty.update({
          where: { id: swapRequest.senderDutyId },
          data: { userId: user.id }
        });

        await tx.duty.update({
          where: { id: swapRequest.targetDutyId },
          data: { userId: swapRequest.senderId }
        });
      }

      // Create notification for sender
      await tx.notification.create({
        data: {
          userId: swapRequest.senderId,
          type: action === 'approve' ? 'SWAP_REQUEST_APPROVED' : 'SWAP_REQUEST_DENIED',
          title: `Swap Request ${action === 'approve' ? 'Approved' : 'Denied'}`,
          message: `${user.name} has ${action === 'approve' ? 'approved' : 'denied'} your swap request`,
          swapRequestId: id,
        }
      });

      return updatedRequest;
    });

    return NextResponse.json({
      message: `Swap request ${action === 'approve' ? 'approved' : 'denied'} successfully`,
      swapRequest: result
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
