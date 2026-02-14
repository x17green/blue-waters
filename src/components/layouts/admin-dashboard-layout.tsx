'use client'

import { motion } from 'framer-motion'
import {
  mdiChartBar,
  mdiBell,
  mdiShieldCheck,
  mdiCreditCard,
  mdiFileChart,
  mdiCog,
  mdiHome,
  mdiLogout,
  mdiMenu,
  mdiAccountGroup,
  mdiClose,
  mdiViewDashboard
} from '@mdi/js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Icon } from '@/src/components/ui/icon'
import { useAuth } from '@/src/contexts/auth-context'
import { Badge } from '@/src/components/ui/badge'
import { BlueWatersWordmark } from '@/src/components/brand'

/**
 * Admin Dashboard Header
 * Professional glassmorphic navigation for administrators
 */
function AdminDashboardHeader() {
  const { appUser, signOut } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: mdiViewDashboard },
    { href: '/admin/users', label: 'Users', icon: mdiAccountGroup },
    { href: '/admin/payments', label: 'Payments', icon: mdiCreditCard },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: mdiShieldCheck },
    { href: '/admin/reports', label: 'Reports', icon: mdiFileChart },
    { href: '/admin/settings', label: 'Settings', icon: mdiCog },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-[800] glass backdrop-blur-[var(--blur-strong)] border-b border-accent-900">
      <nav className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Branding */}
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-500 opacity-20 blur-xl rounded-full" />
            <div className="relative glass-strong rounded-lg p-1.5">
              <BlueWatersWordmark
                size="xs"
                showText={false}
                priority
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-fg tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-accent-400 -mt-0.5">
              {appUser?.fullName || 'Administrator'}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-250
                ${
                  isActive(item.href)
                    ? 'text-accent-300'
                    : 'text-fg-muted hover:text-fg'
                }
              `}
            >
              {/* Active indicator */}
              {isActive(item.href) && (
                <motion.div
                  layoutId="adminActiveTab"
                  className="absolute inset-0 glass-strong rounded-lg border border-accent-900"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon path={item.icon} size={0.6} aria-hidden={true} />
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative glass-hover rounded-lg p-2 hover:bg-glass-02 transition-colors" aria-label="Notifications">
            <Icon path={mdiBell} size={0.8} className="text-fg-muted" aria-hidden={true} />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              2
            </Badge>
          </button>

          {/* System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 glass-subtle rounded-lg">
            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs text-fg-muted font-medium">System Online</span>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3 ml-2 pl-3 border-l border-border-subtle">
            <div className="text-right">
              <p className="text-sm font-semibold text-fg">
                {appUser?.fullName || 'Administrator'}
              </p>
              <p className="text-xs text-accent-400 capitalize flex items-center justify-end gap-1">
                <Icon path={mdiShieldCheck} size={0.5} aria-hidden={true} />
                {appUser?.role || 'admin'}
              </p>
            </div>

            <Button
              onClick={() => signOut()}
              variant="ghost"
              size="sm"
              className="glass-hover"
              aria-label="Logout"
            >
              <Icon path={mdiLogout} size={0.6} aria-hidden={true} />
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden glass-hover rounded-lg p-2 hover:bg-glass-02 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <Icon path={mdiClose} size={0.8} className="text-fg" aria-hidden={true} />
            ) : (
              <Icon path={mdiMenu} size={0.8} className="text-fg" aria-hidden={true} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-border-subtle"
        >
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive(item.href)
                      ? 'glass-strong text-accent-300 border border-accent-900'
                      : 'text-fg-muted hover:text-fg hover:bg-glass-01'
                  }
                `}
              >
                <Icon path={item.icon} size={0.8} aria-hidden={true} />
                {item.label}
              </Link>
            ))}

            {/* Mobile User Actions */}
            <div className="pt-4 mt-4 border-t border-border-subtle">
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-semibold text-fg">
                  {appUser?.fullName || 'Administrator'}
                </p>
                <p className="text-xs text-accent-400 capitalize">
                  {appUser?.role || 'admin'}
                </p>
              </div>
              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="w-full justify-start glass-hover"
              >
                <Icon path={mdiLogout} size={0.8} className="mr-3" aria-hidden={true} />
                Logout
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}

/**
 * Admin Dashboard Footer
 * Compact administrative footer with system metrics
 */
function AdminDashboardFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass border-t border-border-subtle mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-3">
            <div className="glass-subtle rounded-lg p-2">
              <BlueWatersWordmark size="xs" showText={false} />
            </div>
            <div>
              <p className="text-sm font-semibold text-fg">
                Yenagoa Boat Club Admin Portal
              </p>
              <p className="text-xs text-fg-muted">
                © {currentYear} Ministry of Marine and Blue Economy
              </p>
            </div>
          </div>

          {/* Quick Links & System Status */}
          <div className="flex items-center gap-6 text-xs text-fg-muted">
            <Link href="/admin/support" className="hover:text-accent-400 transition-colors">
              Support
            </Link>
            <Link href="/admin/documentation" className="hover:text-accent-400 transition-colors">
              Documentation
            </Link>
            <Link href="/admin/security" className="hover:text-accent-400 transition-colors">
              Security
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * Admin Dashboard Layout
 * Professional layout for admin portal with comprehensive navigation
 *
 * Features:
 * - Professional glassmorphic header with admin navigation
 * - Notification center and system status
 * - Mobile-responsive menu
 * - Role-aware user information
 * - System health indicators
 * - Secure administrative footer
 */
export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-950">
      <AdminDashboardHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      <AdminDashboardFooter />
    </div>
  )
}