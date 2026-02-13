'use client'

/**
 * QR Code Scanner Component for Operator Check-in
 * Scans passenger QR codes and initiates check-in process
 */

import { useState, useCallback } from 'react'
// @ts-ignore - react-qr-scanner doesn't have type definitions
import QrScanner from 'react-qr-scanner'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import { CheckCircle2, XCircle, Camera, CameraOff } from 'lucide-react'

interface BoardingPass {
  passenger: {
    id: string
    fullName: string
    email: string | null
    phone: string | null
  }
  booking: {
    id: string
    bookingReference: string | null
    status: string
  }
  trip: {
    id: string
    title: string
    departurePort: string | null
    arrivalPort: string | null
  }
  schedule: {
    id: string
    startTime: string
    endTime: string
  }
  vessel: {
    name: string
    registrationNo: string | null
  }
  checkin: {
    id: string
    checkedInAt: string
    method: string
  }
}

interface QRScannerProps {
  tripId: string
  scheduleId: string
  onCheckinComplete?: (boardingPass: BoardingPass) => void
}

export function QRScanner({
  tripId,
  scheduleId,
  onCheckinComplete,
}: QRScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<BoardingPass | null>(null)

  // Handle QR code scan
  const handleScan = useCallback(
    async (result: { text: string } | null) => {
      if (!result || !result.text || loading) {
        return
      }

      const qrCode = result.text

      // Prevent duplicate scans
      if (success?.booking.bookingReference === qrCode) {
        return
      }

      setLoading(true)
      setError(null)
      setSuccess(null)

      try {
        const response = await fetch(
          `/api/trips/${tripId}/schedules/${scheduleId}/checkin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              qrCode,
              method: 'qr',
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Check-in failed')
        }

        setSuccess(data)
        setScanning(false)

        // Notify parent component
        if (onCheckinComplete) {
          onCheckinComplete(data)
        }

        // Auto-reset after 5 seconds
        setTimeout(() => {
          setSuccess(null)
        }, 5000)
      } catch (err) {
        console.error('Check-in error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')

        // Auto-clear error after 5 seconds
        setTimeout(() => {
          setError(null)
        }, 5000)
      } finally {
        setLoading(false)
      }
    },
    [tripId, scheduleId, loading, success, onCheckinComplete]
  )

  // Handle scan errors
  const handleError = useCallback((err: Error) => {
    console.error('Scanner error:', err)
    setError('Camera access failed. Please check permissions.')
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>QR Code Check-in</CardTitle>
        <CardDescription>
          Scan passenger QR codes to check them in for boarding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Toggle */}
        <div className="flex justify-center">
          {!scanning ? (
            <Button
              onClick={() => {
                setScanning(true)
                setError(null)
                setSuccess(null)
              }}
              size="lg"
              className="gap-2"
            >
              <Camera className="h-5 w-5" />
              Start Scanning
            </Button>
          ) : (
            <Button
              onClick={() => setScanning(false)}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <CameraOff className="h-5 w-5" />
              Stop Scanning
            </Button>
          )}
        </div>

        {/* Scanner View */}
        {scanning && (
          <div className="relative w-full aspect-square max-w-md mx-auto rounded-lg overflow-hidden border-2 border-primary">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
              constraints={{
                video: { facingMode: 'environment' },
              }}
            />
            {loading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">
              Check-in Successful!
            </AlertTitle>
            <AlertDescription className="mt-4 space-y-2 text-green-700">
              <div className="grid gap-2">
                <div>
                  <strong>Passenger:</strong> {success.passenger.fullName}
                </div>
                <div>
                  <strong>Booking:</strong>{' '}
                  {success.booking.bookingReference || 'N/A'}
                </div>
                <div>
                  <strong>Trip:</strong> {success.trip.title}
                </div>
                <div>
                  <strong>Vessel:</strong> {success.vessel.name}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Status:</strong>
                  <Badge variant="default">Checked In</Badge>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="error">
            <XCircle className="h-5 w-5" />
            <AlertTitle>Check-in Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        {!scanning && !success && !error && (
          <div className="text-center text-sm text-muted-foreground space-y-2 p-4">
            <p>Click "Start Scanning" to activate the camera</p>
            <p>Position the QR code within the camera frame</p>
            <p>The system will automatically check in the passenger</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
