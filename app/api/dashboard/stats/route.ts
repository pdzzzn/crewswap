
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalDuties, upcomingDuties, pendingSwaps, completedSwaps] = await Promise.all([
      // Total duties assigned to user
      prisma.duty.count({
        where: { userId: user.id }
      }),

      // Upcoming duties in next 30 days
      prisma.duty.count({
        where: {
          userId: user.id,
          date: {
            gte: now,
            lte: thirtyDaysFromNow
          }
        }
      }),

      // Pending swap requests (sent or received)
      prisma.swapRequest.count({
        where: {
          OR: [
            { senderId: user.id },
            { receiverId: user.id }
          ],
          status: 'PENDING'
        }
      }),

      // Completed swaps this month
      prisma.swapRequest.count({
        where: {
          OR: [
            { senderId: user.id },
            { receiverId: user.id }
          ],
          status: 'APPROVED',
          updatedAt: {
            gte: startOfMonth
          }
        }
      })
    ]);

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
