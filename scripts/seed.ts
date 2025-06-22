
import { PrismaClient, UserRole, SwapRequestStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.swapRequest.deleteMany();
  await prisma.duty.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  console.log('👥 Creating sample users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Captain Sarah Mitchell',
        email: 'sarah.mitchell@airline.com',
        password: await bcrypt.hash('password123', 12),
        role: UserRole.CAPTAIN,
      },
    }),
    prisma.user.create({
      data: {
        name: 'First Officer James Parker',
        email: 'james.parker@airline.com',
        password: await bcrypt.hash('password123', 12),
        role: UserRole.FIRST_OFFICER,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Purser Maria Rodriguez',
        email: 'maria.rodriguez@airline.com',
        password: await bcrypt.hash('password123', 12),
        role: UserRole.PURSER,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Flight Attendant Lisa Chen',
        email: 'lisa.chen@airline.com',
        password: await bcrypt.hash('password123', 12),
        role: UserRole.CABIN_ATTENDANT,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Captain Michael Torres',
        email: 'michael.torres@airline.com',
        password: await bcrypt.hash('password123', 12),
        role: UserRole.CAPTAIN,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Flight Attendant Emma Johnson',
        email: 'emma.johnson@airline.com',
        password: await bcrypt.hash('password123', 12),
        role: UserRole.CABIN_ATTENDANT,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample duties
  console.log('✈️ Creating sample duties...');
  const today = new Date();
  const duties = [];

  // Helper function to create dates
  const createDate = (daysFromNow: number, hour: number, minute: number = 0) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const flightRoutes = [
    { flight: 'AA101', dep: 'JFK', arr: 'LAX', depTime: 8, arrTime: 11 },
    { flight: 'AA202', dep: 'LAX', arr: 'CHI', depTime: 14, arrTime: 19 },
    { flight: 'AA303', dep: 'CHI', arr: 'MIA', depTime: 9, arrTime: 12 },
    { flight: 'AA404', dep: 'MIA', arr: 'JFK', depTime: 16, arrTime: 19 },
    { flight: 'AA505', dep: 'LAX', arr: 'SEA', depTime: 7, arrTime: 9 },
    { flight: 'AA606', dep: 'SEA', arr: 'DEN', depTime: 12, arrTime: 15 },
    { flight: 'AA707', dep: 'DEN', arr: 'ATL', depTime: 18, arrTime: 22 },
    { flight: 'AA808', dep: 'ATL', arr: 'BOS', depTime: 10, arrTime: 12 },
    { flight: 'AA909', dep: 'BOS', arr: 'PHX', depTime: 15, arrTime: 18 },
    { flight: 'AA110', dep: 'PHX', arr: 'LAS', depTime: 20, arrTime: 21 },
  ];

  // Assign duties to users over the next 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const routesForDay = flightRoutes.slice(0, Math.floor(Math.random() * 6) + 4); // 4-9 flights per day
    
    for (let i = 0; i < routesForDay.length; i++) {
      const route = routesForDay[i];
      const userIndex = (dayOffset + i) % users.length;
      const user = users[userIndex];
      
      const departureTime = createDate(dayOffset, route.depTime);
      const arrivalTime = createDate(dayOffset, route.arrTime);
      
      // Adjust arrival time if it's a cross-day flight
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
  }

  await prisma.duty.createMany({ data: duties });
  console.log(`✅ Created ${duties.length} duty assignments`);

  // Create some sample swap requests
  console.log('🔄 Creating sample swap requests...');
  const allDuties = await prisma.duty.findMany({
    include: { user: true }
  });

  const swapRequests = [];
  for (let i = 0; i < 5; i++) {
    const senderDuty = allDuties[Math.floor(Math.random() * allDuties.length)];
    const targetDuties = allDuties.filter(d => d.userId !== senderDuty.userId);
    const targetDuty = targetDuties[Math.floor(Math.random() * targetDuties.length)];

    if (senderDuty && targetDuty) {
      swapRequests.push({
        senderId: senderDuty.userId,
        receiverId: targetDuty.userId,
        senderDutyId: senderDuty.id,
        targetDutyId: targetDuty.id,
        message: [
          'Would love to swap this duty with you!',
          'I have a family event that day, would you be able to swap?',
          'This would really help me out, thanks!',
          'Perfect timing for both of us I think!',
          'Hope we can make this work!'
        ][i],
        status: i < 2 ? SwapRequestStatus.PENDING : (i < 4 ? SwapRequestStatus.APPROVED : SwapRequestStatus.DENIED),
      });
    }
  }

  if (swapRequests.length > 0) {
    await prisma.swapRequest.createMany({ data: swapRequests });
    console.log(`✅ Created ${swapRequests.length} swap requests`);
  }

  // Create notifications for the swap requests
  console.log('🔔 Creating sample notifications...');
  const createdSwapRequests = await prisma.swapRequest.findMany();
  const notifications = [];

  for (const swapRequest of createdSwapRequests) {
    // Notification to receiver about new request
    notifications.push({
      userId: swapRequest.receiverId,
      type: NotificationType.SWAP_REQUEST_RECEIVED,
      title: 'New Swap Request',
      message: 'You have received a new duty swap request',
      swapRequestId: swapRequest.id,
    });

    // If the request is approved or denied, create notification to sender
    if (swapRequest.status === SwapRequestStatus.APPROVED) {
      notifications.push({
        userId: swapRequest.senderId,
        type: NotificationType.SWAP_REQUEST_APPROVED,
        title: 'Swap Request Approved',
        message: 'Your duty swap request has been approved!',
        swapRequestId: swapRequest.id,
      });
    } else if (swapRequest.status === SwapRequestStatus.DENIED) {
      notifications.push({
        userId: swapRequest.senderId,
        type: NotificationType.SWAP_REQUEST_DENIED,
        title: 'Swap Request Denied',
        message: 'Your duty swap request has been denied',
        swapRequestId: swapRequest.id,
      });
    }
  }

  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
    console.log(`✅ Created ${notifications.length} notifications`);
  }

  console.log('\n🎉 Seed process completed successfully!');
  console.log('\n📋 Sample user accounts created:');
  console.log('Email: sarah.mitchell@airline.com | Password: password123 | Role: Captain');
  console.log('Email: james.parker@airline.com | Password: password123 | Role: First Officer');
  console.log('Email: maria.rodriguez@airline.com | Password: password123 | Role: Purser');
  console.log('Email: lisa.chen@airline.com | Password: password123 | Role: Cabin Attendant');
  console.log('Email: michael.torres@airline.com | Password: password123 | Role: Captain');
  console.log('Email: emma.johnson@airline.com | Password: password123 | Role: Cabin Attendant');
  console.log('\n🚀 You can now login with any of these accounts!');
}

main()
  .catch((e) => {
    console.error('❌ Seed process failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
