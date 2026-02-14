#!/usr/bin/env node

/**
 * Admin User Verification Script
 * Checks if admin user exists and provides login instructions
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
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'admin@bluewaters.ng';

async function verifyAdminUser() {
  console.log('🔍 Verifying admin user setup...\n');

  try {
    // Check Supabase Auth users
    console.log('📧 Checking Supabase Auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Failed to check auth users:', authError.message);
      return;
    }

    const authUser = authUsers.users.find(user => user.email === ADMIN_EMAIL);

    if (authUser) {
      console.log('✅ Admin user found in Supabase Auth:');
      console.log(`   🆔 User ID: ${authUser.id}`);
      console.log(`   📧 Email: ${authUser.email}`);
      console.log(`   ✅ Confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Admin user NOT found in Supabase Auth');
      console.log('   Please create the user manually in the Supabase dashboard');
      return;
    }

    // Check database record
    console.log('\n🗄️  Checking database record...');
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('❌ Database query error:', dbError.message);
      return;
    }

    if (dbUser) {
      console.log('✅ Admin user found in database:');
      console.log(`   🆔 User ID: ${dbUser.id}`);
      console.log(`   👤 Name: ${dbUser.full_name}`);
      console.log(`   🔒 Role: ${dbUser.role}`);
      console.log(`   📱 Phone: ${dbUser.phone || 'Not set'}`);
      console.log(`   ✅ Active: ${dbUser.is_active ? 'Yes' : 'No'}`);
    } else {
      console.log('⚠️  Admin user NOT found in database');
      console.log('   This is unusual - the seeding should have created this record');
    }

    // Provide login instructions
    console.log('\n🎉 ADMIN USER SETUP COMPLETE!');
    console.log('===============================');
    console.log('📋 Login Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log('   Password: Admin123!');
    console.log('   Role: admin');
    console.log('');
    console.log('🚀 Access the admin panel:');
    console.log('   1. Start the dev server: npm run dev');
    console.log('   2. Go to: http://localhost:3000/login');
    console.log('   3. Login with admin credentials');
    console.log('   4. Navigate to: http://localhost:3000/admin');
    console.log('');
    console.log('📊 Admin Panel Features:');
    console.log('   • Dashboard - System statistics');
    console.log('   • Users - User management');
    console.log('   • Payments - Transaction reconciliation');
    console.log('   • Audit Logs - System activity');
    console.log('   • Reports - Analytics & reporting');
    console.log('   • Settings - System configuration');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

// Run the script
verifyAdminUser();
