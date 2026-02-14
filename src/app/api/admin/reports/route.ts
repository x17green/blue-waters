import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'overview'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const dateFilter = startDate && endDate ? {
      gte: startDate,
      lte: endDate
    } : {}

    let reportData = {}

    switch (reportType) {
      case 'overview':
        reportData = await generateOverviewReport(supabase, dateFilter)
        break
      case 'revenue':
        reportData = await generateRevenueReport(supabase, dateFilter)
        break
      case 'bookings':
        reportData = await generateBookingsReport(supabase, dateFilter)
        break
      case 'users':
        reportData = await generateUsersReport(supabase, dateFilter)
        break
      default:
        reportData = await generateOverviewReport(supabase, dateFilter)
    }

    return NextResponse.json(reportData)

  } catch (error) {
    console.error('Unexpected error in reports API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateOverviewReport(supabase: any, dateFilter: any) {
  // Revenue metrics
  const { data: revenueData, error: revenueError } = await supabase
    .from('payments')
    .select('amount, status, created_at')
    .eq('status', 'completed')
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())

  // Booking metrics
  const { data: bookingData, error: bookingError } = await supabase
    .from('bookings')
    .select('status, created_at, total_price')
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())

  // User metrics
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, created_at')
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())

  const totalRevenue = revenueData?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0
  const totalBookings = bookingData?.length || 0
  const completedBookings = bookingData?.filter((b: any) => b.status === 'confirmed').length || 0
  const totalUsers = userData?.length || 0
  const newCustomers = userData?.filter((u: any) => u.role === 'customer').length || 0

  return {
    type: 'overview',
    period: dateFilter,
    metrics: {
      totalRevenue,
      totalBookings,
      completedBookings,
      totalUsers,
      newCustomers,
      conversionRate: totalBookings > 0 ? (completedBookings / totalBookings * 100).toFixed(1) : 0
    },
    charts: {
      revenueByMonth: await getRevenueByMonth(supabase, dateFilter),
      bookingsByStatus: await getBookingsByStatus(supabase, dateFilter),
      usersByRole: await getUsersByRole(supabase, dateFilter)
    }
  }
}

async function generateRevenueReport(supabase: any, dateFilter: any) {
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      amount,
      status,
      method,
      created_at,
      bookings (
        trip_id,
        total_price
      )
    `)
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())
    .order('created_at', { ascending: false })

  const revenueByMethod = payments?.reduce((acc: Record<string, number>, payment: any) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount
    return acc
  }, {}) || {}

  const revenueByStatus = payments?.reduce((acc: Record<string, number>, payment: any) => {
    acc[payment.status] = (acc[payment.status] || 0) + payment.amount
    return acc
  }, {}) || {}

  return {
    type: 'revenue',
    period: dateFilter,
    summary: {
      totalRevenue: payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0,
      successfulPayments: payments?.filter((p: any) => p.status === 'completed').length || 0,
      failedPayments: payments?.filter((p: any) => p.status === 'failed').length || 0
    },
    breakdowns: {
      byMethod: revenueByMethod,
      byStatus: revenueByStatus,
      byMonth: await getRevenueByMonth(supabase, dateFilter)
    },
    transactions: payments || []
  }
}

async function generateBookingsReport(supabase: any, dateFilter: any) {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      total_price,
      created_at,
      updated_at,
      users (
        first_name,
        last_name,
        email
      ),
      trips (
        name,
        destination
      )
    `)
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())
    .order('created_at', { ascending: false })

  const bookingsByStatus = bookings?.reduce((acc: Record<string, number>, booking: any) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1
    return acc
  }, {}) || {}

  const revenueByTrip = bookings?.reduce((acc: Record<string, number>, booking: any) => {
    const tripName = booking.trips?.name || 'Unknown'
    acc[tripName] = (acc[tripName] || 0) + booking.total_price
    return acc
  }, {}) || {}

  return {
    type: 'bookings',
    period: dateFilter,
    summary: {
      totalBookings: bookings?.length || 0,
      confirmedBookings: bookings?.filter((b: any) => b.status === 'confirmed').length || 0,
      cancelledBookings: bookings?.filter((b: any) => b.status === 'cancelled').length || 0,
      totalRevenue: bookings?.reduce((sum: number, b: any) => sum + b.total_price, 0) || 0
    },
    breakdowns: {
      byStatus: bookingsByStatus,
      byTrip: revenueByTrip,
      byMonth: await getBookingsByMonth(supabase, dateFilter)
    },
    bookings: bookings || []
  }
}

async function generateUsersReport(supabase: any, dateFilter: any) {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, created_at, last_sign_in_at')
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())
    .order('created_at', { ascending: false })

  const usersByRole = users?.reduce((acc: Record<string, number>, user: any) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {}) || {}

  const signUpTrend = users?.reduce((acc: Record<string, number>, user: any) => {
    const month = new Date(user.created_at).toISOString().slice(0, 7)
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {}) || {}

  return {
    type: 'users',
    period: dateFilter,
    summary: {
      totalUsers: users?.length || 0,
      activeUsers: users?.filter((u: any) => u.last_sign_in_at).length || 0,
      newUsers: users?.length || 0
    },
    breakdowns: {
      byRole: usersByRole,
      signUpTrend
    },
    users: users || []
  }
}

// Helper functions for chart data
async function getRevenueByMonth(supabase: any, dateFilter: any) {
  const { data } = await supabase
    .from('payments')
    .select('amount, created_at')
    .eq('status', 'completed')
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())

  return data?.reduce((acc: Record<string, number>, payment: any) => {
    const month = new Date(payment.created_at).toISOString().slice(0, 7)
    acc[month] = (acc[month] || 0) + payment.amount
    return acc
  }, {}) || {}
}

async function getBookingsByStatus(supabase: any, dateFilter: any) {
  const { data } = await supabase
    .from('bookings')
    .select('status')
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())

  return data?.reduce((acc: Record<string, number>, booking: any) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1
    return acc
  }, {}) || {}
}

async function getUsersByRole(supabase: any, dateFilter: any) {
  const { data } = await supabase
    .from('users')
    .select('role')
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())

  return data?.reduce((acc: Record<string, number>, user: any) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {}) || {}
}

async function getBookingsByMonth(supabase: any, dateFilter: any) {
  const { data } = await supabase
    .from('bookings')
    .select('created_at')
    .gte('created_at', dateFilter.gte || '2024-01-01')
    .lte('created_at', dateFilter.lte || new Date().toISOString())

  return data?.reduce((acc: Record<string, number>, booking: any) => {
    const month = new Date(booking.created_at).toISOString().slice(0, 7)
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {}) || {}
}