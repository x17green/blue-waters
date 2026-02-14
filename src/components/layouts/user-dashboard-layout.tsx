'use client'

import { motion } from 'framer-motion'
import { 
  mdiAnchor,
  mdiCalendar,
  mdiLogout,
  mdiMapMarker,
  mdiAccount
} from '@mdi/js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'

import { Button } from '@/src/components/ui/button'
import { Icon } from '@/src/components/ui/icon'
import { useAuth } from '@/src/contexts/auth-context'
import { BlueWatersWordmark } from '@/src/components/brand'

/**
 * User Dashboard Header
 * Dark glassmorphic navigation for authenticated customers
 */
function UserDashboardHeader() {
  const { appUser, signOut } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: mdiAnchor },
    { href: '/book', label: 'Book Trip', icon: mdiCalendar },
    { href: '/search', label: 'Search', icon: mdiMapMarker },
    { href: '/profile', label: 'Profile', icon: mdiAccount },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-[800] glass backdrop-blur-xl border-b border-border-subtle">
      <nav className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <BlueWatersWordmark 
            size="sm" 
            showText={false}
            priority
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <div>
            <h1 className="text-lg font-semibold text-fg tracking-tight">
              Yenagoa Boat Club
            </h1>
            <p className="text-xs text-fg-muted -mt-1">
              My Dashboard
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative px-4 py-2 rounded-lg text-sm font-medium
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
                  layoutId="userActiveTab"
                  className="absolute inset-0 glass-subtle rounded-lg"
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

        {/* User Menu */}
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-fg">
              {appUser?.fullName || 'Guest User'}
            </p>
            <p className="text-xs text-fg-subtle capitalize">
              {appUser?.role || 'customer'}
            </p>
          </div>

          {/* Logout Button */}
          <Button
            onClick={() => signOut()}
            variant="ghost"
            size="sm"
            className="glass-hover"
            aria-label="Logout"
          >
            <Icon path={mdiLogout} size={0.6} className="mr-2" aria-hidden={true} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </nav>
    </header>
  )
}

/**
 * User Dashboard Footer
 * Minimal glassmorphic footer with essential links
 */
function UserDashboardFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { href: '/about', label: 'About' },
    { href: '/help', label: 'Help Center' },
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ]

  return (
    <footer className="glass border-t border-border-subtle mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BlueWatersWordmark size="xs" showText={false} />
              <span className="font-semibold text-fg">
                Yenagoa Boat Club
              </span>
            </div>
            <p className="text-sm text-fg-muted max-w-xs">
              Safe, reliable boat booking across Bayelsa waterways. 
              Your journey, our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-fg mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-accent-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-fg mb-3">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-fg-muted">
              <li>Email: support@bluewaters.gov.ng</li>
              <li>Phone: +234 800 BLUE WATER</li>
              <li>Hours: 24/7 Customer Service</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border-subtle text-center text-sm text-fg-subtle">
          <p>
            © {currentYear} Yenagoa Boat Club - Ministry of Marine and Blue Economy, Bayelsa State. 
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

/**
 * User Dashboard Layout
 * Complete layout wrapper for customer dashboard pages
 * 
 * Features:
 * - Glassmorphic header with navigation
 * - Role-aware user menu
 * - Minimal footer with links
 * - Smooth animations
 */
export default function UserDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-950">
      <UserDashboardHeader />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      <UserDashboardFooter />
    </div>
  )
}
