#!/usr/bin/env node

/**
 * Admin User Creation Script
 * Creates an admin user in Supabase Auth and ensures database record exists
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Fallback to .env if .env.local doesn't exist
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  config({ path: '.env' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✅ Set' : '❌ Missing');
  console.error('');
  console.error('📝 Please ensure your .env.local file contains:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  console.error('');
  console.error('🔑 Get these from: https://supabase.com/dashboard → Settings → API');
  process.exit(1);
}

// Create Supabase client with service role key (required for admin operations)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME || 'Admin User';

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Missing required admin credentials:');
  console.error('   ADMIN_EMAIL:', ADMIN_EMAIL ? '✅ Set' : '❌ Missing');
  console.error('   ADMIN_PASSWORD:', ADMIN_PASSWORD ? '✅ Set' : '❌ Missing');
  console.error('');
  console.error('🔐 For security, admin credentials must be explicitly set via environment variables.');
  console.error('   Add to your .env.local file:');
  console.error('   ADMIN_EMAIL=your-admin@example.com');
  console.error('   ADMIN_PASSWORD=your-secure-password');
  process.exit(1);
}

async function createUserWithRetry(payload, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    const { data, error } = await supabase.auth.admin.createUser(payload);
    if (!error) return { data, error: null };

    const isTransient = error.status >= 500;
    if (!isTransient) return { data: null, error };

    console.log(`⚠️ createUser attempt ${i+1} failed with ${error.status}, retrying...`);
    await new Promise(r => setTimeout(r, 500 * Math.pow(2, i)));
  }
  return { data: null, error: new Error('createUser failed after retries') };
}

async function createAdminUser() {
  console.log('🚀 Creating admin user...');
  console.log(`📧 Email: ${ADMIN_EMAIL}`);
  console.log(`👤 Name: ${ADMIN_FULL_NAME}`);
  console.log('');

  try {
    // Check if user already exists in auth
    console.log('🔍 Checking if admin user already exists in Supabase Auth...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Failed to check existing users:', listError.message);
      return;
    }

    console.log(`Found ${existingUsers.users.length} users in Supabase Auth:`);
    existingUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.email_confirmed_at ? 'confirmed' : 'unconfirmed'})`);
    });
    console.log('');

    const existingUser = existingUsers.users.find(user => user.email === ADMIN_EMAIL);

    if (existingUser) {
      console.log('✅ Admin user already exists in Supabase Auth');
      console.log(`📧 Email confirmed: ${existingUser.email_confirmed_at ? 'Yes' : 'No'}`);

      // Check if the user is confirmed
      if (!existingUser.email_confirmed_at) {
        console.log('📧 Confirming email for existing user...');
        const { error: confirmError } = await supabase.auth.admin.updateUserById(existingUser.id, {
          email_confirm: true
        });

        if (confirmError) {
          console.error('❌ Failed to confirm email:', confirmError.message);
        } else {
          console.log('✅ Email confirmed');
        }
      }
    } else {
      // Create new admin user
      console.log('📝 Creating new admin user in Supabase Auth...');
      const { data, error } = await createUserWithRetry({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: ADMIN_FULL_NAME,
          user_type: 'admin'
        }
      });

      if (error) {
        console.error('❌ Failed to create admin user:', error.message || error);
        // Log the full error object if possible for debugging
        try {
          console.error('📋 Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        } catch (e) {
          console.error('📋 Full error details (raw):', error);
        }

        // If user already exists, try to find and update them
        if (error.message.includes('already') || error.message.includes('exists')) {
          console.log('🔄 User might already exist, trying to find and update...');
          const { data: existingUserData, error: findError } = await supabase.auth.admin.getUserByEmail(ADMIN_EMAIL);

          if (!findError && existingUserData.user) {
            console.log('✅ Found existing user, ensuring email is confirmed...');
            const { error: updateError } = await supabase.auth.admin.updateUserById(existingUserData.user.id, {
              email_confirm: true,
              password: ADMIN_PASSWORD, // Reset password just in case
              user_metadata: {
                full_name: ADMIN_FULL_NAME
              }
            });

            if (updateError) {
              console.error('❌ Failed to update existing user:', updateError.message);
              return;
            }

            console.log('✅ Existing user updated successfully!');
            console.log(`🆔 User ID: ${existingUserData.user.id}`);
          } else {
            console.error('❌ Could not find or update existing user');
            return;
          }
        } else {
          return;
        }
      } else {
        console.log('✅ Admin user created successfully in Supabase Auth!');
        console.log(`🆔 User ID: ${data.user.id}`);
      }
    }

    // Ensure database record exists with admin role
    console.log('');
    console.log('🗄️  Ensuring admin user exists in database with correct role...');

    // First, try to find existing user by email
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .single();

    if (dbError && dbError.message && !dbError.message.toLowerCase().includes('no rows')) {
      console.error('❌ Database query error:', dbError.message);
      return;
    }

    if (dbUser) {
      // Update existing user to ensure admin role
      if (dbUser.role !== 'admin') {
        console.log('🔄 Updating user role to admin...');
        const { error: updateError } = await supabase
          .from('users')
          .update({
            role: 'admin',
            isActive: true,
            fullName: ADMIN_FULL_NAME,
            phone: '+2348011111111'
          })
          .eq('id', dbUser.id);

        if (updateError) {
          console.error('❌ Failed to update user role:', updateError.message);
          return;
        }
        console.log('✅ User role updated to admin');
      } else {
        console.log('✅ User already has admin role');
      }
    } else {
      // Get the auth user ID to create database record
      const { data: authUser } = await supabase.auth.admin.getUserByEmail(ADMIN_EMAIL);

      if (!authUser || !authUser.user) {
        console.error('❌ Could not find auth user to create database record');
        return;
      }

      console.log('📝 Creating database record for admin user...');
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          email: ADMIN_EMAIL,
          fullName: ADMIN_FULL_NAME,
          phone: '+2348011111111',
          role: 'admin',
          isActive: true
        });

      if (insertError) {
        console.error('❌ Failed to create database record:', insertError.message);
        return;
      }
      console.log('✅ Database record created');
    }

    console.log('');
    console.log('🎉 Admin user setup complete!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role: admin`);
    console.log('');
    console.log('🚀 You can now login at /login and access the admin panel at /admin');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.error('Stack:', err.stack);
  }
}

// Run the script
createAdminUser();
