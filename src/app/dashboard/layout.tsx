import { redirect } from 'next/navigation'

import { createClient } from '@/src/lib/supabase/server'
import UserDashboardLayout from '@/src/components/layouts/user-dashboard-layout'

/**
 * Dashboard Layout
 * 
 * Server Component with role-based access control.
 * Wraps all customer dashboard routes (dashboard/*) with UserDashboardLayout.
 * This ensures consistent navigation, header, and footer across all dashboard pages.
 * 
 * Security:
 * - Server-side authentication check (no race condition)
 * - Admins are redirected to /admin
 * - Operators/staff are redirected to /operator/dashboard
 * - Only customers can access this layout
 * 
 * Routes covered:
 * - /dashboard (main dashboard)
 * - /dashboard/* (any nested routes)
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Server-side auth check - runs BEFORE any client code
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?redirectTo=/dashboard')
  }
  
  // Server-side role check - NO RACE CONDITION
  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  
  if (error) {
    console.error('[Dashboard Layout] Error fetching user role:', error)
  }
  
  const userRole = userData?.role || 'customer'
  
  // Redirect based on role BEFORE any client code runs
  if (userRole === 'admin') {
    redirect('/admin')
  } else if (['operator', 'staff'].includes(userRole)) {
    redirect('/operator/dashboard')
  }
  
  // Only customers reach this point
  return <UserDashboardLayout>{children}</UserDashboardLayout>
}
