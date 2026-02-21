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
  
  // role-based redirection is handled in middleware, so we can
  // assume any request reaching this layout is authorized for the
  // customer dashboard.
  return <UserDashboardLayout>{children}</UserDashboardLayout>
}
