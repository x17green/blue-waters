'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockBookings, getUpcomingBookings, getPastBookings, type MockBooking } from '@/lib/mock-data'
import Icon from '@mdi/react'
import { mdiCalendar, mdiMapMarker, mdiAccountGroup, mdiArrowRight, mdiClock, mdiTicket } from '@mdi/js'
import { cn } from '@/lib/utils'

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming')

  const upcomingBookings = getUpcomingBookings()
  const pastBookings = getPastBookings()
  const allBookings = [...mockBookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastBookings.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({allBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <EmptyState
              title="No upcoming bookings"
              description="You don't have any upcoming trips. Start planning your next adventure!"
              actionLabel="Browse Trips"
              actionHref="/trips"
            />
          ) : (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <EmptyState
              title="No past bookings"
              description="Your booking history will appear here after your first trip."
              actionLabel="Book a Trip"
              actionHref="/trips"
            />
          ) : (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {allBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookingCard({ booking }: { booking: MockBooking }) {
  const statusConfig = {
    confirmed: { label: 'Confirmed', variant: 'default' as const, color: 'bg-green-500' },
    pending: { label: 'Payment Pending', variant: 'secondary' as const, color: 'bg-yellow-500' },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: 'bg-red-500' },
    completed: { label: 'Completed', variant: 'outline' as const, color: 'bg-blue-500' },
    'checked-in': { label: 'Checked In', variant: 'default' as const, color: 'bg-purple-500' },
  }

  const status = statusConfig[booking.status]
  const isPast = new Date(booking.departureDate) < new Date() || booking.status === 'completed'
  const isCancelled = booking.status === 'cancelled'

  return (
    <Card className={cn(
      'glass-card overflow-hidden transition-all hover:glass-hover',
      isCancelled && 'opacity-70'
    )}>
      <div className={cn('h-1', status.color)} />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">{booking.tripName}</CardTitle>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <CardDescription>{booking.bookingReference}</CardDescription>
          </div>
          {!isPast && !isCancelled && booking.status === 'confirmed' && (
            <Button asChild size="sm">
              <Link href={`/dashboard/bookings/${booking.id}`}>
                <Icon path={mdiTicket} size={0.67} className="mr-2" aria-hidden={true} />
                View Ticket
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon path={mdiCalendar} size={0.83} className="text-primary" aria-hidden={true} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-semibold">
                {new Date(booking.departureDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.departureTime} - {booking.arrivalTime}
              </p>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon path={mdiMapMarker} size={0.83} className="text-primary" aria-hidden={true} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Route</p>
              <p className="font-semibold">{booking.departure}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Icon path={mdiArrowRight} size={0.5} className="" aria-hidden={true} />
                {booking.arrival}
              </p>
            </div>
          </div>

          {/* Passengers */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon path={mdiAccountGroup} size={0.83} className="text-primary" aria-hidden={true} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Passengers</p>
              <p className="font-semibold">{booking.passengers.length} passenger{booking.passengers.length > 1 ? 's' : ''}</p>
              <p className="text-sm text-muted-foreground">
                {booking.passengers.map((p) => `${p.firstName} ${p.lastName}`).join(', ')}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">₦</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-semibold">₦{booking.totalAmount.toLocaleString()}</p>
              <Badge variant={booking.paymentStatus === 'paid' ? 'outline' : 'secondary'} className="text-xs">
                {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'refunded' ? 'Refunded' : 'Pending'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/bookings/${booking.id}`}>
              View Details
              <Icon path={mdiArrowRight} size={0.67} className="ml-2" aria-hidden={true} />
            </Link>
          </Button>

          {booking.status === 'pending' && (
            <Button>Complete Payment</Button>
          )}

          {booking.status === 'confirmed' && !isPast && (
            <Button variant="ghost" className="text-destructive hover:text-destructive">
              Cancel Booking
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string
  description: string
  actionLabel: string
  actionHref: string
}) {
  return (
    <Card className="glass-subtle p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon path={mdiTicket} size={1.33} className="text-muted-foreground" aria-hidden={true} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      <Button asChild>
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </Card>
  )
}
