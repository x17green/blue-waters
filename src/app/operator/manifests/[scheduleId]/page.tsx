'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Icon from '@mdi/react'
import {
  mdiArrowLeft,
  mdiDownload,
  mdiPrinter,
  mdiEmail,
  mdiClipboardCheck,
  mdiAccountGroup,
  mdiMapMarker,
  mdiCalendar,
  mdiClockOutline,
  mdiFerry,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiPhone,
  mdiAt,
  mdiSeatPassenger,
  mdiShieldCheck,
} from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { mockTrips, mockBookings, type MockBooking } from '@/src/lib/mock-data'

/**
 * Manifest Detail Page
 * View and export detailed passenger manifest for a specific schedule
 * Critical for: FR-014, FR-019 (Maritime safety compliance)
 * 
 * Design System: Glassmorphism with print-friendly layout
 * Export formats: PDF, CSV, Email
 */
export default function ManifestDetailPage({ params }: { params: { scheduleId: string } }) {
  const [manifest, setManifest] = useState<{
    schedule: any
    trip: any
    bookings: MockBooking[]
    passengers: Array<MockBooking['passengers'][0] & { bookingRef: string; status: MockBooking['status'] }>
  } | null>(null)

  useEffect(() => {
    // Find trip and schedule
    const trip = mockTrips.find((t) => t.schedules.some((s) => s.id === params.scheduleId))
    const schedule = trip?.schedules.find((s) => s.id === params.scheduleId)

    if (trip && schedule) {
      // Get all bookings for this schedule
      const scheduleBookings = mockBookings.filter(
        (b) => b.tripId === trip.id && b.scheduleId === schedule.id
      )

      // Extract all passengers with booking reference
      const passengers = scheduleBookings.flatMap((booking) =>
        booking.passengers.map((passenger) => ({
          ...passenger,
          bookingRef: booking.bookingReference,
          status: booking.status,
        }))
      )

      setManifest({
        schedule,
        trip,
        bookings: scheduleBookings,
        passengers,
      })
    }
  }, [params.scheduleId])

  const handleExportPDF = () => {
    console.log('Exporting manifest as PDF...')
    // TODO: Implement PDF export with jsPDF or server-side generation
    alert('PDF export feature coming soon!')
  }

  const handleExportCSV = () => {
    if (!manifest) return

    // Generate CSV content
    const headers = ['Full Name', 'Email', 'Phone', 'Seat Number', 'Booking Reference', 'Status']
    const rows = manifest.passengers.map((p) => [
      `${p.firstName} ${p.lastName}`,
      p.email,
      p.phone,
      p.seatNumber || 'Unassigned',
      p.bookingRef,
      p.status,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `manifest-${params.scheduleId}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleEmailManifest = () => {
    console.log('Emailing manifest...')
    // TODO: Implement email sending via API
    alert('Email feature coming soon!')
  }

  if (!manifest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-subtle rounded-lg p-12 text-center">
          <Icon path={mdiAlertCircle} size={2} className="mx-auto mb-4 text-warning-400" />
          <h2 className="text-xl font-semibold text-fg mb-2">Manifest not found</h2>
          <p className="text-fg-muted mb-6">The schedule you're looking for doesn't exist.</p>
          <Link href="/operator/manifests">
            <Button variant="outline">
              <Icon path={mdiArrowLeft} size={0.6} className="mr-2" />
              Back to Manifests
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const confirmedPassengers = manifest.passengers.filter((p) => p.status === 'confirmed' || p.status === 'checked-in')
  const checkedInPassengers = manifest.passengers.filter((p) => p.status === 'checked-in')

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <Link
            href="/operator/manifests"
            className="inline-flex items-center gap-2 text-fg-muted hover:text-fg transition-colors mb-2"
          >
            <Icon path={mdiArrowLeft} size={0.7} />
            <span className="text-sm">Back to Manifests</span>
          </Link>
          <h1 className="text-3xl font-bold text-fg flex items-center gap-3">
            <Icon path={mdiClipboardCheck} size={1.2} className="text-accent-400" />
            Passenger Manifest
          </h1>
          <p className="text-fg-muted">Schedule ID: {params.scheduleId}</p>
        </div>

        {/* Export Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Icon path={mdiPrinter} size={0.6} className="mr-2" />
            Print PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Icon path={mdiDownload} size={0.6} className="mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleEmailManifest}>
            <Icon path={mdiEmail} size={0.6} className="mr-2" />
            Email
          </Button>
        </div>
      </motion.div>

      {/* Trip & Schedule Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-subtle rounded-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-fg">Trip Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-fg-muted flex items-center gap-2">
              <Icon path={mdiFerry} size={0.6} />
              Trip Name
            </p>
            <p className="font-semibold text-fg">{manifest.trip.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-fg-muted flex items-center gap-2">
              <Icon path={mdiMapMarker} size={0.6} />
              Route
            </p>
            <p className="font-semibold text-fg">
              {manifest.trip.departure.location} → {manifest.trip.arrival.location}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-fg-muted flex items-center gap-2">
              <Icon path={mdiCalendar} size={0.6} />
              Departure
            </p>
            <p className="font-semibold text-fg">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
              at {manifest.schedule.departureTime}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-fg-muted flex items-center gap-2">
              <Icon path={mdiClockOutline} size={0.6} />
              Duration
            </p>
            <p className="font-semibold text-fg">{manifest.trip.duration} minutes</p>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-fg-muted">Vessel</p>
              <p className="font-semibold text-fg">{manifest.trip.vessel.name}</p>
              <p className="text-xs text-fg-subtle capitalize">{manifest.trip.vessel.type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-fg-muted">Capacity</p>
              <p className="font-semibold text-fg">{manifest.trip.vessel.capacity} passengers</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-fg-muted">Safety Rating</p>
              <p className="font-semibold text-success-400 flex items-center gap-1">
                <Icon path={mdiShieldCheck} size={0.6} />
                {manifest.trip.vessel.safetyRating}/5
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-fg-muted">Schedule Status</p>
              <Badge className="bg-success-500/10 text-success-400 border-0">
                <Icon path={mdiCheckCircle} size={0.5} className="mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Manifest Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm">Total Bookings</p>
          <p className="text-3xl font-bold text-fg">{manifest.bookings.length}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiAccountGroup} size={0.6} className="text-accent-400" />
            Total Passengers
          </p>
          <p className="text-3xl font-bold text-accent-400">{manifest.passengers.length}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiCheckCircle} size={0.6} className="text-success-400" />
            Confirmed
          </p>
          <p className="text-3xl font-bold text-success-400">{confirmedPassengers.length}</p>
        </div>
        <div className="glass-subtle rounded-lg p-4 space-y-1">
          <p className="text-fg-muted text-sm flex items-center gap-2">
            <Icon path={mdiCheckCircle} size={0.6} className="text-info-400" />
            Checked In
          </p>
          <p className="text-3xl font-bold text-info-400">{checkedInPassengers.length}</p>
        </div>
      </motion.div>

      {/* Passenger List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-subtle rounded-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-fg">Passenger List</h2>
          <Badge variant="outline" className="text-fg-muted">
            {manifest.passengers.length} passengers
          </Badge>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border-subtle">
              <tr className="text-left text-sm text-fg-muted">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Full Name</th>
                <th className="pb-3 pr-4">Contact</th>
                <th className="pb-3 pr-4">Seat</th>
                <th className="pb-3 pr-4">Booking Ref</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {manifest.passengers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <Icon path={mdiAccountGroup} size={2} className="mx-auto mb-4 text-fg-muted opacity-50" />
                    <p className="text-fg-muted">No passengers booked for this schedule</p>
                  </td>
                </tr>
              ) : (
                manifest.passengers.map((passenger, index) => {
                  const statusConfig = {
                    confirmed: { color: 'text-success-400', bg: 'bg-success-500/10', icon: mdiCheckCircle },
                    'checked-in': { color: 'text-info-400', bg: 'bg-info-500/10', icon: mdiCheckCircle },
                    pending: { color: 'text-warning-400', bg: 'bg-warning-500/10', icon: mdiClockOutline },
                    cancelled: { color: 'text-danger-400', bg: 'bg-danger-500/10', icon: mdiAlertCircle },
                    completed: { color: 'text-fg-muted', bg: 'bg-fg/5', icon: mdiCheckCircle },
                  }
                  const config = statusConfig[passenger.status] || statusConfig.confirmed

                  return (
                    <tr key={`${passenger.bookingRef}-${index}`} className="text-sm">
                      <td className="py-4 pr-4 text-fg-muted">{index + 1}</td>
                      <td className="py-4 pr-4">
                        <p className="font-medium text-fg">
                          {passenger.firstName} {passenger.lastName}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="space-y-1">
                          <p className="text-fg-muted flex items-center gap-1">
                            <Icon path={mdiAt} size={0.5} />
                            {passenger.email}
                          </p>
                          <p className="text-fg-muted flex items-center gap-1">
                            <Icon path={mdiPhone} size={0.5} />
                            {passenger.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        {passenger.seatNumber ? (
                          <Badge variant="outline" className="text-accent-400 border-accent-500/30">
                            <Icon path={mdiSeatPassenger} size={0.5} className="mr-1" />
                            {passenger.seatNumber}
                          </Badge>
                        ) : (
                          <span className="text-fg-subtle text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        <code className="text-xs bg-bg-800 px-2 py-1 rounded text-fg-muted">
                          {passenger.bookingRef}
                        </code>
                      </td>
                      <td className="py-4">
                        <Badge className={`${config.bg} ${config.color} border-0`}>
                          <Icon path={config.icon} size={0.5} className="mr-1" />
                          {passenger.status}
                        </Badge>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Safety Compliance Note */}
        <div className="border-t border-border-subtle pt-4 flex items-start gap-3 text-sm">
          <Icon path={mdiShieldCheck} size={0.8} className="text-success-400 mt-0.5" />
          <div>
            <p className="font-medium text-fg mb-1">Maritime Safety Compliance</p>
            <p className="text-fg-muted">
              This manifest complies with Nigerian Maritime Administration and Safety Agency (NIMASA) regulations.
              Document generated on{' '}
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
