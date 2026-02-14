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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const offset = (page - 1) * limit

    let query = supabase
      .from('audit_logs')
      .select(`
        id,
        action,
        details,
        ip_address,
        user_agent,
        created_at,
        users!audit_logs_user_id_fkey (
          id,
          email,
          first_name,
          last_name,
          role
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (action) {
      query = query.eq('action', action)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (startDate) {
      query = query.gte('created_at', startDate)
    }

    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: auditLogs, error: logsError } = await query

    if (logsError) {
      console.error('Error fetching audit logs:', logsError)
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('audit_logs')
      .select('id', { count: 'exact', head: true })

    if (action) {
      countQuery = countQuery.eq('action', action)
    }

    if (userId) {
      countQuery = countQuery.eq('user_id', userId)
    }

    if (startDate) {
      countQuery = countQuery.gte('created_at', startDate)
    }

    if (endDate) {
      countQuery = countQuery.lte('created_at', endDate)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Error counting audit logs:', countError)
    }

    // Get action types for filtering
    const { data: actionTypes, error: actionsError } = await supabase
      .from('audit_logs')
      .select('action')
      .order('action')

    const uniqueActions = [...new Set(actionTypes?.map(log => log.action) || [])]

    return NextResponse.json({
      auditLogs: auditLogs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      filters: {
        actions: uniqueActions
      }
    })

  } catch (error) {
    console.error('Unexpected error in audit logs API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}