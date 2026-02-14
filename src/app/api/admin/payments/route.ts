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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabase
      .from('payments')
      .select(`
        id,
        booking_id,
        amount,
        currency,
        method,
        status,
        reference,
        created_at,
        updated_at,
        bookings:bookings(
          id,
          users:users(
            first_name,
            last_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: payments, error, count } = await query

    if (error) {
      console.error('Error fetching payments:', error)
      return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
    }

    // Calculate summary statistics
    const { data: stats, error: statsError } = await supabase
      .from('payments')
      .select('amount, status, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    let summary = {
      totalRevenue: 0,
      successfulPayments: 0,
      pendingPayments: 0,
      failedPayments: 0
    }

    if (!statsError && stats) {
      summary = stats.reduce((acc, payment) => {
        acc.totalRevenue += payment.amount
        if (payment.status === 'completed') acc.successfulPayments++
        else if (payment.status === 'pending') acc.pendingPayments++
        else if (payment.status === 'failed') acc.failedPayments++
        return acc
      }, summary)
    }

    return NextResponse.json({
      payments: payments?.map(payment => ({
        id: payment.id,
        bookingId: payment.booking_id,
        customer: payment.bookings && payment.bookings.length > 0 && payment.bookings[0].users && payment.bookings[0].users.length > 0 ?
          `${payment.bookings[0].users[0].first_name} ${payment.bookings[0].users[0].last_name}` :
          'Unknown',
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        status: payment.status,
        date: payment.created_at,
        reference: payment.reference
      })) || [],
      summary,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Admin payments API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}