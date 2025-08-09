import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  const users = await prisma.user.findMany();
  const duties = await prisma.duty.findMany({ include: { legs: true } });
  const swapRequests = await prisma.swapRequest.findMany();
  const notifications = await prisma.notification.findMany();

  const data = { users, duties, swapRequests, notifications };
  fs.writeFileSync('data-export.json', JSON.stringify(data, null, 2));
  console.log('Data exported successfully');
}

exportData().catch(console.error).finally(() => prisma.$disconnect());