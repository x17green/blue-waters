/**
 * Operator Trips Management Page
 * 
 * Lists all trips created by the operator with actions to edit, create schedules
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Icon from '@mdi/react'
import { mdiPlus, mdiCalendar, mdiPencil, mdiArchive, mdiChartBar, mdiMapMarker, mdiLoading, mdiAlertCircle, mdiRefresh, mdiAccountGroup, mdiClock } from '@mdi/js'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { useAuth } from '@/src/hooks/use-auth'
import { cn } from '@/src/lib/utils'

// API Response Types
interface ApiTrip {
  id: string
  title: string
  description: string
  category: string
  durationMinutes: number
  highlights: string[]
  amenities: string[]
  pricing: {
    minPrice: number
    maxPrice: number
    tiers: number
  }
  vessel?: {
    id: string
    name: string
    registrationNo: string
    capacity: number
  }
  operator?: {
    id: string
    companyName: string
    rating: number | null
  }
  createdAt: string
}

interface ApiResponse {
  trips: ApiTrip[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

// Legacy interface for backward compatibility (will be removed)
interface Trip {
  id: string
  title: string
  description: string
  category: string
  durationMinutes: number
  status: string
  vessel: {
    name: string
    capacity: number
  }
  pricing: {
    minPrice: number
    maxPrice: number
  }
  statistics?: {
    totalBookings: number
    upcomingSchedules: number
    averageRating: number
  }
  createdAt: string
}

export default function OperatorTripsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchTrips()
    }
  }, [user, loading, router])

  const fetchTrips = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/trips?operatorId=' + user?.id + '&limit=50')
      if (!response.ok) {
        throw new Error('Failed to fetch trips')
      }

      const data: ApiResponse = await response.json()
      
      // Transform API response to legacy format for now
      const transformedTrips: Trip[] = data.trips.map((trip) => ({
        id: trip.id,
        title: trip.title,
        description: trip.description,
        category: trip.category,
        durationMinutes: trip.durationMinutes,
        status: 'active', // API doesn't return status, assume active
        vessel: trip.vessel ? {
          name: trip.vessel.name,
          capacity: trip.vessel.capacity,
        } : {
          name: 'TBD',
          capacity: 0,
        },
        pricing: trip.pricing,
        statistics: {
          totalBookings: 0, // TODO: Add booking stats API
          upcomingSchedules: 0, // TODO: Add schedule stats API
          averageRating: trip.operator?.rating || 0,
        },
        createdAt: trip.createdAt,
      }))

      setTrips(transformedTrips)
    } catch (err) {
      console.error('Error fetching trips:', err)
      setError(err instanceof Error ? err.message : 'Failed to load trips')
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchTrips()
  }

  const filteredTrips = trips.filter((trip) => {
    if (activeTab === 'all') return true
    return trip.status === activeTab
  })

  const activeTrips = trips.filter((trip) => trip.status === 'active')
  const inactiveTrips = trips.filter((trip) => trip.status === 'inactive')
  const archivedTrips = trips.filter((trip) => trip.status === 'archived')

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      tour: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      transport: 'bg-green-500/10 text-green-500 border-green-500/20',
      charter: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      event: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    }
    return colors[category] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      archived: 'bg-red-500/10 text-red-500 border-red-500/20',
    }
    return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Icon path={mdiLoading} size={2} className="animate-spin mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Loading your trips...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your trip information.</p>
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
            <h2 className="text-xl font-semibold mb-2">Failed to load trips</h2>
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-fg mb-2">My Trips</h1>
          <p className="text-muted-foreground">
            Manage your boat trips and schedules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <Icon path={refreshing ? mdiLoading : mdiRefresh} size={0.75} className={cn("mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Link href="/operator/trips/new">
            <Button size="lg" className="gap-2">
              <Icon path={mdiPlus} size={0.8} aria-hidden={true} />
              Create New Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {/* Total Trips */}
        <Card className="glass-strong border border-border-subtle hover:border-accent-900 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-fg-muted text-sm mb-2 font-medium">
                  Total Trips
                </p>
                <p className="text-4xl font-bold text-accent-400">
                  {trips.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Active trips available
                </p>
              </div>
              <div className="glass-subtle rounded-lg p-3">
                <Icon path={mdiMapMarker} size={1.17} className="text-accent-500" aria-hidden={true} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card className="glass-strong border border-border-subtle hover:border-success-300 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-fg-muted text-sm mb-2 font-medium">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-success-500">
                  {trips.reduce((sum, t) => sum + (t.statistics?.totalBookings || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all trips
                </p>
              </div>
              <div className="glass-subtle rounded-lg p-3">
                <Icon path={mdiChartBar} size={1.17} className="text-success-600" aria-hidden={true} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedules */}
        <Card className="glass-strong border border-border-subtle hover:border-info-300 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-fg-muted text-sm mb-2 font-medium">
                  Upcoming Schedules
                </p>
                <p className="text-4xl font-bold text-info-500">
                  {trips.reduce((sum, t) => sum + (t.statistics?.upcomingSchedules || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled departures
                </p>
              </div>
              <div className="glass-subtle rounded-lg p-3">
                <Icon path={mdiCalendar} size={1.17} className="text-info-500" aria-hidden={true} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="glass-strong border border-border-subtle hover:border-warning-300 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-fg-muted text-sm mb-2 font-medium">
                  Avg. Rating
                </p>
                <p className="text-4xl font-bold text-warning-500">
                  {(trips.reduce((sum, t) => sum + (t.statistics?.averageRating || 0), 0) / Math.max(trips.length, 1) || 0).toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Customer satisfaction
                </p>
              </div>
              <div className="glass-subtle rounded-lg p-3">
                <Icon path={mdiChartBar} size={1.17} className="text-warning-500" aria-hidden={true} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="glass-subtle border border-border-default p-1">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:glass-strong data-[state=active]:text-accent-300 data-[state=active]:border-accent-700 data-[state=active]:border"
          >
            All Trips ({trips.length})
          </TabsTrigger>
          <TabsTrigger 
            value="active" 
            className="data-[state=active]:glass-strong data-[state=active]:text-accent-300 data-[state=active]:border-accent-700 data-[state=active]:border"
          >
            Active ({activeTrips.length})
          </TabsTrigger>
          <TabsTrigger 
            value="inactive" 
            className="data-[state=active]:glass-strong data-[state=active]:text-accent-300 data-[state=active]:border-accent-700 data-[state=active]:border"
          >
            Inactive ({inactiveTrips.length})
          </TabsTrigger>
          <TabsTrigger 
            value="archived" 
            className="data-[state=active]:glass-strong data-[state=active]:text-accent-300 data-[state=active]:border-accent-700 data-[state=active]:border"
          >
            Archived ({archivedTrips.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredTrips.length === 0 ? (
            <Card className="glass border border-border-default">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="glass-subtle rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Icon path={mdiMapMarker} size={1.67} className="text-accent-500" aria-hidden={true} />
                </div>
                <h3 className="text-xl font-semibold text-fg mb-3">
                  {activeTab === 'all' ? 'No trips found' : `No ${activeTab} trips`}
                </h3>
                <p className="text-muted-foreground mb-8 text-center max-w-md">
                  {activeTab === 'all' 
                    ? "You haven't created any trips yet. Start your journey by creating your first trip!"
                    : `No trips with ${activeTab} status found.`
                  }
                </p>
                {activeTab === 'all' && (
                  <Link href="/operator/trips/new">
                    <Button size="lg" className="glass-strong hover:glass-modal border border-accent-700 text-accent-300 hover:text-accent-200">
                      <Icon path={mdiPlus} size={0.8} className="mr-2" aria-hidden={true} />
                      Create Your First Trip
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip) => (
                <Card key={trip.id} className="glass-card flex flex-col hover:glass-hover transition-all duration-300">
                  <div className={cn('h-1', trip.status === 'active' ? 'bg-green-500' : trip.status === 'inactive' ? 'bg-gray-500' : 'bg-red-500')} />
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={cn('text-xs', getCategoryColor(trip.category))}>
                        {trip.category}
                      </Badge>
                      <Badge className={cn('text-xs', getStatusColor(trip.status))}>
                        {trip.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-fg line-clamp-1">{trip.title}</CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-2">
                      {trip.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon path={mdiMapMarker} size={0.6} className="text-accent-500" aria-hidden={true} />
                        <div>
                          <p className="text-muted-foreground text-xs">Vessel</p>
                          <p className="font-medium text-fg">{trip.vessel.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon path={mdiAccountGroup} size={0.6} className="text-accent-500" aria-hidden={true} />
                        <div>
                          <p className="text-muted-foreground text-xs">Capacity</p>
                          <p className="font-medium text-fg">{trip.vessel.capacity} seats</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon path={mdiClock} size={0.6} className="text-accent-500" aria-hidden={true} />
                        <div>
                          <p className="text-muted-foreground text-xs">Duration</p>
                          <p className="font-medium text-fg">{Math.floor(trip.durationMinutes / 60)}h {trip.durationMinutes % 60}m</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">₦</span>
                        <div>
                          <p className="text-muted-foreground text-xs">Price Range</p>
                          <p className="font-medium text-fg">₦{trip.pricing.minPrice.toLocaleString()} - ₦{trip.pricing.maxPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {trip.statistics && (
                      <div className="border-t border-border-subtle pt-4">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <p className="text-2xl font-bold text-accent-400">{trip.statistics.totalBookings}</p>
                            <p className="text-xs text-muted-foreground">Bookings</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-info-500">{trip.statistics.upcomingSchedules}</p>
                            <p className="text-xs text-muted-foreground">Schedules</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-warning-500">{trip.statistics.averageRating.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-border-subtle">
                      <Link href={`/operator/trips/${trip.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2">
                          <Icon path={mdiPencil} size={0.6} aria-hidden={true} />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/operator/trips/${trip.id}/schedules`} className="flex-1">
                        <Button className="w-full gap-2">
                          <Icon path={mdiCalendar} size={0.6} aria-hidden={true} />
                          Schedules
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
