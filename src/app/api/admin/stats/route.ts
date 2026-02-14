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

    // Check user role
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (roleError || userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get dashboard statistics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    // Users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Active bookings today
    const { count: activeBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // Revenue calculations
    const { data: revenueData, error: revenueError } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('status', 'completed')
      .gte('created_at', lastMonth.toISOString())

    const totalRevenue = revenueData?.reduce((sum, payment) => sum + payment.amount, 0) || 0

    // Revenue comparison (last month vs this month)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const { data: thisMonthRevenue, error: thisMonthError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', thisMonth.toISOString())

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1)
    const { data: lastMonthRevenue, error: lastMonthError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', lastMonthStart.toISOString())
      .lt('created_at', lastMonthEnd.toISOString())

    const thisMonthTotal = thisMonthRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0
    const lastMonthTotal = lastMonthRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0
    const revenueChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

    // System health (simplified - in real app, check various services)
    const systemHealth = 98 // This would be calculated based on actual system checks

    // Recent activity (last 10 events)
    const { data: recentActivity, error: activityError } = await supabase
      .from('audit_logs')
      .select('action, details, created_at, users(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(10)

    if (usersError || bookingsError || revenueError) {
      console.error('Error fetching admin stats:', { usersError, bookingsError, revenueError })
      return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
    }

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeBookings: activeBookings || 0,
        totalRevenue,
        revenueChange: Math.round(revenueChange * 100) / 100,
        systemHealth
      },
      recentActivity: recentActivity?.map(activity => ({
        action: activity.action,
        details: activity.details,
        timestamp: activity.created_at,
        user: activity.users && activity.users.length > 0 ? `${activity.users[0].first_name} ${activity.users[0].last_name}` : 'System'
      })) || []
    })

  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}