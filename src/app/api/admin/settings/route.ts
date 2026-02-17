import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
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

    // For now, return mock settings data
    // In a real implementation, you'd fetch from a settings table
    const settings = {
      general: {
        siteName: 'Bayelsa Boat Club',
        siteDescription: 'Premium boat cruise experiences in Bayelsa',
        contactEmail: 'info@bluewatersbayelsa.com',
        contactPhone: '+234-XXX-XXXXXXX',
        timezone: 'Africa/Lagos',
        currency: 'NGN'
      },
      booking: {
        maxAdvanceBookingDays: 90,
        minAdvanceBookingHours: 24,
        cancellationPolicy: '24 hours',
        refundPolicy: 'Full refund within 24 hours',
        maxPassengersPerBooking: 20,
        requirePhoneVerification: true
      },
      payment: {
        supportedMethods: ['card', 'bank_transfer', 'wallet'],
        currency: 'NGN',
        taxRate: 7.5,
        serviceCharge: 2.5,
        paymentTimeoutMinutes: 30,
        autoRefundOnCancellation: true
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: true,
        bookingConfirmations: true,
        paymentReminders: true,
        adminAlerts: true,
        marketingEmails: false
      },
      security: {
        sessionTimeoutHours: 24,
        passwordMinLength: 8,
        requireTwoFactor: false,
        maxLoginAttempts: 5,
        ipWhitelist: [],
        auditLogRetentionDays: 365
      }
    }

    return NextResponse.json({ settings })

  } catch (error) {
    console.error('Unexpected error in settings API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { section, settings } = body

    // Log the settings change
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'settings_changed',
        details: {
          section,
          changes: settings,
          timestamp: new Date().toISOString()
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })

    // In a real implementation, you'd update the settings in the database
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      section,
      settings
    })

  } catch (error) {
    console.error('Unexpected error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}