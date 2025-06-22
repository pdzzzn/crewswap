
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const sentRequests = await prisma.swapRequest.findMany({
      where: { senderId: user.id },
      include: {
        receiver: { select: { id: true, name: true, role: true } },
        senderDuty: true,
        targetDuty: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const receivedRequests = await prisma.swapRequest.findMany({
      where: { receiverId: user.id },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        senderDuty: true,
        targetDuty: true,
      },
      orderBy: { createdAt: 'desc' }
    });

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

    if (!senderDutyId || !targetDutyId || !receiverId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the sender owns the sender duty
    const senderDuty = await prisma.duty.findFirst({
      where: { id: senderDutyId, userId: user.id }
    });

    if (!senderDuty) {
      return NextResponse.json(
        { error: 'Invalid sender duty' },
        { status: 400 }
      );
    }

    // Verify the target duty exists and belongs to the receiver
    const targetDuty = await prisma.duty.findFirst({
      where: { id: targetDutyId, userId: receiverId }
    });

    if (!targetDuty) {
      return NextResponse.json(
        { error: 'Invalid target duty' },
        { status: 400 }
      );
    }

    // Check for existing pending request between same duties
    const existingRequest = await prisma.swapRequest.findFirst({
      where: {
        senderDutyId,
        targetDutyId,
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'A swap request already exists for these duties' },
        { status: 400 }
      );
    }

    // Create swap request
    const swapRequest = await prisma.swapRequest.create({
      data: {
        senderId: user.id,
        receiverId,
        senderDutyId,
        targetDutyId,
        message: message || null,
      }
    });

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'SWAP_REQUEST_RECEIVED',
        title: 'New Swap Request',
        message: `${user.name} wants to swap duties with you`,
        swapRequestId: swapRequest.id,
      }
    });

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
