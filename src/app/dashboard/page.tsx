import { redirect } from 'next/navigation'

import { createClient } from '@/src/lib/supabase/server'
import DashboardClient from './dashboard-client'

/**
 * Customer Dashboard Page (Server Component)
 * 
 * Server-side rendering with auth/role checks and data fetching.
 * No race condition - operators are redirected before page renders.
 * 
 * Security:
 * - Role check handled by layout.tsx (customers only)
 * - Server-side data fetching
 * - Passes data to client component for interactivity
 */

interface Booking {
  id: string
  trip_id: string
  booking_reference: string
  number_of_passengers: number
  total_amount: number
  booking_status: string
  created_at: string
}

export default async function Dashboard() {
  const supabase = await createClient()
  
  // Get authenticated user (guaranteed by layout)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?redirectTo=/dashboard')
  }
  
  // Fetch user data
  const { data: appUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // Fetch bookings server-side
  const { data: bookingsData } = await supabase
    .from('Booking')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  const bookings: Booking[] = bookingsData || []
  
  return <DashboardClient user={user} appUser={appUser} bookings={bookings} />
}
