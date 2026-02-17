'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Icon from '@mdi/react'
import { mdiCalendar, mdiMapMarker, mdiAccountGroup, mdiArrowRight, mdiClock, mdiTicket, mdiLoading, mdiAlertCircle, mdiRefresh } from '@mdi/js'
import { cn } from '@/lib/utils'

// API Response Types
interface ApiBooking {
  id: string
  reference: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'held'
  paymentStatus: 'paid' | 'pending' | 'refunded'
  numberOfPassengers: number
  totalAmount: number
  createdAt: string
  tripSchedule: {
    startTime: string
    trip: {
      title: string
      description: string
    }
    vessel: {
      name: string
    }
  }
}

interface ApiResponse {
  bookings: ApiBooking[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [bookings, setBookings] = useState<ApiBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchBookings = async (status?: string) => {
    try {
      setError(null)
      if (!refreshing) setLoading(true)

      const params = new URLSearchParams()
      if (status && status !== 'all') {
        params.append('status', status)
      }
      params.append('limit', '50') // Get more bookings for better UX

      const response = await fetch(`/api/bookings?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data: ApiResponse = await response.json()
      setBookings(data.bookings)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const status = activeTab === 'upcoming' ? 'confirmed,held' :
                   activeTab === 'past' ? 'completed,cancelled' : undefined
    fetchBookings(status)
  }, [activeTab])

  const handleRefresh = () => {
    setRefreshing(true)
    const status = activeTab === 'upcoming' ? 'confirmed,held' :
                   activeTab === 'past' ? 'completed,cancelled' : undefined
    fetchBookings(status)
  }

  // Filter bookings based on active tab
  const getFilteredBookings = () => {
    const now = new Date()
    return bookings.filter(booking => {
      const startTime = new Date(booking.tripSchedule.startTime)

      switch (activeTab) {
        case 'upcoming':
          return startTime > now && (booking.status === 'confirmed' || booking.status === 'held')
        case 'past':
          return startTime <= now || booking.status === 'completed' || booking.status === 'cancelled'
        default:
          return true
      }
    })
  }

  const filteredBookings = getFilteredBookings()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Icon path={mdiLoading} size={2} className="animate-spin mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Loading your bookings...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your booking information.</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Icon path={mdiAlertCircle} size={2} className="mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to load bookings</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <Icon path={mdiRefresh} size={0.75} className="mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Manage your trip bookings and reservations</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
          <Icon path={refreshing ? mdiLoading : mdiRefresh} size={0.75} className={cn("mr-2", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({filteredBookings.filter(b => {
              const startTime = new Date(b.tripSchedule.startTime)
              return startTime > new Date() && (b.status === 'confirmed' || b.status === 'held')
            }).length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({filteredBookings.filter(b => {
              const startTime = new Date(b.tripSchedule.startTime)
              return startTime <= new Date() || b.status === 'completed' || b.status === 'cancelled'
            }).length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({bookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filteredBookings.filter(b => {
            const startTime = new Date(b.tripSchedule.startTime)
            return startTime > new Date() && (b.status === 'confirmed' || b.status === 'held')
          }).length === 0 ? (
            <EmptyState
              title="No upcoming bookings"
              description="You don't have any upcoming trips. Start planning your next adventure!"
              actionLabel="Browse Trips"
              actionHref="/trips"
            />
          ) : (
            filteredBookings
              .filter(b => {
                const startTime = new Date(b.tripSchedule.startTime)
                return startTime > new Date() && (b.status === 'confirmed' || b.status === 'held')
              })
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filteredBookings.filter(b => {
            const startTime = new Date(b.tripSchedule.startTime)
            return startTime <= new Date() || b.status === 'completed' || b.status === 'cancelled'
          }).length === 0 ? (
            <EmptyState
              title="No past bookings"
              description="Your completed trips will appear here."
              actionLabel="Browse Trips"
              actionHref="/trips"
            />
          ) : (
            filteredBookings
              .filter(b => {
                const startTime = new Date(b.tripSchedule.startTime)
                return startTime <= new Date() || b.status === 'completed' || b.status === 'cancelled'
              })
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {bookings.length === 0 ? (
            <EmptyState
              title="No bookings found"
              description="You haven't made any bookings yet. Start exploring our trips!"
              actionLabel="Browse Trips"
              actionHref="/trips"
            />
          ) : (
            bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookingCard({ booking }: { booking: ApiBooking }) {
  const statusConfig = {
    confirmed: { label: 'Confirmed', variant: 'default' as const, color: 'bg-green-500' },
    pending: { label: 'Payment Pending', variant: 'secondary' as const, color: 'bg-yellow-500' },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: 'bg-red-500' },
    completed: { label: 'Completed', variant: 'outline' as const, color: 'bg-blue-500' },
    held: { label: 'Held', variant: 'secondary' as const, color: 'bg-orange-500' },
  }

  const status = statusConfig[booking.status] || { label: booking.status, variant: 'outline' as const, color: 'bg-gray-500' }
  const startTime = new Date(booking.tripSchedule.startTime)
  const isPast = startTime < new Date() || booking.status === 'completed'
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
              <CardTitle className="text-xl">{booking.tripSchedule.trip.title}</CardTitle>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <CardDescription>{booking.reference}</CardDescription>
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
                {startTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {startTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Vessel */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon path={mdiMapMarker} size={0.83} className="text-primary" aria-hidden={true} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vessel</p>
              <p className="font-semibold">{booking.tripSchedule.vessel?.name || 'TBD'}</p>
              <p className="text-sm text-muted-foreground">Boat cruise</p>
            </div>
          </div>

          {/* Passengers */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon path={mdiAccountGroup} size={0.83} className="text-primary" aria-hidden={true} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Passengers</p>
              <p className="font-semibold">{booking.numberOfPassengers} passenger{booking.numberOfPassengers > 1 ? 's' : ''}</p>
              <p className="text-sm text-muted-foreground">
                Booking reference: {booking.reference}
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
