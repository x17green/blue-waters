import { redirect } from 'next/navigation'

import { createClient } from '@/src/lib/supabase/server'
import DashboardClient from './dashboard-client'

// API Response Types
interface ApiBooking {
  id: string
  reference: string
  status: string
  paymentStatus: string
  numberOfPassengers: number
  totalAmount: number
  createdAt: string
  tripSchedule: {
    startTime: string
    trip: {
      title: string
      description: string
    }
    vessel: {
      name: string
    }
  }
}

interface ApiResponse {
  bookings: ApiBooking[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

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
  
  // Fetch bookings from API (real data)
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  
  const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/bookings?limit=50`, {
    headers: {
      'Cookie': cookieStore.toString(),
    },
  })

  if (!bookingsResponse.ok) {
    console.error('Failed to fetch bookings:', bookingsResponse.statusText)
    // Fallback to empty array if API fails
    const bookings: Booking[] = []
    return <DashboardClient user={user} appUser={appUser} bookings={bookings} />
  }

  const bookingsData: ApiResponse = await bookingsResponse.json()
  
  // Transform API response to match dashboard expectations
  const bookings: Booking[] = bookingsData.bookings.map((booking) => ({
    id: booking.id,
    trip_id: booking.tripSchedule.trip.title, // Use trip title as trip_id for display
    booking_reference: booking.reference,
    number_of_passengers: booking.numberOfPassengers,
    total_amount: booking.totalAmount, // Already converted from kobo to naira
    booking_status: booking.status,
    created_at: booking.createdAt,
  }))
  
  return <DashboardClient user={user} appUser={appUser} bookings={bookings} />
}
