import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  console.log('🚀 Creating test user via direct SQL...');
  
  try {
    // Generate a UUID for the user
    const userId = crypto.randomUUID();
    
    // First, insert into auth.users using raw SQL
    const { data: authResult, error: authError } = await supabase.rpc('create_test_auth_user', {
      user_id: userId,
      user_email: 'test@eurowings.com',
      user_password: 'CrewSwap2024!'
    });

    if (authError) {
      console.error('❌ Failed to create auth user:', authError);
      
      // Fallback: try to insert directly into users table with a manual UUID
      console.log('🔄 Trying fallback approach...');
      
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: 'test@eurowings.com',
          name: 'Test Captain',
          role: 'CAPTAIN',
          base: 'PMI',
          is_admin: false
        });

      if (userError) {
        console.error('❌ Fallback failed:', userError);
        return;
      }
      
      console.log('✅ Created test user via fallback (no auth, but can test data)');
      console.log('📧 Email: test@eurowings.com');
      console.log('🆔 ID:', userId);
      return;
    }

    // If auth user creation succeeded, create profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: 'test@eurowings.com',
        name: 'Test Captain',
        role: 'CAPTAIN',
        base: 'PMI',
        is_admin: false
      });

    if (profileError) {
      console.error('❌ Failed to create user profile:', profileError);
      return;
    }

    console.log('✅ Successfully created test user!');
    console.log('📧 Email: test@eurowings.com');
    console.log('🔒 Password: CrewSwap2024!');
    console.log('🆔 ID:', userId);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTestUser();
