import { redirect } from 'next/navigation'

import { createClient } from '@/src/lib/supabase/server'
import AdminDashboardLayout from '@/src/components/layouts/admin-dashboard-layout'

/**
 * Admin Dashboard Layout
 *
 * Server Component with role-based access control.
 * Wraps all admin dashboard routes (admin/*) with AdminDashboardLayout.
 * This ensures consistent navigation, header, and footer across all admin pages.
 *
 * Security:
 * - Server-side authentication check (no race condition)
 * - Only admin users can access this layout
 * - Non-admin users are redirected to appropriate dashboards
 *
 * Routes covered:
 * - /admin (admin dashboard)
 * - /admin/users (user management)
 * - /admin/payments (payment reconciliation)
 * - /admin/audit-logs (system activity)
 * - /admin/reports (analytics & reporting)
 * - /admin/settings (system configuration)
 * - /admin/* (any nested admin routes)
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Server-side auth check - runs BEFORE any client code
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin')
  }

  // Server-side role check - NO RACE CONDITION
  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('[Admin Layout] Error fetching user role:', error)
  }

  const userRole = userData?.role || 'customer'

  // Redirect non-admin users BEFORE any client code runs
  if (userRole !== 'admin') {
    // Redirect based on their actual role
    if (['operator', 'staff'].includes(userRole)) {
      redirect('/operator/dashboard')
    } else {
      redirect('/dashboard')
    }
  }

  // Only admins reach this point
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>
}
