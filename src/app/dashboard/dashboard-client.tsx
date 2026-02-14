'use client'

import { type User } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiBookmark, mdiCalendar, mdiMapMarker, mdiAccountGroup } from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { type AppUser } from '@/src/contexts/auth-context'

interface Booking {
  id: string
  trip_id: string
  booking_reference: string
  number_of_passengers: number
  total_amount: number
  booking_status: string
  created_at: string
}

interface DashboardClientProps {
  user: User
  appUser: AppUser | null
  bookings: Booking[]
}

/**
 * Dashboard Client Component
 * 
 * Client-side interactive dashboard for customers.
 * Receives server-fetched data as props (no race condition).
 * 
 * Features:
 * - Animated stats cards
 * - Booking history display
 * - Empty state with CTA
 */
export default function DashboardClient({ user, appUser, bookings }: DashboardClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-fg mb-2">
          Welcome back, {appUser?.fullName || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-lg text-fg-muted">
          Manage your bookings and explore new waterway adventures
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        {/* Total Bookings */}
        <motion.div variants={itemVariants}>
          <Card className="glass-strong border border-border-subtle hover:border-accent-900 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-fg-muted text-sm mb-2 font-medium">
                    Total Bookings
                  </p>
                  <p className="text-4xl font-bold text-accent-400">
                    {bookings.length}
                  </p>
                </div>
                <div className="glass-subtle rounded-lg p-3">
                  <Icon path={mdiBookmark} size={1.17} className="text-accent-500" aria-hidden={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Amount Spent */}
        <motion.div variants={itemVariants}>
            <Card className="glass-strong border border-border-subtle hover:border-success-300 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-fg-muted text-sm mb-2 font-medium">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold text-success-500">
                    ₦{bookings.reduce((sum, b) => sum + b.total_amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="glass-subtle rounded-lg p-3">
                  <Icon path={mdiMapMarker} size={1.17} className="text-success-600" aria-hidden={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completed Trips */}
        <motion.div variants={itemVariants}>
            <Card className="glass-strong border border-border-subtle hover:border-info-300 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-fg-muted text-sm mb-2 font-medium">
                    Completed
                  </p>
                  <p className="text-4xl font-bold text-info-500">
                    {bookings.filter((b) => b.booking_status === 'confirmed' || b.booking_status === 'completed').length}
                  </p>
                </div>
                <div className="glass-subtle rounded-lg p-3">
                  <Icon path={mdiAccountGroup} size={1.17} className="text-info-500" aria-hidden={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Bookings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass border border-border-default">
          <CardHeader className="border-b border-border-subtle">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Icon path={mdiCalendar} size={1} className="text-accent-400" aria-hidden={true} />
              <span className="text-fg">Your Bookings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {bookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="glass-subtle rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Icon path={mdiMapMarker} size={1.67} className="text-accent-500" aria-hidden={true} />
                </div>
                <h3 className="text-xl font-semibold text-fg mb-3">
                  No bookings yet
                </h3>
                <p className="text-fg-muted mb-8 max-w-md mx-auto">
                  Start your waterway adventure today. Book a trip and experience 
                  the beauty of Bayelsa's rivers and creeks.
                </p>
                <Button
                  size="lg"
                  className="glass-strong hover:glass-modal border border-accent-700 text-accent-300 hover:text-accent-200"
                  onClick={() => window.location.href = '/book'}
                >
                  <Icon path={mdiCalendar} size={0.8} className="mr-2" aria-hidden={true} />
                  Book Your First Trip
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="glass-subtle border border-border-subtle rounded-lg p-5 hover:border-accent-900 hover:glass-strong transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Booking Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-fg text-lg mb-3">
                          Booking #{booking.booking_reference}
                        </p>
                        <div className="flex flex-wrap gap-5 text-sm text-fg-muted">
                          <span className="flex items-center gap-2">
                            <Icon path={mdiAccountGroup} size={0.6} className="text-accent-500" aria-hidden={true} />
                            {booking.number_of_passengers} {booking.number_of_passengers === 1 ? 'passenger' : 'passengers'}
                          </span>
                          <span className="flex items-center gap-2">
                            <Icon path={mdiCalendar} size={0.6} className="text-accent-500" aria-hidden={true} />
                            {new Date(booking.created_at).toLocaleDateString('en-NG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Amount & Status */}
                      <div className="flex flex-col md:items-end gap-3">
                        <p className="text-2xl font-bold text-accent-300">
                          ₦{booking.total_amount.toLocaleString()}
                        </p>
                        <span
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${
                            booking.booking_status === 'confirmed' || booking.booking_status === 'completed'
                              ? 'bg-success-900 text-success-300 border border-success-700'
                              : booking.booking_status === 'paid'
                                ? 'bg-info-900 text-info-300 border border-info-700'
                                : booking.booking_status === 'cancelled'
                                  ? 'bg-error-900 text-error-300 border border-error-700'
                                  : 'bg-warning-900 text-warning-300 border border-warning-700'
                          }`}
                        >
                          {booking.booking_status.charAt(0).toUpperCase() +
                            booking.booking_status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
