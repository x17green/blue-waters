'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Icon from '@mdi/react'
import {
  mdiClipboardCheck,
  mdiDownload,
  mdiEye,
  mdiCalendar,
  mdiMagnify,
  mdiFerry,
  mdiMapMarker,
  mdiAccountGroup,
  mdiClockOutline,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiFilter,
} from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Badge } from '@/src/components/ui/badge'
import { mockTrips, mockBookings } from '@/src/lib/mock-data'

/**
 * Operator Manifests Page
 * View and export passenger manifests for all trips
 * Critical for: FR-014, FR-019 (Maritime compliance)
 * 
 * Design System: Glassmorphism with safety-focused UI
 * Navigation: Referenced in OperatorDashboardLayout
 */

interface ManifestSummary {
  scheduleId: string
  tripName: string
  tripId: string
  departure: string
  arrival: string
  departureDate: string
  departureTime: string
  totalBookings: number
  confirmedPassengers: number
  checkedInPassengers: number
  vesselCapacity: number
  status: 'upcoming' | 'boarding' | 'departed' | 'completed'
}

export default function OperatorManifestsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ManifestSummary['status']>('all')

  // Generate manifest summaries from bookings and trips
  const manifests: ManifestSummary[] = mockTrips.flatMap((trip) =>
    trip.schedules.map((schedule) => {
      const scheduleBookings = mockBookings.filter(
        (b) => b.tripId === trip.id && b.scheduleId === schedule.id
      )
      const confirmedBookings = scheduleBookings.filter((b) => b.status === 'confirmed' || b.status === 'checked-in')
      const checkedInBookings = scheduleBookings.filter((b) => b.status === 'checked-in')
      
      // Calculate total passengers
      const totalPassengers = confirmedBookings.reduce((sum, b) => sum + b.passengers.length, 0)
      const checkedInPassengers = checkedInBookings.reduce((sum, b) => sum + b.passengers.length, 0)

      // Determine status based on time (mock logic)
      const now = new Date()
      const depDate = new Date(`2026-02-${15 + Math.floor(Math.random() * 10)}T${schedule.departureTime}`)
      let status: ManifestSummary['status'] = 'upcoming'
      if (depDate < now) {
        status = 'completed'
      } else if (depDate.getTime() - now.getTime() < 2 * 60 * 60 * 1000) {
        status = 'boarding'
      }

      return {
        scheduleId: schedule.id,
        tripName: trip.name,
        tripId: trip.id,
        departure: trip.departure.location,
        arrival: trip.arrival.location,
        departureDate: depDate.toISOString().split('T')[0],
        departureTime: schedule.departureTime,
        totalBookings: scheduleBookings.length,
        confirmedPassengers: totalPassengers,
        checkedInPassengers,
        vesselCapacity: trip.vessel.capacity,
        status,
      }
    })
  )

  // Filter manifests
  const filteredManifests = manifests
    .filter((manifest) => {
      // Status filter
      if (statusFilter !== 'all' && manifest.status !== statusFilter) return false

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          manifest.tripName.toLowerCase().includes(query) ||
          manifest.departure.toLowerCase().includes(query) ||
          manifest.arrival.toLowerCase().includes(query) ||
          manifest.scheduleId.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by date (upcoming first)
      return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
    })

  const statusConfig = {
    upcoming: { color: 'text-info-400', bg: 'bg-info-500/10', icon: mdiClockOutline, label: 'Upcoming' },
    boarding: { color: 'text-warning-400', bg: 'bg-warning-500/10', icon: mdiAlertCircle, label: 'Boarding' },
    departed: { color: 'text-accent-400', bg: 'bg-accent-500/10', icon: mdiCheckCircle, label: 'Departed' },
    completed: { color: 'text-success-400', bg: 'bg-success-500/10', icon: mdiCheckCircle, label: 'Completed' },
  }

  // Calculate stats
  const stats = {
    total: manifests.length,
    upcoming: manifests.filter((m) => m.status === 'upcoming').length,
    boarding: manifests.filter((m) => m.status === 'boarding').length,
    completed: manifests.filter((m) => m.status === 'completed').length,
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-fg flex items-center gap-3">
          <Icon path={mdiClipboardCheck} size={1.2} className="text-accent-400" />
          Passenger Manifests
        </h1>
        <p className="text-fg-muted">
          View, export, and manage passenger manifests for safety compliance
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm">Total Manifests</p>
          <p className="text-2xl font-bold text-fg">{stats.total}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiClockOutline} size={0.6} className="text-info-400" />
            Upcoming
          </p>
          <p className="text-2xl font-bold text-info-400">{stats.upcoming}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiAlertCircle} size={0.6} className="text-warning-400" />
            Boarding
          </p>
          <p className="text-2xl font-bold text-warning-400">{stats.boarding}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiCheckCircle} size={0.6} className="text-success-400" />
            Completed
          </p>
          <p className="text-2xl font-bold text-success-400">{stats.completed}</p>
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
            placeholder="Search by trip name, route, or schedule ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <Icon path={mdiFilter} size={0.6} />
            <span>Status:</span>
          </div>

          <Button
            variant={statusFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'upcoming' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('upcoming')}
          >
            <Icon path={mdiClockOutline} size={0.5} className="mr-1" />
            Upcoming
          </Button>
          <Button
            variant={statusFilter === 'boarding' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('boarding')}
          >
            <Icon path={mdiAlertCircle} size={0.5} className="mr-1" />
            Boarding
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
          >
            <Icon path={mdiCheckCircle} size={0.5} className="mr-1" />
            Completed
          </Button>
        </div>
      </motion.div>

      {/* Manifests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {filteredManifests.length === 0 ? (
          <div className="glass-subtle rounded-lg p-12 text-center">
            <Icon path={mdiClipboardCheck} size={2} className="mx-auto mb-4 text-fg-muted opacity-50" />
            <h3 className="text-lg font-semibold text-fg mb-2">No manifests found</h3>
            <p className="text-fg-muted">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Manifests will appear here for scheduled trips with bookings.'}
            </p>
          </div>
        ) : (
          filteredManifests.map((manifest, index) => {
            const config = statusConfig[manifest.status]
            const capacityPercentage = (manifest.confirmedPassengers / manifest.vesselCapacity) * 100
            const checkinPercentage = manifest.confirmedPassengers > 0
              ? (manifest.checkedInPassengers / manifest.confirmedPassengers) * 100
              : 0

            return (
              <motion.div
                key={manifest.scheduleId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="glass-subtle rounded-lg p-4 hover:glass-hover transition-all duration-250"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Trip Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-fg">{manifest.tripName}</h3>
                      <Badge className={`${config.bg} ${config.color} border-0`}>
                        <Icon path={config.icon} size={0.5} className="mr-1" />
                        {config.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-fg-muted">
                        <Icon path={mdiMapMarker} size={0.6} />
                        <span>
                          {manifest.departure} → {manifest.arrival}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-fg-muted">
                        <Icon path={mdiCalendar} size={0.6} />
                        <span>
                          {new Date(manifest.departureDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          at {manifest.departureTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-fg-muted">
                        <Icon path={mdiAccountGroup} size={0.6} />
                        <span>
                          {manifest.confirmedPassengers} / {manifest.vesselCapacity} passengers
                        </span>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-fg-muted">
                        <span>Capacity: {capacityPercentage.toFixed(0)}%</span>
                        <span>Check-in: {checkinPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-bg-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-500 rounded-full transition-all duration-500"
                          style={{ width: `${capacityPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center gap-4 lg:border-l lg:border-border-subtle lg:pl-4">
                    <div className="text-center space-y-1">
                      <p className="text-2xl font-bold text-accent-400">{manifest.totalBookings}</p>
                      <p className="text-xs text-fg-muted">Bookings</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/operator/manifests/${manifest.scheduleId}`}>
                        <Button variant="default" size="sm">
                          <Icon path={mdiEye} size={0.6} className="mr-2" />
                          View Manifest
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Icon path={mdiDownload} size={0.6} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>
    </div>
  )
}
