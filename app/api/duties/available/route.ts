
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    // Get duties from other users that are available for swap
    const duties = await prisma.duty.findMany({
      where: {
        userId: { not: user.id }, // Exclude current user's duties
        date: { gte: new Date() }, // Only future duties
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          }
        },
        legs: true,
      },
      orderBy: { date: 'asc' }
    });

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
