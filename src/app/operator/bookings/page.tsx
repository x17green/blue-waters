'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Icon from '@mdi/react'
import {
  mdiCalendar,
  mdiMagnify,
  mdiFilterVariant,
  mdiDownload,
  mdiEye,
  mdiCheckCircle,
  mdiClockOutline,
  mdiCloseCircle,
  mdiAccountGroup,
  mdiCurrencyUsd,
  mdiFerry,
  mdiMapMarker,
} from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Badge } from '@/src/components/ui/badge'
import { mockBookings, type MockBooking } from '@/src/lib/mock-data'

/**
 * Operator Bookings Page
 * View and manage all bookings across all trips
 * Supports filtering, searching, and exporting
 * 
 * Design System: Glassmorphism with dark-first tokens
 * Navigation: Referenced in OperatorDashboardLayout navItems
 */
export default function OperatorBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | MockBooking['status']>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all')

  // Filter bookings
  const filteredBookings = mockBookings.filter((booking) => {
    // Status filter
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false

    // Date filter
    const bookingDate = new Date(booking.departureDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (dateFilter === 'today') {
      const bookingDay = new Date(bookingDate)
      bookingDay.setHours(0, 0, 0, 0)
      if (bookingDay.getTime() !== today.getTime()) return false
    } else if (dateFilter === 'upcoming') {
      if (bookingDate < today) return false
    } else if (dateFilter === 'past') {
      if (bookingDate >= today) return false
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        booking.bookingReference.toLowerCase().includes(query) ||
        booking.tripName.toLowerCase().includes(query) ||
        booking.passengers.some(
          (p) =>
            p.firstName.toLowerCase().includes(query) ||
            p.lastName.toLowerCase().includes(query) ||
            p.email.toLowerCase().includes(query)
        )
      )
    }

    return true
  })

  // Calculate stats
  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter((b) => b.status === 'confirmed').length,
    pending: filteredBookings.filter((b) => b.status === 'pending').length,
    cancelled: filteredBookings.filter((b) => b.status === 'cancelled').length,
    revenue: filteredBookings
      .filter((b) => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0),
  }

  const statusConfig = {
    confirmed: { color: 'text-success-400', bg: 'bg-success-500/10', icon: mdiCheckCircle },
    pending: { color: 'text-warning-400', bg: 'bg-warning-500/10', icon: mdiClockOutline },
    cancelled: { color: 'text-danger-400', bg: 'bg-danger-500/10', icon: mdiCloseCircle },
    completed: { color: 'text-info-400', bg: 'bg-info-500/10', icon: mdiCheckCircle },
    'checked-in': { color: 'text-accent-400', bg: 'bg-accent-500/10', icon: mdiCheckCircle },
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-fg">Bookings Management</h1>
        <p className="text-fg-muted">
          View and manage all passenger bookings across your trips
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-fg">{stats.total}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiCheckCircle} size={0.6} className="text-success-400" />
            Confirmed
          </p>
          <p className="text-2xl font-bold text-success-400">{stats.confirmed}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiClockOutline} size={0.6} className="text-warning-400" />
            Pending
          </p>
          <p className="text-2xl font-bold text-warning-400">{stats.pending}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiCloseCircle} size={0.6} className="text-danger-400" />
            Cancelled
          </p>
          <p className="text-2xl font-bold text-danger-400">{stats.cancelled}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiCurrencyUsd} size={0.6} className="text-accent-400" />
            Revenue
          </p>
          <p className="text-2xl font-bold text-accent-400">
            ₦{stats.revenue.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-subtle rounded-lg p-4 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Icon
            path={mdiMagnify}
            size={0.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
          />
          <Input
            type="search"
            placeholder="Search by booking reference, trip, or passenger name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <Icon path={mdiFilterVariant} size={0.6} />
            <span>Filters:</span>
          </div>

          {/* Status Filters */}
          <Button
            variant={statusFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All Status
          </Button>
          <Button
            variant={statusFilter === 'confirmed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('confirmed')}
          >
            <Icon path={mdiCheckCircle} size={0.5} className="mr-1" />
            Confirmed
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            <Icon path={mdiClockOutline} size={0.5} className="mr-1" />
            Pending
          </Button>
          <Button
            variant={statusFilter === 'cancelled' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('cancelled')}
          >
            <Icon path={mdiCloseCircle} size={0.5} className="mr-1" />
            Cancelled
          </Button>

          <div className="h-6 w-px bg-border-subtle" />

          {/* Date Filters */}
          <Button
            variant={dateFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDateFilter('all')}
          >
            All Dates
          </Button>
          <Button
            variant={dateFilter === 'today' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDateFilter('today')}
          >
            Today
          </Button>
          <Button
            variant={dateFilter === 'upcoming' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDateFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={dateFilter === 'past' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDateFilter('past')}
          >
            Past
          </Button>

          {/* Export Button */}
          <div className="ml-auto">
            <Button variant="outline" size="sm">
              <Icon path={mdiDownload} size={0.5} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bookings Table/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {filteredBookings.length === 0 ? (
          <div className="glass-subtle rounded-lg p-12 text-center">
            <Icon path={mdiCalendar} size={2} className="mx-auto mb-4 text-fg-muted opacity-50" />
            <h3 className="text-lg font-semibold text-fg mb-2">No bookings found</h3>
            <p className="text-fg-muted">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Bookings will appear here when passengers make reservations.'}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking, index) => {
            const config = statusConfig[booking.status]
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="glass-subtle rounded-lg p-4 hover:glass-hover transition-all duration-250"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-fg">
                        {booking.bookingReference}
                      </h3>
                      <Badge className={`${config.bg} ${config.color} border-0`}>
                        <Icon path={config.icon} size={0.5} className="mr-1" />
                        {booking.status}
                      </Badge>
                      {booking.paymentStatus === 'paid' && (
                        <Badge variant="outline" className="text-success-400 border-success-500/30">
                          Paid
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-fg-muted">
                        <Icon path={mdiFerry} size={0.6} />
                        <span>{booking.tripName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-fg-muted">
                        <Icon path={mdiMapMarker} size={0.6} />
                        <span>
                          {booking.departure} → {booking.arrival}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-fg-muted">
                        <Icon path={mdiCalendar} size={0.6} />
                        <span>
                          {new Date(booking.departureDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          at {booking.departureTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-fg-muted">
                        <Icon path={mdiAccountGroup} size={0.6} />
                        <span>
                          {booking.passengers.length}{' '}
                          {booking.passengers.length === 1 ? 'passenger' : 'passengers'}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-fg-muted">
                      Booked by: {booking.passengers[0].firstName} {booking.passengers[0].lastName} •{' '}
                      {booking.passengers[0].email}
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center gap-4 lg:border-l lg:border-border-subtle lg:pl-4">
                    <div className="text-right">
                      <p className="text-sm text-fg-muted">Total Amount</p>
                      <p className="text-xl font-bold text-accent-400">
                        ₦{booking.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/operator/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm">
                        <Icon path={mdiEye} size={0.6} className="mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>

      {/* Pagination (Placeholder) */}
      {filteredBookings.length > 0 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="default" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
