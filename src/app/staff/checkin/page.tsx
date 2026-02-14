'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Icon from '@mdi/react'
import {
  mdiQrcodeScan,
  mdiMagnify,
  mdiCalendarClock,
  mdiAccountCheck,
  mdiFerry,
  mdiChevronRight,
  mdiClockOutline,
  mdiMapMarker,
} from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'

// Mock data - imports existing mock data
import { mockTrips, mockBookings } from '@/src/lib/mock-data'

/**
 * Staff Check-in Home Page
 * Hub for staff to initiate passenger check-in process
 * 
 * SDLC References:
 * - FR-021: QR Code Check-in System
 * - FR-022: Manual Check-in Fallback
 * - UC-003: Staff Check-in Process
 * 
 * Design System: Glassmorphism with action-oriented layout
 */

interface ScheduleSummary {
  scheduleId: string
  tripName: string
  route: string
  departureTime: string
  vessel: string
  totalBookings: number
  checkedIn: number
  status: 'upcoming' | 'boarding' | 'departed'
}

export default function StaffCheckinHome() {
  const router = useRouter()
  
  // Generate schedule summaries from mock data
  const schedules: ScheduleSummary[] = mockTrips.flatMap((trip) =>
    trip.schedules.map((schedule) => {
      const scheduleBookings = mockBookings.filter(
        (b) => b.tripId === trip.id && b.status !== 'cancelled'
      )
      const checkedInCount = scheduleBookings.filter((b) => b.status === 'checked-in').length

      // Determine status based on departure time (mock logic)
      const now = new Date()
      const departureTime = new Date(schedule.departureTime)
      const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60)

      let status: 'upcoming' | 'boarding' | 'departed' = 'upcoming'
      if (hoursUntilDeparture < 0) {
        status = 'departed'
      } else if (hoursUntilDeparture < 1) {
        status = 'boarding'
      }

      return {
        scheduleId: `${trip.id}-${schedule.departureTime}`,
        tripName: trip.name,
        route: `${trip.departure.location} → ${trip.arrival.location}`,
        departureTime: schedule.departureTime,
        vessel: trip.vessel.name,
        totalBookings: scheduleBookings.length,
        checkedIn: checkedInCount,
        status,
      }
    })
  )

  // Filter to show only upcoming and boarding schedules
  const activeSchedules = schedules.filter((s) => s.status !== 'departed').slice(0, 5)

  // Calculate stats
  const stats = {
    totalToday: activeSchedules.length,
    boarding: activeSchedules.filter((s) => s.status === 'boarding').length,
    checkedIn: activeSchedules.reduce((sum, s) => sum + s.checkedIn, 0),
    pending: activeSchedules.reduce((sum, s) => sum + (s.totalBookings - s.checkedIn), 0),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'boarding':
        return 'bg-warning-500/20 text-warning-400 border-warning-500/30'
      case 'upcoming':
        return 'bg-accent-500/20 text-accent-400 border-accent-500/30'
      default:
        return 'bg-fg-subtle/20 text-fg-muted border-fg-subtle/30'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-fg">Passenger Check-in</h1>
        <p className="text-fg-muted">Select a check-in method to get started</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Active Schedules', value: stats.totalToday, icon: mdiCalendarClock, color: 'text-accent-400' },
          { label: 'Now Boarding', value: stats.boarding, icon: mdiFerry, color: 'text-warning-400' },
          { label: 'Checked In', value: stats.checkedIn, icon: mdiAccountCheck, color: 'text-success-400' },
          { label: 'Pending', value: stats.pending, icon: mdiClockOutline, color: 'text-fg-muted' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="glass-subtle rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon path={stat.icon} size={0.8} className={stat.color} />
              <span className="text-sm text-fg-muted">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-fg">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Check-in Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* QR Scan */}
        <button
          onClick={() => router.push('/staff/checkin/scan')}
          className="glass-subtle rounded-lg p-8 hover:glass-hover transition-all duration-300 text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-lg bg-accent-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon path={mdiQrcodeScan} size={1.5} className="text-accent-400" />
            </div>
            <Icon path={mdiChevronRight} size={1} className="text-fg-muted group-hover:text-accent-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-fg mb-2">Scan QR Code</h3>
          <p className="text-fg-muted mb-4">
            Use the camera to scan passenger boarding passes for quick check-in
          </p>
          <Badge className="bg-success-500/20 text-success-400 border-success-500/30">
            Recommended
          </Badge>
        </button>

        {/* Manual Search */}
        <button
          onClick={() => router.push('/staff/checkin/manual')}
          className="glass-subtle rounded-lg p-8 hover:glass-hover transition-all duration-300 text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-lg bg-fg-subtle/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon path={mdiMagnify} size={1.5} className="text-fg-muted" />
            </div>
            <Icon path={mdiChevronRight} size={1} className="text-fg-muted group-hover:text-accent-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-fg mb-2">Manual Check-in</h3>
          <p className="text-fg-muted mb-4">
            Search by booking reference or passenger name for manual verification
          </p>
          <Badge variant="outline" className="text-fg-muted">
            Fallback Method
          </Badge>
        </button>
      </motion.div>

      {/* Active Schedules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-fg">Today's Schedules</h2>
          <Button variant="outline" size="sm" onClick={() => router.push('/operator/manifests')}>
            View All Manifests
          </Button>
        </div>

        <div className="space-y-3">
          {activeSchedules.length === 0 ? (
            <div className="glass-subtle rounded-lg p-8 text-center">
              <Icon path={mdiCalendarClock} size={2} className="mx-auto mb-3 text-fg-muted" />
              <p className="text-fg-muted">No active schedules at this time</p>
            </div>
          ) : (
            activeSchedules.map((schedule, index) => (
              <motion.div
                key={schedule.scheduleId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="glass-subtle rounded-lg p-4 hover:glass-hover transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Trip Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-fg">{schedule.tripName}</h3>
                      <Badge className={getStatusColor(schedule.status)}>
                        {schedule.status === 'boarding' ? '🚢 Boarding' : '⏰ Upcoming'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-fg-muted">
                      <span className="flex items-center gap-1">
                        <Icon path={mdiMapMarker} size={0.6} />
                        {schedule.route}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon path={mdiClockOutline} size={0.6} />
                        {new Date(schedule.departureTime).toLocaleString('en-GB', {
                          weekday: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Check-in Progress */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-fg-muted">Check-in Progress</p>
                      <p className="text-lg font-semibold text-fg">
                        {schedule.checkedIn} / {schedule.totalBookings}
                      </p>
                    </div>
                    <div className="w-24">
                      <div className="h-2 bg-bg-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success-400 transition-all duration-300"
                          style={{
                            width: `${(schedule.checkedIn / Math.max(schedule.totalBookings, 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
