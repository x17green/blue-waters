import { redirect } from 'next/navigation'

import { createClient } from '@/src/lib/supabase/server'

import DashboardClient from './dashboard-client'

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's bookings
  const { data: bookings } = await supabase
    .from('Booking')
    .select(
      `
      *,
      trip:Trip(
        *,
        vessel:Vessel(*),
        schedule:TripSchedule(*)
      )
    `,
    )
    .eq('userId', user.id)
    .order('createdAt', { ascending: false })

  return <DashboardClient user={user} bookings={bookings || []} />
}
