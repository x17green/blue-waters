'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Icon from '@mdi/react'
import {
  mdiMagnify,
  mdiArrowLeft,
  mdiAccountCircle,
  mdiTicket,
  mdiShipWheel,
  mdiMapMarker,
  mdiClockOutline,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiClose,
  mdiFilterVariant,
  mdiQrcodeScan,
} from '@mdi/js'

import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'

// Mock data
import { mockBookings, mockTrips } from '@/src/lib/mock-data'

/**
 * Staff Manual Check-in Page
 * Fallback method for checking in passengers without QR codes
 * 
 * SDLC References:
 * - FR-022: Manual Check-in Fallback
 * - FR-023: Check-in Verification
 * - UC-003: Staff Check-in Process
 * 
 * Design System: Search-focused interface with glassmorphism
 */

interface BookingSearchResult {
  bookingReference: string
  passengerName: string
  email: string
  phone: string
  tripId: string
  tripName: string
  route: string
  departureTime: string
  vessel: string
  seatNumber: string | null
  status: 'confirmed' | 'checked-in' | 'pending' | 'cancelled' | 'completed'
  totalPassengers: number
}

export default function StaffManualCheckinPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BookingSearchResult[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingSearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Search bookings by reference or passenger name
    const query = searchQuery.toLowerCase().trim()
    const results: BookingSearchResult[] = []

    mockBookings.forEach((booking) => {
      const trip = mockTrips.find((t) => t.id === booking.tripId)
      if (!trip) return

      const schedule = trip.schedules[0] // Simplified

      // Check if booking reference matches
      const refMatches = booking.bookingReference.toLowerCase().includes(query)

      // Check if any passenger name matches
      const nameMatches = booking.passengers.some(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(query)
      )

      if (refMatches || nameMatches) {
        booking.passengers.forEach((passenger) => {
          results.push({
            bookingReference: booking.bookingReference,
            passengerName: `${passenger.firstName} ${passenger.lastName}`,
            email: passenger.email,
            phone: passenger.phone,
            tripId: trip.id,
            tripName: trip.name,
            route: `${trip.departure.location} → ${trip.arrival.location}`,
            departureTime: schedule.departureTime,
            vessel: trip.vessel.name,
            seatNumber: passenger.seatNumber || null,
            status: booking.status as BookingSearchResult['status'],
            totalPassengers: booking.passengers.length,
          })
        })
      }
    })

    setSearchResults(results)
    setIsSearching(false)
  }

  const handleCheckIn = async (booking: BookingSearchResult) => {
    if (booking.status === 'checked-in') {
      setSelectedBooking(booking)
      return
    }

    // TODO: Implement actual check-in API call
    console.log('Checking in passenger:', booking.bookingReference, booking.passengerName)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update booking status (in production, this would be done via API)
    const bookingIndex = mockBookings.findIndex((b) => b.bookingReference === booking.bookingReference)
    if (bookingIndex !== -1) {
      mockBookings[bookingIndex].status = 'checked-in'
    }

    // Show success message
    setCheckInSuccess(booking.passengerName)

    // Update search results
    setSearchResults((prev) =>
      prev.map((r) =>
        r.bookingReference === booking.bookingReference && r.passengerName === booking.passengerName
          ? { ...r, status: 'checked-in' }
          : r
      )
    )

    // Clear success message after 3 seconds
    setTimeout(() => {
      setCheckInSuccess(null)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-accent-500/20 text-accent-400 border-accent-500/30'
      case 'checked-in':
        return 'bg-success-500/20 text-success-400 border-success-500/30'
      case 'pending':
        return 'bg-warning-500/20 text-warning-400 border-warning-500/30'
      case 'cancelled':
        return 'bg-danger-500/20 text-danger-400 border-danger-500/30'
      default:
        return 'bg-fg-subtle/20 text-fg-muted border-fg-subtle/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return mdiTicket
      case 'checked-in':
        return mdiCheckCircle
      case 'pending':
        return mdiAlertCircle
      case 'cancelled':
        return mdiClose
      default:
        return mdiAlertCircle
    }
  }

  const canCheckIn = (status: string) => {
    return status === 'confirmed'
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <Icon path={mdiArrowLeft} size={0.8} className="mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-fg">Manual Check-in</h1>
          <p className="text-fg-muted">Search by booking reference or passenger name</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/staff/checkin/scan')}>
          <Icon path={mdiQrcodeScan} size={0.7} className="mr-2" />
          Use QR Scanner
        </Button>
      </motion.div>

      {/* Success Banner */}
      <AnimatePresence>
        {checkInSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-subtle rounded-lg p-4 border-2 border-success-500/30"
          >
            <div className="flex items-center gap-3">
              <Icon path={mdiCheckCircle} size={1} className="text-success-400" />
              <div className="flex-1">
                <p className="font-semibold text-success-400">Check-in Successful!</p>
                <p className="text-sm text-fg-muted">{checkInSuccess} has been checked in.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-subtle rounded-lg p-6"
      >
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter booking reference or passenger name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-lg"
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} size="lg">
            {isSearching ? (
              <>
                <Icon path={mdiMagnify} size={0.8} className="mr-2 animate-pulse" />
                Searching...
              </>
            ) : (
              <>
                <Icon path={mdiMagnify} size={0.8} className="mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-fg-muted">Try:</span>
          {['BWC-001', 'BWC-002', 'John Doe', 'Sarah'].map((example) => (
            <button
              key={example}
              onClick={() => {
                setSearchQuery(example)
                setTimeout(handleSearch, 100)
              }}
              className="px-3 py-1 text-sm rounded-md glass-subtle hover:glass-hover transition-all"
            >
              {example}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {searchResults.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-fg">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchResults([])
                  setSearchQuery('')
                }}
              >
                Clear Results
              </Button>
            </div>

            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <motion.div
                  key={`${result.bookingReference}-${result.passengerName}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-subtle rounded-lg p-5 hover:glass-hover transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Passenger Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon path={mdiAccountCircle} size={0.9} className="text-accent-400" />
                            <h3 className="text-lg font-semibold text-fg">{result.passengerName}</h3>
                            <Badge className={getStatusColor(result.status)}>
                              <Icon path={getStatusIcon(result.status)} size={0.5} className="mr-1" />
                              {result.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-fg-muted ml-7">{result.email}</p>
                          <p className="text-sm text-fg-muted ml-7">{result.phone}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon path={mdiTicket} size={0.7} className="text-fg-muted" />
                          <div>
                            <p className="text-xs text-fg-subtle">Booking Ref</p>
                            <p className="font-mono text-fg">{result.bookingReference}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Icon path={mdiShipWheel} size={0.7} className="text-fg-muted" />
                          <div>
                            <p className="text-xs text-fg-subtle">Trip</p>
                            <p className="text-fg">{result.tripName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Icon path={mdiMapMarker} size={0.7} className="text-fg-muted" />
                          <div>
                            <p className="text-xs text-fg-subtle">Route</p>
                            <p className="text-fg">{result.route}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Icon path={mdiClockOutline} size={0.7} className="text-fg-muted" />
                          <div>
                            <p className="text-xs text-fg-subtle">Departure</p>
                            <p className="text-fg">
                              {new Date(result.departureTime).toLocaleString('en-GB', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {result.seatNumber && (
                        <div className="glass-strong rounded-md p-2 inline-block">
                          <span className="text-xs text-fg-muted mr-2">Seat:</span>
                          <span className="text-sm font-bold text-accent-400">{result.seatNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 md:justify-center">
                      {canCheckIn(result.status) ? (
                        <Button onClick={() => handleCheckIn(result)} className="flex-1 md:flex-none">
                          <Icon path={mdiCheckCircle} size={0.7} className="mr-2" />
                          Check In
                        </Button>
                      ) : result.status === 'checked-in' ? (
                        <Button variant="outline" disabled className="flex-1 md:flex-none">
                          <Icon path={mdiCheckCircle} size={0.7} className="mr-2" />
                          Checked In
                        </Button>
                      ) : result.status === 'cancelled' ? (
                        <Button variant="outline" disabled className="flex-1 md:flex-none text-danger-400">
                          <Icon path={mdiClose} size={0.7} className="mr-2" />
                          Cancelled
                        </Button>
                      ) : (
                        <Button variant="outline" disabled className="flex-1 md:flex-none">
                          <Icon path={mdiAlertCircle} size={0.7} className="mr-2" />
                          Pending
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBooking(result)}
                        className="flex-1 md:flex-none"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : searchQuery && !isSearching ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-subtle rounded-lg p-12 text-center"
          >
            <Icon path={mdiFilterVariant} size={3} className="mx-auto mb-4 text-fg-muted" />
            <h3 className="text-xl font-semibold text-fg mb-2">No Results Found</h3>
            <p className="text-fg-muted">
              No bookings found matching "{searchQuery}". Try a different search term.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-subtle rounded-lg p-12 text-center"
          >
            <Icon path={mdiMagnify} size={3} className="mx-auto mb-4 text-fg-muted" />
            <h3 className="text-xl font-semibold text-fg mb-2">Search for Passengers</h3>
            <p className="text-fg-muted">
              Enter a booking reference or passenger name to find bookings
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-950/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-modal rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-fg">Booking Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                  <Icon path={mdiClose} size={0.8} />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="glass-subtle rounded-lg p-4">
                  <p className="text-xs text-fg-muted mb-1">Passenger</p>
                  <p className="text-lg font-semibold text-fg">{selectedBooking.passengerName}</p>
                  <p className="text-sm text-fg-muted">{selectedBooking.email}</p>
                  <p className="text-sm text-fg-muted">{selectedBooking.phone}</p>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <p className="text-xs text-fg-muted mb-1">Booking Reference</p>
                  <p className="text-lg font-mono text-fg">{selectedBooking.bookingReference}</p>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <p className="text-xs text-fg-muted mb-1">Trip Details</p>
                  <p className="text-fg font-semibold">{selectedBooking.tripName}</p>
                  <p className="text-sm text-fg-muted">{selectedBooking.route}</p>
                  <p className="text-sm text-fg-muted">{selectedBooking.vessel}</p>
                  <p className="text-sm text-fg-muted mt-2">
                    {new Date(selectedBooking.departureTime).toLocaleString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center justify-between glass-subtle rounded-lg p-4">
                  <span className="text-fg-muted">Status</span>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    <Icon path={getStatusIcon(selectedBooking.status)} size={0.5} className="mr-1" />
                    {selectedBooking.status}
                  </Badge>
                </div>

                {selectedBooking.seatNumber && (
                  <div className="glass-subtle rounded-lg p-4 text-center">
                    <p className="text-xs text-fg-muted mb-1">Assigned Seat</p>
                    <p className="text-3xl font-bold text-accent-400">{selectedBooking.seatNumber}</p>
                  </div>
                )}

                {canCheckIn(selectedBooking.status) && (
                  <Button
                    onClick={() => {
                      handleCheckIn(selectedBooking)
                      setSelectedBooking(null)
                    }}
                    className="w-full"
                  >
                    <Icon path={mdiCheckCircle} size={0.7} className="mr-2" />
                    Check In Passenger
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
