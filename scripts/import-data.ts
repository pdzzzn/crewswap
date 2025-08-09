import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function importData() {
  console.log('Starting data import...');
  
  if (!fs.existsSync('data-export.json')) {
    console.error('data-export.json not found. Please run export-data.ts first.');
    return;
  }

  const data = JSON.parse(fs.readFileSync('data-export.json', 'utf8'));
  console.log(`Found ${data.users?.length || 0} users, ${data.duties?.length || 0} duties, ${data.swapRequests?.length || 0} swap requests, ${data.notifications?.length || 0} notifications`);

  // Step 1: Import users (create auth users first)
  console.log('\n1. Importing users...');
  const userIdMapping: { [oldId: string]: string } = {};
  
  for (const user of data.users || []) {
    try {
      const { data: authUser, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'TempPassword123!', // Users need to reset
        email_confirm: true,
        user_metadata: { 
          name: user.name, 
          role: user.role,
          base: user.base
        }
      });
      
      if (error) {
        console.error(`Failed to create auth user for ${user.email}:`, error.message);
        continue;
      }

      // Map old user ID to new Supabase auth user ID
      userIdMapping[user.id] = authUser.user.id;

      // Update the users table with additional profile data
      const { error: profileError } = await supabase.from('users').update({
        name: user.name,
        role: user.role,
        base: user.base,
        is_admin: user.isAdmin || false
      }).eq('id', authUser.user.id);

      if (profileError) {
        console.error(`Failed to update profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`✓ Created user: ${user.name} (${user.email})`);
      }
    } catch (err) {
      console.error(`Error importing user ${user.email}:`, err);
    }
  }

  // Step 2: Import duties with legs
  console.log('\n2. Importing duties...');
  const dutyIdMapping: { [oldId: string]: string } = {};
  
  for (const duty of data.duties || []) {
    try {
      // Map assigned user ID if it exists
      const assignedUserId = duty.assignedUserId ? userIdMapping[duty.assignedUserId] : null;

      const { data: newDuty, error } = await supabase.from('duties').insert({
        flight_number: duty.flightNumber,
        date: duty.date,
        departure_time: duty.departureTime,
        arrival_time: duty.arrivalTime,
        departure_location: duty.departureLocation,
        arrival_location: duty.arrivalLocation,
        assigned_user_id: assignedUserId
      }).select().single();

      if (error) {
        console.error(`Failed to import duty ${duty.flightNumber}:`, error.message);
        continue;
      }

      dutyIdMapping[duty.id] = newDuty.id;

      // Import duty legs if they exist
      if (duty.legs && duty.legs.length > 0) {
        for (const leg of duty.legs) {
          const { error: legError } = await supabase.from('duty_legs').insert({
            duty_id: newDuty.id,
            leg_number: leg.legNumber,
            departure_time: leg.departureTime,
            arrival_time: leg.arrivalTime,
            departure_location: leg.departureLocation,
            arrival_location: leg.arrivalLocation,
            aircraft_type: leg.aircraftType
          });

          if (legError) {
            console.error(`Failed to import leg for duty ${duty.flightNumber}:`, legError.message);
          }
        }
      }

      console.log(`✓ Imported duty: ${duty.flightNumber} on ${duty.date}`);
    } catch (err) {
      console.error(`Error importing duty ${duty.flightNumber}:`, err);
    }
  }

  // Step 3: Import swap requests
  console.log('\n3. Importing swap requests...');
  
  for (const swapRequest of data.swapRequests || []) {
    try {
      const senderId = userIdMapping[swapRequest.senderId];
      const receiverId = userIdMapping[swapRequest.receiverId];
      const senderDutyId = dutyIdMapping[swapRequest.senderDutyId];
      const targetDutyId = dutyIdMapping[swapRequest.targetDutyId];

      if (!senderId || !receiverId || !senderDutyId || !targetDutyId) {
        console.warn(`Skipping swap request ${swapRequest.id} - missing mapped IDs`);
        continue;
      }

      const { error } = await supabase.from('swap_requests').insert({
        sender_id: senderId,
        receiver_id: receiverId,
        sender_duty_id: senderDutyId,
        target_duty_id: targetDutyId,
        message: swapRequest.message,
        status: swapRequest.status,
        response_message: swapRequest.responseMessage,
        created_at: swapRequest.createdAt
      });

      if (error) {
        console.error(`Failed to import swap request ${swapRequest.id}:`, error.message);
      } else {
        console.log(`✓ Imported swap request from ${swapRequest.senderId} to ${swapRequest.receiverId}`);
      }
    } catch (err) {
      console.error(`Error importing swap request ${swapRequest.id}:`, err);
    }
  }

  // Step 4: Import notifications
  console.log('\n4. Importing notifications...');
  
  for (const notification of data.notifications || []) {
    try {
      const userId = userIdMapping[notification.userId];
      const swapRequestId = notification.swapRequestId ? dutyIdMapping[notification.swapRequestId] : null;

      if (!userId) {
        console.warn(`Skipping notification ${notification.id} - user not found`);
        continue;
      }

      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        is_read: notification.isRead || false,
        swap_request_id: swapRequestId,
        created_at: notification.createdAt
      });

      if (error) {
        console.error(`Failed to import notification ${notification.id}:`, error.message);
      } else {
        console.log(`✓ Imported notification for user ${notification.userId}`);
      }
    } catch (err) {
      console.error(`Error importing notification ${notification.id}:`, err);
    }
  }

  console.log('\n✅ Data import completed!');
  console.log('\n📝 Important notes:');
  console.log('- All users have been created with temporary password: TempPassword123!');
  console.log('- Users will need to reset their passwords on first login');
  console.log('- Please verify the imported data in your Supabase dashboard');
}

importData().catch(console.error);