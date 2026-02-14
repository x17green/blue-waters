import { redirect } from 'next/navigation'

import { createClient } from '@/src/lib/supabase/server'
import OperatorDashboardLayout from '@/src/components/layouts/operator-dashboard-layout'

/**
 * Operator Dashboard Layout
 * 
 * Server Component with role-based access control.
 * Wraps all operator dashboard routes (operator/*) with OperatorDashboardLayout.
 * This ensures consistent navigation, header, and footer across all operator pages.
 * 
 * Security:
 * - Server-side authentication check (no race condition)
 * - Admins are redirected to /admin
 * - Customers are redirected to /dashboard
 * - Only operators/staff can access this layout
 * 
 * Routes covered:
 * - /operator/dashboard (operator overview)
 * - /operator/trips (trip management)
 * - /operator/bookings (booking management)
 * - /operator/* (any nested operator routes)
 */
export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Server-side auth check - runs BEFORE any client code
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?redirectTo=/operator/dashboard')
  }
  
  // Server-side role check - NO RACE CONDITION
  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  
  if (error) {
    console.error('[Operator Layout] Error fetching user role:', error)
  }
  
  const userRole = userData?.role || 'customer'
  
  // Redirect based on role BEFORE any client code runs
  if (userRole === 'admin') {
    redirect('/admin')
  } else if (!['operator', 'staff'].includes(userRole)) {
    redirect('/dashboard')
  }
  
  // Only operators/staff/admins reach this point
  return <OperatorDashboardLayout>{children}</OperatorDashboardLayout>
}
