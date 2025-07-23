// In prisma/seed.ts

// --- CHANGE: Use the standard import path for Prisma Client ---
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process to add new duties...');

  // --- CHANGE: Removed the section that deletes all existing data ---

  // --- CHANGE: Fetch existing users instead of creating new ones ---
  console.log('👥 Fetching existing users...');
  const users = await prisma.user.findMany();

  // If no users exist, we can't assign duties.
  if (users.length === 0) {
    console.log('❌ No users found in the database. Please create users before seeding duties.');
    return; // Exit the script
  }
  console.log(`✅ Found ${users.length} users to assign duties to.`);


  // Create sample duties (This logic remains the same)
  console.log('✈️ Creating sample duties...');
  const today = new Date();
  const duties = [];

  const createDate = (daysFromNow: number, hour: number, minute: number = 0) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const flightRoutes = [
    { flight: 'LH205', dep: 'HAM', arr: 'MUC', depTime: 7, arrTime: 8 },
    { flight: 'LH010', dep: 'HAM', arr: 'FRA', depTime: 9, arrTime: 10 },
    { flight: 'EW759', dep: 'HAM', arr: 'LHR', depTime: 11, arrTime: 12 },
    { flight: 'LH220', dep: 'FRA', arr: 'TXL', depTime: 14, arrTime: 15 },
    { flight: 'BA975', dep: 'LHR', arr: 'JFK', depTime: 16, arrTime: 19 },
    { flight: 'LH404', dep: 'FRA', arr: 'JFK', depTime: 17, arrTime: 20 },
  ];

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const route = flightRoutes[dayOffset % flightRoutes.length];
    const user = users[dayOffset % users.length];

    const departureTime = createDate(dayOffset, route.depTime);
    const arrivalTime = createDate(dayOffset, route.arrTime);

    if (route.arrTime < route.depTime) {
      arrivalTime.setDate(arrivalTime.getDate() + 1);
    }

    duties.push({
      flightNumber: route.flight,
      date: createDate(dayOffset, 0),
      departureTime,
      arrivalTime,
      departureLocation: route.dep,
      arrivalLocation: route.arr,
      userId: user.id,
    });
  }

  // --- CHANGE: Added a check to prevent creating duplicate duties ---
  // This is optional but good practice. We'll skip creating a duty if one with the
  // same flight number and date already exists for that user.
  const existingDuties = await prisma.duty.findMany({
    where: {
      OR: duties.map(d => ({
        flightNumber: d.flightNumber,
        date: d.date,
        userId: d.userId,
      })),
    },
    select: { flightNumber: true, date: true, userId: true },
  });

  const existingDutySet = new Set(
    existingDuties.map(d => `${d.userId}-${d.flightNumber}-${d.date.toISOString().split('T')[0]}`)
  );

  const dutiesToCreate = duties.filter(d => {
    const dutyIdentifier = `${d.userId}-${d.flightNumber}-${d.date.toISOString().split('T')[0]}`;
    return !existingDutySet.has(dutyIdentifier);
  });


  if (dutiesToCreate.length > 0) {
    await prisma.duty.createMany({ data: dutiesToCreate });
    console.log(`✅ Created ${dutiesToCreate.length} new duty assignments.`);
  } else {
    console.log('✅ No new duties to create.');
  }


  // --- CHANGE: Removed creation of SwapRequests and Notifications ---
  // This makes the script's purpose specific to adding duties.

  console.log('\n🎉 Duty seeding process completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed process failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });