import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const eurowingsRoutes = [
  // German Domestic & Regional
  { flightNumber: 'EW1100', dep: 'DUS', arr: 'PMI', depTime: '06:20', arrTime: '08:55', days: [1, 3, 5, 7] },
  { flightNumber: 'EW402',  dep: 'CGN', arr: 'BCN', depTime: '09:10', arrTime: '11:30', days: [2, 4, 6] },
  { flightNumber: 'EW758',  dep: 'HAM', arr: 'LHR', depTime: '07:45', arrTime: '09:00', days: [1, 2, 3, 4, 5] },
  { flightNumber: 'EW9464', dep: 'DUS', arr: 'MXP', depTime: '12:15', arrTime: '14:05', days: [2, 4, 6] },
  { flightNumber: 'EW9460', dep: 'CGN', arr: 'ARN', depTime: '13:40', arrTime: '15:55', days: [1, 3, 5] },
  { flightNumber: 'EW2462', dep: 'STR', arr: 'PMI', depTime: '15:00', arrTime: '17:30', days: [6, 7] },
  { flightNumber: 'EW9740', dep: 'DUS', arr: 'LIS', depTime: '10:10', arrTime: '13:00', days: [3, 6] },
  { flightNumber: 'EW8852', dep: 'HAM', arr: 'SPU', depTime: '06:00', arrTime: '08:15', days: [2, 5, 7] },
  { flightNumber: 'EW9462', dep: 'CGN', arr: 'VIE', depTime: '14:00', arrTime: '16:00', days: [1, 4, 6] },
  { flightNumber: 'EW7584', dep: 'DUS', arr: 'HER', depTime: '16:45', arrTime: '20:15', days: [5, 6] },
  
  // Additional German Hub Routes
  { flightNumber: 'EW1101', dep: 'PMI', arr: 'DUS', depTime: '09:30', arrTime: '12:05', days: [1, 3, 5, 7] },
  { flightNumber: 'EW403',  dep: 'BCN', arr: 'CGN', depTime: '12:00', arrTime: '14:20', days: [2, 4, 6] },
  { flightNumber: 'EW759',  dep: 'LHR', arr: 'HAM', depTime: '09:30', arrTime: '12:45', days: [1, 2, 3, 4, 5] },
  { flightNumber: 'EW9465', dep: 'MXP', arr: 'DUS', depTime: '14:45', arrTime: '16:35', days: [2, 4, 6] },
  { flightNumber: 'EW9461', dep: 'ARN', arr: 'CGN', depTime: '16:25', arrTime: '18:40', days: [1, 3, 5] },
  { flightNumber: 'EW2463', dep: 'PMI', arr: 'STR', depTime: '18:00', arrTime: '20:30', days: [6, 7] },
  { flightNumber: 'EW9741', dep: 'LIS', arr: 'DUS', depTime: '13:30', arrTime: '16:20', days: [3, 6] },
  { flightNumber: 'EW8853', dep: 'SPU', arr: 'HAM', depTime: '08:45', arrTime: '11:00', days: [2, 5, 7] },
  { flightNumber: 'EW9463', dep: 'VIE', arr: 'CGN', depTime: '16:30', arrTime: '18:30', days: [1, 4, 6] },
  { flightNumber: 'EW7585', dep: 'HER', arr: 'DUS', depTime: '20:45', arrTime: '00:20', days: [5, 6] },

  // Berlin Routes
  { flightNumber: 'EW1200', dep: 'BER', arr: 'PMI', depTime: '06:00', arrTime: '08:30', days: [1, 2, 3, 4, 5, 6, 7] },
  { flightNumber: 'EW1201', dep: 'PMI', arr: 'BER', depTime: '09:00', arrTime: '11:30', days: [1, 2, 3, 4, 5, 6, 7] },
  { flightNumber: 'EW1210', dep: 'BER', arr: 'BCN', depTime: '14:20', arrTime: '16:45', days: [2, 4, 6, 7] },
  { flightNumber: 'EW1211', dep: 'BCN', arr: 'BER', depTime: '17:15', arrTime: '19:40', days: [2, 4, 6, 7] },
  { flightNumber: 'EW1220', dep: 'BER', arr: 'VIE', depTime: '08:45', arrTime: '10:00', days: [1, 3, 5, 7] },
  { flightNumber: 'EW1221', dep: 'VIE', arr: 'BER', depTime: '10:30', arrTime: '11:45', days: [1, 3, 5, 7] },
  { flightNumber: 'EW1230', dep: 'BER', arr: 'ZUR', depTime: '07:15', arrTime: '08:30', days: [1, 2, 3, 4, 5] },
  { flightNumber: 'EW1231', dep: 'ZUR', arr: 'BER', depTime: '09:00', arrTime: '10:15', days: [1, 2, 3, 4, 5] },

  // Munich Routes
  { flightNumber: 'EW1300', dep: 'MUC', arr: 'PMI', depTime: '07:30', arrTime: '09:45', days: [1, 2, 3, 4, 5, 6, 7] },
  { flightNumber: 'EW1301', dep: 'PMI', arr: 'MUC', depTime: '10:15', arrTime: '12:30', days: [1, 2, 3, 4, 5, 6, 7] },
  { flightNumber: 'EW1310', dep: 'MUC', arr: 'FCO', depTime: '11:00', arrTime: '12:30', days: [2, 4, 6] },
  { flightNumber: 'EW1311', dep: 'FCO', arr: 'MUC', depTime: '13:00', arrTime: '14:30', days: [2, 4, 6] },
  { flightNumber: 'EW1320', dep: 'MUC', arr: 'ATH', depTime: '13:15', arrTime: '16:30', days: [3, 5, 7] },
  { flightNumber: 'EW1321', dep: 'ATH', arr: 'MUC', depTime: '17:00', arrTime: '18:15', days: [3, 5, 7] },

  // Frankfurt Routes
  { flightNumber: 'EW1400', dep: 'FRA', arr: 'LHR', depTime: '06:30', arrTime: '07:15', days: [1, 2, 3, 4, 5] },
  { flightNumber: 'EW1401', dep: 'LHR', arr: 'FRA', depTime: '07:45', arrTime: '10:30', days: [1, 2, 3, 4, 5] },
  { flightNumber: 'EW1410', dep: 'FRA', arr: 'CDG', depTime: '08:00', arrTime: '09:15', days: [1, 2, 3, 4, 5, 6, 7] },
  { flightNumber: 'EW1411', dep: 'CDG', arr: 'FRA', depTime: '09:45', arrTime: '11:00', days: [1, 2, 3, 4, 5, 6, 7] },
];

// Aircraft rotation helper - creates more realistic flight patterns
function getConnectingFlights(route: any, allRoutes: any[], date: Date): any[] {
  const arrivalAirport = route.arr;
  const minTurnaroundTime = 45; // minutes
  const maxTurnaroundTime = 180; // 3 hours
  
  const routeArrivalTime = createDate(date, route.arrTime);
  
  return allRoutes.filter(nextRoute => {
    if (nextRoute.dep !== arrivalAirport) return false;
    
    const nextDepartureTime = createDate(date, nextRoute.depTime);
    const timeDiff = nextDepartureTime.getTime() - routeArrivalTime.getTime();
    
    return timeDiff >= minTurnaroundTime * 60 * 1000 && 
           timeDiff <= maxTurnaroundTime * 60 * 1000;
  });
}

// Enhanced duty creation with better aircraft utilization
function createRealisticDuty(routes: any[], date: Date, isDeadheadOnly: boolean = false) {
  const availableRoutes = routes.filter(route => 
    route.days.includes(getWeekday(date))
  );
  
  if (availableRoutes.length === 0) return null;
  
  const primaryRoute = availableRoutes[Math.floor(Math.random() * availableRoutes.length)];
  const connectingFlights = getConnectingFlights(primaryRoute, availableRoutes, date);
  
  // 70% chance of single sector, 25% chance of 2-sector, 5% chance of 3+ sectors
  const sectorCount = Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 2 : Math.floor(Math.random() * 2) + 3;
  
  const legs = [primaryRoute];
  let currentRoute = primaryRoute;
  
  for (let i = 1; i < sectorCount && connectingFlights.length > 0; i++) {
    const nextConnections = getConnectingFlights(currentRoute, availableRoutes, date);
    if (nextConnections.length === 0) break;
    
    const nextRoute = nextConnections[Math.floor(Math.random() * nextConnections.length)];
    legs.push(nextRoute);
    currentRoute = nextRoute;
  }
  
  return {
    flightNumber: legs[0].flightNumber,
    date: date.toISOString().split('T')[0],
    departureTime: legs[0].depTime,
    arrivalTime: legs[legs.length - 1].arrTime,
    departureLocation: legs[0].dep,
    arrivalLocation: legs[legs.length - 1].arr,
    legs: legs.map((leg, index) => ({
      legNumber: index + 1,
      departureTime: leg.depTime,
      arrivalTime: leg.arrTime,
      departureLocation: leg.dep,
      arrivalLocation: leg.arr,
      aircraftType: ['A320', 'A319', 'A321'][Math.floor(Math.random() * 3)]
    }))
  };
}

function createDate(baseDate: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(baseDate);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}

function getWeekday(date: Date): number {
  return date.getDay() === 0 ? 7 : date.getDay();
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generatePairingCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  return letters.charAt(Math.floor(Math.random() * letters.length)) +
         letters.charAt(Math.floor(Math.random() * letters.length)) +
         numbers.charAt(Math.floor(Math.random() * numbers.length)) +
         numbers.charAt(Math.floor(Math.random() * numbers.length));
}

async function main() {
  console.log('🚀 Starting Supabase database seeding...');

  try {
    // Step 1: Create sample users with Supabase Auth
    console.log('\n1️⃣ Creating sample users...');
    
    const sampleUsers = [
      // Flight Deck Crew
      { name: 'Captain Sarah Johnson', email: 'sarah.johnson@eurowings.com', role: 'CAPTAIN', base: 'PMI', isAdmin: true },
      { name: 'First Officer Mike Chen', email: 'mike.chen@eurowings.com', role: 'FIRST_OFFICER', base: 'PMI', isAdmin: false },
      { name: 'Captain Lisa Weber', email: 'lisa.weber@eurowings.com', role: 'CAPTAIN', base: 'ARN', isAdmin: false },
      { name: 'First Officer Tom Anderson', email: 'tom.anderson@eurowings.com', role: 'FIRST_OFFICER', base: 'ARN', isAdmin: false },
      { name: 'Captain Maria Rodriguez', email: 'maria.rodriguez@eurowings.com', role: 'CAPTAIN', base: 'PRG', isAdmin: false },
      { name: 'First Officer David Kim', email: 'david.kim@eurowings.com', role: 'FIRST_OFFICER', base: 'PRG', isAdmin: false },
      { name: 'Captain Anna Müller', email: 'anna.mueller@eurowings.com', role: 'CAPTAIN', base: 'VIE', isAdmin: false },
      { name: 'First Officer James Wilson', email: 'james.wilson@eurowings.com', role: 'FIRST_OFFICER', base: 'VIE', isAdmin: false },
      
      // Cabin Crew
      { name: 'Purser Sophie Dubois', email: 'sophie.dubois@eurowings.com', role: 'PURSER', base: 'SZG', isAdmin: false },
      { name: 'Purser Emma Schmidt', email: 'emma.schmidt@eurowings.com', role: 'PURSER', base: 'PMI', isAdmin: false },
      { name: 'Purser Marco Rossi', email: 'marco.rossi@eurowings.com', role: 'PURSER', base: 'ARN', isAdmin: false },
      { name: 'Flight Attendant Alex Thompson', email: 'alex.thompson@eurowings.com', role: 'CABIN_ATTENDANT', base: 'WP_PMI', isAdmin: false },
      { name: 'Flight Attendant Julia Martinez', email: 'julia.martinez@eurowings.com', role: 'CABIN_ATTENDANT', base: 'PMI', isAdmin: false },
      { name: 'Flight Attendant Kevin O\'Connor', email: 'kevin.oconnor@eurowings.com', role: 'CABIN_ATTENDANT', base: 'PRG', isAdmin: false },
      { name: 'Flight Attendant Lena Andersson', email: 'lena.andersson@eurowings.com', role: 'CABIN_ATTENDANT', base: 'VIE', isAdmin: false },
      { name: 'Flight Attendant Pierre Dubois', email: 'pierre.dubois@eurowings.com', role: 'CABIN_ATTENDANT', base: 'WP_BCN', isAdmin: false },
      { name: 'Flight Attendant Nina Kowalski', email: 'nina.kowalski@eurowings.com', role: 'CABIN_ATTENDANT', base: 'ARN', isAdmin: false },
      { name: 'Flight Attendant Carlos Mendez', email: 'carlos.mendez@eurowings.com', role: 'CABIN_ATTENDANT', base: 'WP_PRG', isAdmin: false },
    ];

    const ensuredUsers: { id: string; email: string; name: string; role: string; base?: string; isAdmin?: boolean }[] = [];
    
    for (const userData of sampleUsers) {
      try {
        // If profile already exists, keep it
        const { data: existingProfile } = await supabase
          .from('users')
          .select('id')
          .eq('email', userData.email)
          .maybeSingle();

        if (existingProfile?.id) {
          ensuredUsers.push({ ...userData, id: existingProfile.id });
          continue;
        }

        // Otherwise, ensure an auth user exists (create if needed)
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: 'CrewSwap2024!',
          email_confirm: true,
          user_metadata: {
            name: userData.name,
            role: userData.role,
            base: userData.base,
            is_admin: userData.isAdmin
          }
        });

        let authUserId: string | null = authUser?.user?.id ?? null;

        if (authError && !authUserId) {
          // User likely already exists in Auth; try to find by email
          const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
          const found = list?.users?.find((u: any) => u.email?.toLowerCase() === userData.email.toLowerCase());
          authUserId = found?.id ?? null;
        }

        if (!authUserId) {
          console.error(`❌ Could not ensure auth user for ${userData.email}:`, authError?.message);
          continue;
        }

        // Insert profile row (idempotent)
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authUserId,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            base: userData.base,
            is_admin: userData.isAdmin
          });

        if (profileError) {
          // If conflict or already exists, continue silently
          console.warn(`⚠️ Profile insert warning for ${userData.email}: ${profileError.message}`);
        } else {
          console.log(`✅ Created user: ${userData.name} (${userData.email})`);
        }

        ensuredUsers.push({ ...userData, id: authUserId });
      } catch (error) {
        console.error(`❌ Error ensuring user ${userData.email}:`, error);
      }
    }

    console.log(`\n✅ Ensured ${ensuredUsers.length} sample users exist`);

    // Fetch ALL existing users to assign duties to everyone
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .order('created_at', { ascending: true });

    if (allUsersError || !allUsers?.length) {
      console.error('❌ Failed to fetch all users for duty assignment:', allUsersError?.message);
      return;
    }

    // Step 2: Generate and insert duties
    console.log('\n2️⃣ Generating flight duties...');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Start from a week ago
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Go 30 days into the future
    
    const allDuties = [];
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dailyDuties = [];
      const dutiesPerDay = Math.floor(Math.random() * 15) + 10; // 10-25 duties per day
      
      for (let i = 0; i < dutiesPerDay; i++) {
        const duty = createRealisticDuty(eurowingsRoutes, new Date(date));
        if (duty) {
          dailyDuties.push(duty);
        }
      }
      
      allDuties.push(...dailyDuties);
    }

    console.log(`📅 Generated ${allDuties.length} duties over ${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`);

    // Step 3: Insert duties into database...
    console.log('\n3️⃣ Inserting duties into database...');
    
    let insertedCount = 0;
    const shuffledUsers = shuffle(allUsers);
    
    for (const duty of allDuties) {
      try {
        // Assign EVERY duty to a user, round-robin across ALL existing users
        const assignedUser = shuffledUsers[insertedCount % shuffledUsers.length];
        
        // Skip if a duty with same date and first flight number already exists
        const { data: existingForDay, error: existingCheckError } = await supabase
          .from('duties')
          .select('id, date, flight_legs(flight_number)')
          .eq('date', duty.date);

        if (existingCheckError) {
          console.error(`⚠️ Failed to check existing duties for ${duty.date}:`, existingCheckError.message);
        } else if (
          existingForDay?.some((d: any) => d.flight_legs?.some((fl: any) => fl.flight_number === duty.flightNumber))
        ) {
          // Duplicate found, skip
          continue;
        }

        const { data: insertedDuty, error: dutyError } = await supabase
          .from('duties')
          .insert({
            date: duty.date,
            user_id: assignedUser.id,
            pairing: generatePairingCode()
          })
          .select()
          .single();

        if (dutyError) {
          console.error(`❌ Failed to insert duty ${duty.flightNumber}:`, dutyError.message);
          continue;
        }

        // Insert flight legs
        for (const leg of duty.legs) {
          const { error: legError } = await supabase
            .from('flight_legs')
            .insert({
              duty_id: insertedDuty.id,
              flight_number: duty.flightNumber,
              departure_time: `${duty.date}T${leg.departureTime}:00Z`,
              arrival_time: `${duty.date}T${leg.arrivalTime}:00Z`,
              departure_location: leg.departureLocation,
              arrival_location: leg.arrivalLocation,
              is_deadhead: false
            });

          if (legError) {
            console.error(`❌ Failed to insert leg for duty ${duty.flightNumber}:`, legError.message);
          }
        }

        insertedCount++;
        
        if (insertedCount % 50 === 0) {
          console.log(`📊 Inserted ${insertedCount}/${allDuties.length} duties...`);
        }
      } catch (error) {
        console.error(`❌ Error inserting duty ${duty.flightNumber}:`, error);
      }
    }

    console.log(`\n✅ Successfully inserted ${insertedCount} duties`);

    // Step 4: Create some sample swap requests
    console.log('\n4️⃣ Creating sample swap requests...');
    
    const { data: assignedDuties, error: dutiesError } = await supabase
      .from('duties')
      .select('id, user_id, date, flight_legs(flight_number)')
      .not('user_id', 'is', null)
      .limit(20);

    if (dutiesError) {
      console.error('❌ Failed to fetch duties for swap requests:', dutiesError.message);
    } else if (assignedDuties && assignedDuties.length >= 4) {
      const swapRequests = [];
      
      for (let i = 0; i < Math.min(5, Math.floor(assignedDuties.length / 2)); i++) {
        const senderDuty = assignedDuties[i * 2];
        const targetDuty = assignedDuties[i * 2 + 1];
        
        if (senderDuty.user_id !== targetDuty.user_id) {
          const senderFlightNumber = senderDuty.flight_legs?.[0]?.flight_number || 'Flight';
          const targetFlightNumber = targetDuty.flight_legs?.[0]?.flight_number || 'Flight';
          
          swapRequests.push({
            sender_id: senderDuty.user_id,
            receiver_id: targetDuty.user_id,
            sender_duty_id: senderDuty.id,
            target_duty_id: targetDuty.id,
            message: `Hi! I'd like to swap my ${senderFlightNumber} on ${senderDuty.date} for your ${targetFlightNumber} on ${targetDuty.date}. Would this work for you?`,
            status: ['PENDING', 'APPROVED', 'DENIED'][Math.floor(Math.random() * 3)],
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      }

      for (const swapRequest of swapRequests) {
        const { error: swapError } = await supabase
          .from('swap_requests')
          .insert(swapRequest);

        if (swapError) {
          console.error('❌ Failed to create swap request:', swapError.message);
        }
      }

      console.log(`✅ Created ${swapRequests.length} sample swap requests`);
    }

    // Step 5: Create sample notifications
    console.log('\n5️⃣ Creating sample notifications...');
    
    const sampleNotifications = shuffledUsers.slice(0, 5).map(user => ({
      user_id: user.id,
      type: 'info',
      title: 'Welcome to CrewSwap!',
      message: 'Your account has been set up successfully. You can now view your duties and request swaps.',
      is_read: Math.random() > 0.5,
      created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
    }));

    for (const notification of sampleNotifications) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notification);

      if (notificationError) {
        console.error('❌ Failed to create notification:', notificationError.message);
      }
    }

    console.log(`✅ Created ${sampleNotifications.length} sample notifications`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`👥 Users (total in DB): ${shuffledUsers.length}`);
    console.log(`✈️  Duties: ${insertedCount}`);
    console.log(`🔄 Swap Requests: Created sample requests`);
    console.log(`🔔 Notifications: Created welcome notifications`);
    console.log('\n🔑 Login credentials:');
    console.log('📧 Email: Any of the created user emails');
    console.log('🔒 Password: CrewSwap2024!');
    console.log('\n🎯 You can now test your application with realistic data!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });
