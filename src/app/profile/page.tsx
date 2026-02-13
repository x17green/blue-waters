import { redirect } from 'next/navigation'

import { createClient } from '@/src/lib/supabase/server'

import ProfileClient from './profile-client'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user data from public.users table
  const { data: userData } = await supabase
    .from('users')
    .select('fullName, phone, role')
    .eq('id', user.id)
    .single()

  return <ProfileClient user={user} userData={userData || {}} />
}
