import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkRLS() {
  console.log('🔍 Checking RLS policies on users table...\n')

  try {
    // Check if RLS is enabled on users table
    const { data: rlsEnabled, error: rlsError } = await supabase.rpc('check_rls_status', {
      table_name: 'users'
    })

    if (rlsError) {
      console.log('❌ Could not check RLS status via RPC')
      console.log('Error:', rlsError.message)
    } else {
      console.log('✅ RLS Status:', rlsEnabled ? 'ENABLED' : 'DISABLED')
    }

    // Try to query users table directly
    console.log('\n📋 Attempting to query users table...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5)

    if (usersError) {
      console.log('❌ Error querying users table:', usersError.message)
      console.log('Code:', usersError.code)
    } else {
      console.log('✅ Successfully queried users table')
      console.log('Users found:', users.length)
      if (users.length > 0) {
        console.log('Sample user:', users[0])
      }
    }

    // Try to insert a test user (this should fail if RLS blocks it)
    console.log('\n🧪 Testing user insertion (should fail with RLS)...')
    const testUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {}
    }

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)

    if (insertError) {
      console.log('❌ Insert failed (expected with RLS):', insertError.message)
      console.log('Code:', insertError.code)
    } else {
      console.log('⚠️  Insert succeeded (RLS may not be blocking)')
      console.log('Inserted:', insertData)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

checkRLS()