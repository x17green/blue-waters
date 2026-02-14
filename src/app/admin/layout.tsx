import { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Icon from "@mdi/react"
import { mdiViewDashboard, mdiAccountGroup, mdiCreditCard, mdiFileChart, mdiShieldCheck, mdiCog, mdiLogout } from "@mdi/js"

async function checkAdminAccess() {
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

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // Check if user has admin role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userError || userData?.role !== 'admin') {
    redirect('/dashboard')
  }

  return user
}

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await checkAdminAccess()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: mdiViewDashboard,
      current: false
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: mdiAccountGroup,
      current: false
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: mdiCreditCard,
      current: false
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit-logs',
      icon: mdiShieldCheck,
      current: false
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: mdiFileChart,
      current: false
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: mdiCog,
      current: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        <nav className="mt-8 space-y-1 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Icon path={item.icon} size={0.75} className="mr-3 text-gray-400 group-hover:text-gray-500" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link
            href="/dashboard"
            className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
          >
            <Icon path={mdiLogout} size={0.75} className="mr-3 text-gray-400 group-hover:text-gray-500" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
