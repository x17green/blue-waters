'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getBookingById } from '@/lib/mock-data'
import Icon from '@mdi/react'
import {
  mdiCalendar,
  mdiMapMarker,
  mdiAccountGroup,
  mdiArrowRight,
  mdiChevronLeft,
  mdiDownload,
  mdiShare,
  mdiAlertCircle,
  mdiCheckCircle,
  mdiClock,
  mdiPhone,
  mdiEmail,
  mdiQrcode,
  mdiPrinter,
  mdiInformation,
} from '@mdi/js'
import { cn } from '@/lib/utils'

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const booking = getBookingById(bookingId)

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon path={mdiAlertCircle} size={1.33} className="text-muted-foreground" aria-hidden={true} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The booking you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <Link href="/dashboard/bookings">View All Bookings</Link>
        </Button>
      </div>
    )
  }

  const statusConfig = {
    confirmed: {
      label: 'Confirmed',
      variant: 'default' as const,
      color: 'bg-green-500',
      icon: mdiCheckCircle,
      description: 'Your booking is confirmed. You will receive a reminder 24 hours before departure.',
    },
    pending: {
      label: 'Payment Pending',
      variant: 'secondary' as const,
      color: 'bg-yellow-500',
      icon: mdiClock,
      description: 'Complete your payment to confirm this booking.',
    },
    cancelled: {
      label: 'Cancelled',
      variant: 'destructive' as const,
      color: 'bg-red-500',
      icon: mdiAlertCircle,
      description: 'This booking has been cancelled. If you were charged, a refund will be processed within 5-7 business days.',
    },
    completed: {
      label: 'Completed',
      variant: 'outline' as const,
      color: 'bg-blue-500',
      icon: mdiCheckCircle,
      description: 'This trip has been completed. Thank you for traveling with us!',
    },
    'checked-in': {
      label: 'Checked In',
      variant: 'default' as const,
      color: 'bg-purple-500',
      icon: mdiCheckCircle,
      description: 'You have checked in for this trip. Please proceed to the boarding area.',
    },
  }

  const status = statusConfig[booking.status]
  const statusIconPath = status.icon
  const isPast = new Date(booking.departureDate) < new Date() || booking.status === 'completed'
  const isCancelled = booking.status === 'cancelled'
  const showQRCode = booking.status === 'confirmed' || booking.status === 'checked-in'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{booking.tripName}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={status.variant} className="flex items-center gap-1">
                <Icon path={statusIconPath} size={0.5} className="" aria-hidden={true} />
                {status.label}
              </Badge>
              <p className="text-muted-foreground">
                Booking Ref: <span className="font-mono font-semibold">{booking.bookingReference}</span>
              </p>
            </div>
          </div>

          {/* Status Alert */}
          <Alert className={cn(
            isCancelled && 'border-destructive',
            booking.status === 'pending' && 'border-yellow-500'
          )}>
            <Icon path={statusIconPath} size={0.67} className="" aria-hidden={true} />
            <AlertTitle>{status.label}</AlertTitle>
            <AlertDescription>{status.description}</AlertDescription>
          </Alert>

          {/* Trip Details */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date & Time */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon path={mdiCalendar} size={1} className="text-primary" aria-hidden={true} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                  <p className="font-semibold text-lg">
                    {new Date(booking.departureDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Icon path={mdiClock} size={0.67} className="" aria-hidden={true} />
                    <span>Departure: {booking.departureTime}</span>
                    <span>•</span>
                    <span>Arrival: {booking.arrivalTime}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Route */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon path={mdiMapMarker} size={1} className="text-primary" aria-hidden={true} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Route</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div>
                        <p className="font-semibold">{booking.departure}</p>
                        <p className="text-sm text-muted-foreground">Departure Point</p>
                      </div>
                    </div>
                    <div className="ml-1.5 h-8 w-0.5 bg-border" />
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div>
                        <p className="font-semibold">{booking.arrival}</p>
                        <p className="text-sm text-muted-foreground">Arrival Point</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Passengers */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon path={mdiAccountGroup} size={1} className="text-primary" aria-hidden={true} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    Passenger{booking.passengers.length > 1 ? 's' : ''} ({booking.passengers.length})
                  </p>
                  <div className="space-y-3">
                    {booking.passengers.map((passenger, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <p className="font-semibold mb-1">
                          {passenger.firstName} {passenger.lastName}
                          {passenger.seatNumber && (
                            <Badge variant="secondary" className="ml-2">
                              Seat {passenger.seatNumber}
                            </Badge>
                          )}
                        </p>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon path={mdiEmail} size={0.5} className="" aria-hidden={true} />
                            <span>{passenger.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon path={mdiPhone} size={0.5} className="" aria-hidden={true} />
                            <span>{passenger.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Ticket Price × {booking.passengers.length}
                  </span>
                  <span className="font-semibold">
                    ₦{booking.totalAmount.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold">₦{booking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">Payment Status</span>
                <Badge
                  variant={
                    booking.paymentStatus === 'paid'
                      ? 'default'
                      : booking.paymentStatus === 'refunded'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'refunded' ? 'Refunded' : 'Pending'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* QR Code Card */}
            {showQRCode && (
              <Card className="glass-subtle">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon path={mdiQrcode} size={0.83} className="" aria-hidden={true} />
                    Your Ticket
                  </CardTitle>
                  <CardDescription>
                    Show this QR code at check-in
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* QR Code Display */}
                  <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                    {booking.qrCode ? (
                      <div className="relative w-48 h-48 border-4 border-primary rounded-lg overflow-hidden">
                        <Image
                          src={booking.qrCode}
                          alt="Booking QR Code"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                        <Icon path={mdiQrcode} size={4} className="text-muted-foreground" aria-hidden={true} />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="font-mono font-semibold text-lg mb-1">
                      {booking.bookingReference}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Scan or enter this code at check-in
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Icon path={mdiDownload} size={0.67} className="mr-2" aria-hidden={true} />
                      Download Ticket
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Icon path={mdiShare} size={0.67} className="mr-2" aria-hidden={true} />
                      Share Ticket
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Icon path={mdiPrinter} size={0.67} className="mr-2" aria-hidden={true} />
                      Print Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card className="glass-subtle">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {booking.status === 'pending' && (
                  <Button className="w-full" size="lg">
                    Complete Payment
                  </Button>
                )}

                {booking.status === 'confirmed' && !isPast && (
                  <>
                    <Alert>
                      <Icon path={mdiInformation} size={0.67} className="" aria-hidden={true} />
                      <AlertDescription className="text-xs">
                        Free cancellation up to 24 hours before departure
                      </AlertDescription>
                    </Alert>
                    <Button className="w-full" variant="destructive">
                      Cancel Booking
                    </Button>
                  </>
                )}

                <Button className="w-full" variant="outline" asChild>
                  <Link href="/help">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Alert>
              <Icon path={mdiInformation} size={0.67} className="" aria-hidden={true} />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription className="text-xs space-y-1">
                <p>• Arrive at least 30 minutes before departure</p>
                <p>• Bring a valid ID for verification</p>
                <p>• Check weather conditions before travel</p>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
