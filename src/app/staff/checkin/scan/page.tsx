'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Icon from '@mdi/react'
import {
  mdiQrcodeScan,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiArrowLeft,
  mdiAccountCircle,
  mdiTicket,
  mdiShipWheel,
  mdiMapMarker,
  mdiClockOutline,
  mdiFlash,
  mdiFlashOff,
  mdiCameraSwitch,
  mdiClose,
} from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'

// Mock data
import { mockBookings, mockTrips } from '@/src/lib/mock-data'

/**
 * Staff QR Scanner Page
 * Real-time QR code scanning for passenger check-in
 * 
 * SDLC References:
 * - FR-021: QR Code Check-in System (Core)
 * - FR-023: Check-in Verification
 * - UC-003: Staff Check-in Process
 * 
 * Design System: Full-screen scanner with glassmorphic overlay UI
 * 
 * TODO: Integrate actual QR scanner library
 * - Option 1: react-qr-scanner
 * - Option 2: @zxing/library (ZXing for browser)
 * - Option 3: html5-qrcode
 */

interface ScanResult {
  bookingReference: string
  passengerName: string
  tripName: string
  route: string
  departureTime: string
  vessel: string
  seatNumber: string | null
  status: 'success' | 'error' | 'already-checked-in' | 'cancelled'
  message: string
}

export default function StaffQRScannerPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(true)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [recentScans, setRecentScans] = useState<string[]>([])

  // Simulate QR scan (TODO: Replace with actual scanner)
  const simulateScan = () => {
    // Pick a random booking from mock data
    const randomBooking = mockBookings[Math.floor(Math.random() * mockBookings.length)]
    const trip = mockTrips.find((t) => t.id === randomBooking.tripId)

    if (!trip) return

    const schedule = trip.schedules[0] // Simplified - take first schedule

    // Determine result based on booking status
    let status: ScanResult['status'] = 'success'
    let message = 'Check-in successful! Passenger verified.'

    if (randomBooking.status === 'cancelled') {
      status = 'cancelled'
      message = 'This booking has been cancelled. Please check with customer support.'
    } else if (randomBooking.status === 'checked-in') {
      status = 'already-checked-in'
      message = 'This passenger has already been checked in.'
    } else if (randomBooking.status === 'pending') {
      status = 'error'
      message = 'Payment pending. Cannot check in at this time.'
    }

    const result: ScanResult = {
      bookingReference: randomBooking.bookingReference,
      passengerName: `${randomBooking.passengers[0].firstName} ${randomBooking.passengers[0].lastName}`,
      tripName: trip.name,
      route: `${trip.departure.location} → ${trip.arrival.location}`,
      departureTime: schedule.departureTime,
      vessel: trip.vessel.name,
      seatNumber: randomBooking.passengers[0].seatNumber || null,
      status,
      message,
    }

    setScanResult(result)
    setIsScanning(false)

    // Add to recent scans (only successful ones)
    if (status === 'success') {
      setRecentScans((prev) => [randomBooking.bookingReference, ...prev.slice(0, 4)])
    }
  }

  // Auto-scan simulation for demo purposes
  useEffect(() => {
    if (isScanning && !scanResult) {
      const timer = setTimeout(() => {
        // Simulate scan every 3 seconds (remove in production)
        // simulateScan()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isScanning, scanResult])

  const handleContinueScanning = () => {
    setScanResult(null)
    setIsScanning(true)
  }

  const handleCheckIn = async () => {
    if (!scanResult) return

    // TODO: Implement actual check-in API call
    console.log('Checking in passenger:', scanResult.bookingReference)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update booking status (in production, this would be done via API)
    const bookingIndex = mockBookings.findIndex((b) => b.bookingReference === scanResult.bookingReference)
    if (bookingIndex !== -1) {
      mockBookings[bookingIndex].status = 'checked-in'
    }

    // Continue to next scan
    handleContinueScanning()
  }

  const getResultColor = (status: ScanResult['status']) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'already-checked-in':
        return 'warning'
      case 'error':
      case 'cancelled':
        return 'danger'
      default:
        return 'muted'
    }
  }

  const getResultIcon = (status: ScanResult['status']) => {
    switch (status) {
      case 'success':
        return mdiCheckCircle
      case 'already-checked-in':
        return mdiAlertCircle
      case 'error':
      case 'cancelled':
        return mdiClose
      default:
        return mdiAlertCircle
    }
  }

  return (
    <div className="min-h-screen bg-bg-900 relative overflow-hidden">
      {/* Scanner View */}
      <div className="relative h-screen flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <Icon path={mdiArrowLeft} size={0.8} className="mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFlashEnabled(!flashEnabled)}
                className={flashEnabled ? 'bg-accent-500/20' : ''}
              >
                <Icon path={flashEnabled ? mdiFlash : mdiFlashOff} size={0.8} />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon path={mdiCameraSwitch} size={0.8} />
              </Button>
            </div>
          </div>
        </div>

        {/* Scanner Area */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* Camera Placeholder (TODO: Replace with actual camera component) */}
          <div className="absolute inset-0 bg-bg-950 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Icon path={mdiQrcodeScan} size={4} className="mx-auto text-accent-400 animate-pulse" />
              <p className="text-fg-muted">Camera scanner will be initialized here</p>
              <p className="text-sm text-fg-subtle">Integration pending: react-qr-scanner or @zxing/library</p>
              <Button onClick={simulateScan} className="mt-4">
                Simulate Scan (Demo)
              </Button>
            </div>
          </div>

          {/* Scan Frame */}
          {isScanning && (
            <div className="relative z-10 pointer-events-none">
              <div className="w-64 h-64 border-4 border-accent-400 rounded-lg relative">
                {/* Corner Indicators */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent-400" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent-400" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent-400" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent-400" />
                
                {/* Scanning Line */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-accent-400 shadow-lg shadow-accent-500/50"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 z-50 p-6"
          >
            <div className="glass-strong rounded-lg p-4 text-center max-w-md mx-auto">
              <p className="text-fg font-medium mb-2">Position QR code within the frame</p>
              <p className="text-sm text-fg-muted">Align the boarding pass QR code with the scanner</p>
            </div>
          </motion.div>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && isScanning && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-4 top-20 z-40 space-y-2"
          >
            <div className="glass-strong rounded-lg p-3">
              <p className="text-xs text-fg-muted mb-2">Recent Check-ins</p>
              {recentScans.map((ref, idx) => (
                <div
                  key={ref}
                  className="text-xs text-success-400 font-mono mb-1"
                  style={{ opacity: 1 - idx * 0.2 }}
                >
                  ✓ {ref}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Scan Result Modal */}
      <AnimatePresence>
        {scanResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-950/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleContinueScanning()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-modal rounded-lg p-6 max-w-md w-full"
            >
              {/* Result Icon */}
              <div className="text-center mb-4">
                <div
                  className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    getResultColor(scanResult.status) === 'success'
                      ? 'bg-success-500/20'
                      : getResultColor(scanResult.status) === 'warning'
                      ? 'bg-warning-500/20'
                      : 'bg-danger-500/20'
                  }`}
                >
                  <Icon
                    path={getResultIcon(scanResult.status)}
                    size={1.5}
                    className={`${
                      getResultColor(scanResult.status) === 'success'
                        ? 'text-success-400'
                        : getResultColor(scanResult.status) === 'warning'
                        ? 'text-warning-400'
                        : 'text-danger-400'
                    }`}
                  />
                </div>
                <h3 className="text-xl font-bold text-fg mb-2">
                  {scanResult.status === 'success' && 'Check-in Successful'}
                  {scanResult.status === 'already-checked-in' && 'Already Checked In'}
                  {scanResult.status === 'cancelled' && 'Booking Cancelled'}
                  {scanResult.status === 'error' && 'Check-in Failed'}
                </h3>
                <p className="text-fg-muted text-sm">{scanResult.message}</p>
              </div>

              {/* Passenger Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 pb-3 border-b border-fg-subtle/10">
                  <Icon path={mdiAccountCircle} size={0.9} className="text-fg-muted" />
                  <div className="flex-1">
                    <p className="text-xs text-fg-muted">Passenger</p>
                    <p className="text-fg font-semibold">{scanResult.passengerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-fg-subtle/10">
                  <Icon path={mdiTicket} size={0.9} className="text-fg-muted" />
                  <div className="flex-1">
                    <p className="text-xs text-fg-muted">Booking Reference</p>
                    <p className="text-fg font-mono">{scanResult.bookingReference}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-fg-subtle/10">
                  <Icon path={mdiShipWheel} size={0.9} className="text-fg-muted" />
                  <div className="flex-1">
                    <p className="text-xs text-fg-muted">Trip & Vessel</p>
                    <p className="text-fg">{scanResult.tripName}</p>
                    <p className="text-sm text-fg-muted">{scanResult.vessel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-fg-subtle/10">
                  <Icon path={mdiMapMarker} size={0.9} className="text-fg-muted" />
                  <div className="flex-1">
                    <p className="text-xs text-fg-muted">Route</p>
                    <p className="text-fg">{scanResult.route}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-fg-subtle/10">
                  <Icon path={mdiClockOutline} size={0.9} className="text-fg-muted" />
                  <div className="flex-1">
                    <p className="text-xs text-fg-muted">Departure</p>
                    <p className="text-fg">
                      {new Date(scanResult.departureTime).toLocaleString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {scanResult.seatNumber && (
                  <div className="glass-subtle rounded-lg p-3 text-center">
                    <p className="text-xs text-fg-muted mb-1">Assigned Seat</p>
                    <p className="text-2xl font-bold text-accent-400">{scanResult.seatNumber}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {scanResult.status === 'success' ? (
                  <>
                    <Button onClick={handleCheckIn} className="flex-1">
                      <Icon path={mdiCheckCircle} size={0.7} className="mr-2" />
                      Confirm Check-in
                    </Button>
                    <Button variant="outline" onClick={handleContinueScanning}>
                      Skip
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleContinueScanning} variant="outline" className="flex-1">
                    Continue Scanning
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
