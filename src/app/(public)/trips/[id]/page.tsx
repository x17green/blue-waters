'use client'

import {
  mdiAccountGroup,
  mdiAlertCircle,
  mdiArrowRight,
  mdiCalendar,
  mdiCheckCircle,
  mdiClock,
  mdiFerry,
  mdiInformation,
  mdiLoading,
  mdiMapMarker,
  mdiStar,
} from '@mdi/js'
import Icon from '@mdi/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// API Response Types
interface ApiTrip {
  id: string
  title: string
  description: string
  category: string | null
  durationMinutes: number
  highlights: string[]
  amenities: string[]
  vessel: {
    id: string
    name: string
    registrationNo: string
    capacity: number
    vesselMetadata?: {
      image?: string | null
      amenities?: string[]
    }
  }
  operator: {
    id: string
    companyName: string
    rating: number | null
    contact: {
      fullName: string
      phone: string
    }
  } | null
  schedules: ApiSchedule[]
  reviews: any[]
  statistics: {
    totalBookings: number
    averageRating: number
    reviewCount: number
    upcomingSchedules: number
  }
  departurePort?: string | null
  arrivalPort?: string | null
  routeName?: string | null
  createdAt: string
  updatedAt: string
}

interface ApiSchedule {
  id: string
  startTime: string
  endTime: string
  capacity: number
  bookedSeats: number
  availableSeats: number
  status: string
  bookingsCount: number
  // optional ports may be present on server schedule objects
  departurePort?: string | null
  arrivalPort?: string | null
}

interface DetailedSchedule extends ApiSchedule {
  departurePort: string
  arrivalPort: string
  priceTiers: Array<{
    id: string
    name: string
    description: string | null
    price: number
    capacity: number | null
  }>
}

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id as string

  const [trip, setTrip] = useState<ApiTrip | null>(null)
  const [schedules, setSchedules] = useState<DetailedSchedule[]>([])
  const [weekAvailability, setWeekAvailability] = useState<Record<string, DetailedSchedule[]>>({})
  const [tripStartingPrice, setTripStartingPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [schedulesLoading, setSchedulesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(getNextAvailableDate())

  // When date changes clear any schedule/tier selection
  useEffect(() => {
    setSelectedSchedule(null)
    setSelectedTierId(null)
  }, [selectedDate])

  // current schedule (computed from schedules state)
  const schedule = schedules.find((s) => s.id === selectedSchedule)

  // Selected price tier for the currently-selected schedule
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null)

  // fetch trip details (SWR)
  const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch ${url}`)
    return res.json()
  }

  const { data: tripData, error: tripError } = useSWR(tripId ? `/api/trips/${tripId}` : null, fetcher, { dedupingInterval: 60000, revalidateOnFocus: false })

  useEffect(() => {
    let mounted = true
    if (tripData && mounted) {
      setTrip(tripData.trip)
      setError(null)
    }
    if (tripError && mounted) setError(tripError instanceof Error ? tripError.message : 'Failed to load trip data')
    setLoading(!tripData && !tripError)
    return () => { mounted = false }
  }, [tripData, tripError])

  // fetch schedules for the selected date only (SWR: cache-first + background revalidate)
  const startIsoForSelected = new Date(selectedDate + 'T00:00:00.000Z').toISOString()
  const endDateObjForSelected = new Date(selectedDate + 'T00:00:00.000Z')
  endDateObjForSelected.setUTCDate(endDateObjForSelected.getUTCDate() + 1)
  const endIsoForSelected = endDateObjForSelected.toISOString()

  const schedulesKey = tripId ? `/api/trips/${tripId}/schedules?startDate=${encodeURIComponent(startIsoForSelected)}&endDate=${encodeURIComponent(endIsoForSelected)}` : null
  const { data: schedulesData, error: schedulesError, isValidating: schedulesValidating } = useSWR(schedulesKey, fetcher, { dedupingInterval: 10000, refreshInterval: 15000, revalidateOnFocus: false })

  useEffect(() => {
    let mounted = true
    if (schedulesData && mounted) {
      const filtered = (schedulesData.schedules || []).filter((s: any) => s.tripId === tripId)
      setSchedules(filtered)
    } else if (schedulesError && mounted) {
      setSchedules([])
    }

    setSchedulesLoading(Boolean(schedulesValidating && !schedulesData))
    return () => { mounted = false }
  }, [schedulesData, schedulesError, schedulesValidating, tripId])

  // Default selected tier when schedule changes (server returns tiers ordered asc)
  useEffect(() => {
    if (schedule && schedule.priceTiers && schedule.priceTiers.length > 0) {
      setSelectedTierId(schedule.priceTiers[0].id)
    } else {
      setSelectedTierId(null)
    }
  }, [schedule])

  // Week availability fetch (next 7 days from selectedDate)
  useEffect(() => {
    if (!tripId) return
    const weekStart = new Date(selectedDate + 'T00:00:00.000Z')
    const weekEnd = new Date(weekStart)
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)

    const run = async () => {
      try {
        const res = await fetch(`/api/trips/${tripId}/schedules?startDate=${encodeURIComponent(weekStart.toISOString())}&endDate=${encodeURIComponent(weekEnd.toISOString())}`)
        if (!res.ok) return
        const json = await res.json()
        const map: Record<string, DetailedSchedule[]> = {}
        ;(json.schedules || []).forEach((s: any) => {
          const iso = s.startTime.split('T')[0]
          map[iso] = map[iso] || []
          map[iso].push(s)
        })
        setWeekAvailability(map)
      } catch (err) {
        console.warn('week availability fetch failed', err)
      }
    }

    run()
  }, [tripId, selectedDate])

  // Fetch trip-wide starting price (independent of selectedDate)
  useEffect(() => {
    if (!tripId) {
      setTripStartingPrice(null)
      return
    }

    const run = async () => {
      try {
        const res = await fetch(`/api/trips/${tripId}/schedules`)
        if (!res.ok) {
          setTripStartingPrice(null)
          return
        }
        const json = await res.json()
        const prices: number[] = (json.schedules || []).flatMap((s: any) => (s.priceTiers || []).map((pt: any) => pt.price))
        setTripStartingPrice(prices.length > 0 ? Math.min(...prices) : null)
      } catch (err) {
        console.warn('failed to fetch trip starting price', err)
        setTripStartingPrice(null)
      }
    }

    run()
  }, [tripId])

  if (loading) {
    // Page skeleton: keep layout stable and show placeholders instead of a full-page spinner
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-muted animate-pulse" />

            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 bg-muted rounded-lg animate-pulse h-36" />
              <div className="p-6 bg-muted rounded-lg animate-pulse h-40" />
              <div className="p-6 bg-muted rounded-lg animate-pulse h-44" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="p-6 bg-muted rounded-lg space-y-4">
                <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
                <div className="h-40 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                <div className="h-10 bg-muted rounded w-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon path={mdiAlertCircle} size={1.33} className="text-muted-foreground" aria-hidden={true} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Trip Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error || "The trip you're looking for doesn't exist or has been removed."}
        </p>
        <Button asChild>
          <Link href="/trips">Browse All Trips</Link>
        </Button>
      </div>
    )
  }

  // Combine trip-level and vessel-level amenities (dedupe)
  const combinedAmenities = Array.from(new Set([...(trip.amenities || []), ...(trip.vessel?.vesselMetadata?.amenities || [])]))

  const handleBookNow = () => {
    if (!selectedSchedule) return
    // Navigate to booking page with trip, schedule and selected price tier
    const params = new URLSearchParams({ trip: trip.id, schedule: selectedSchedule, date: selectedDate })
    if (selectedTierId) params.set('priceTierId', selectedTierId)
    router.push(`/book?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative h-[400px] rounded-lg overflow-hidden bg-muted">
            {trip.vessel?.vesselMetadata?.image ? (
              <Image
                src={trip.vessel.vesselMetadata.image}
                alt={`${trip.vessel.name} image`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-600" aria-hidden>
                <svg width="140" height="84" viewBox="0 0 140 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                  <path d="M8 56c8-8 24-8 40-3 16 5 32 5 48 0 8-3 16-6 24 3" stroke="white" strokeWidth="1.5" strokeOpacity="0.18" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M28 44c8-5 16-8 24-5 8 3 16 3 24 0" stroke="white" strokeWidth="1.2" strokeOpacity="0.12" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="100" y="22" width="18" height="8" rx="1" fill="white" fillOpacity="0.06" />
                </svg>
              </div>
            )}

            {/* subtle overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* vessel caption */}
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-2xl font-semibold drop-shadow">{trip.vessel.name}</h2>
              <p className="text-sm drop-shadow">{trip.vessel.registrationNo}</p>
            </div>
          </div>

          {/* Trip Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon path={mdiStar} size={0.83} className="fill-yellow-400 text-yellow-400" aria-hidden={true} />
                    <span className="font-semibold text-foreground">{trip.statistics.averageRating.toFixed(1)}</span>
                    <span>({trip.statistics.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                <p className="text-3xl font-bold">
                  {tripStartingPrice != null
                    ? `₦${tripStartingPrice.toLocaleString()}`
                    : (schedules.length > 0
                        ? `₦${Math.min(...schedules.flatMap(s => s.priceTiers?.map(pt => pt.price) || [0])).toLocaleString()}`
                        : '—')}
                </p>
                <p className="text-sm text-muted-foreground">per person</p>
              </div>
            </div>

            {/* Route Details */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Route Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Icon path={mdiMapMarker} size={0.83} className="text-green-600 dark:text-green-400" aria-hidden={true} />
                    </div>
                    <div>
                      <p className="font-semibold">Departure Port</p>
                      <p className="text-sm text-muted-foreground">{schedule?.departurePort ?? trip?.departurePort ?? schedules[0]?.departurePort ?? trip?.schedules?.[0]?.departurePort ?? '—'}</p>
                    </div>
                  </div>
                  <Icon path={mdiArrowRight} size={1} className="text-muted-foreground" aria-hidden={true} />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Icon path={mdiMapMarker} size={0.83} className="text-blue-600 dark:text-blue-400" aria-hidden={true} />
                    </div>
                    <div>
                      <p className="font-semibold">Arrival Port</p>
                      <p className="text-sm text-muted-foreground">{schedule?.arrivalPort ?? trip?.arrivalPort ?? schedules[0]?.arrivalPort ?? trip?.schedules?.[0]?.arrivalPort ?? '—'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Icon path={mdiClock} size={0.83} className="text-muted-foreground" aria-hidden={true} />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{Math.floor(trip.durationMinutes / 60)}h {trip.durationMinutes % 60}m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon path={mdiAccountGroup} size={0.83} className="text-muted-foreground" aria-hidden={true} />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="font-semibold">{trip.statistics.totalBookings}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>About This Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{trip.description}</p>
              {trip.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Highlights:</h4>
                  <ul className="space-y-2">
                    {trip.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Icon path={mdiCheckCircle} size={0.83} className="text-green-600 flex-shrink-0" aria-hidden={true} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vessel Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon path={mdiFerry} size={0.83} className="" aria-hidden={true} />
                Vessel Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-lg mb-1">{trip.vessel.name}</p>
                <p className="text-muted-foreground">Registration: {trip.vessel.registrationNo}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Icon path={mdiAccountGroup} size={0.83} className="text-muted-foreground" aria-hidden={true} />
                  <span>Capacity: {trip.vessel.capacity} passengers</span>
                </div>
              </div>

              {combinedAmenities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {combinedAmenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="glass-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon path={mdiCalendar} size={0.83} className="" aria-hidden={true} />
                  Select Schedule
                </CardTitle>
                <CardDescription>
                  Choose your preferred departure time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selector - Mock for now */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Travel Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getNextAvailableDate()}
                    className="w-full px-3 py-2 border rounded-md"
                  />

                  {/* Small week picker — highlights dates that have schedules */}
                  <div className="mt-3 grid grid-cols-7 gap-2">
                    {getNextNDates(7, new Date(selectedDate)).map((d) => {
                      const iso = d.toISOString().split('T')[0]
                      const has = Boolean(weekAvailability[iso] && weekAvailability[iso].length)
                      return (
                        <button
                          key={iso}
                          onClick={() => setSelectedDate(iso)}
                          className={`text-xs py-2 rounded-md ${selectedDate === iso ? 'ring-2 ring-accent-500 bg-accent-50' : has ? 'bg-success-600 text-white' : 'bg-muted'}`}
                          title={has ? `${weekAvailability[iso].length} schedule(s)` : 'No schedules'}
                        >
                          <div className="font-semibold">{d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0,3)}</div>
                          <div className="text-xs mt-1">{d.getDate()}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Schedule Options */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Departure Time</label>
                  <div className="space-y-2">
                    {schedulesLoading ? (
                      [1,2,3].map((n) => (
                        <div key={n} className="p-3 border rounded-lg animate-pulse bg-muted">
                          <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/4"></div>
                        </div>
                      ))
                    ) : (
                      schedules.map((schedule) => (
                        <ScheduleOption
                          key={schedule.id}
                          schedule={schedule}
                          isSelected={selectedSchedule === schedule.id}
                          onSelect={() => setSelectedSchedule(schedule.id)}
                        />
                      ))
                    )}
                  </div>
                  {!schedulesLoading && schedules.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No schedules available for this trip.
                    </p>
                  )}
                </div>

                {/* Price Summary (show/select price tiers) */}
                {schedule && schedule.priceTiers && schedule.priceTiers.length > 0 && (
                  <div className="pt-4 border-t space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Choose fare class</div>
                      <div className="grid grid-cols-1 gap-2">
                        {schedule.priceTiers.map((pt) => (
                          <button
                            key={pt.id}
                            onClick={() => setSelectedTierId(pt.id)}
                            className={cn(
                              'flex items-center justify-between p-3 rounded-lg border',
                              selectedTierId === pt.id ? 'ring-2 ring-accent-400 bg-accent-50' : 'hover:shadow-sm',
                            )}
                          >
                            <div className="text-left">
                              <div className="font-semibold">{pt.name}</div>
                              {pt.description && <div className="text-xs text-muted-foreground">{pt.description}</div>}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">₦{pt.price.toLocaleString()}</div>
                              {pt.capacity != null && <div className="text-xs text-muted-foreground">{pt.capacity} seats</div>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price per person</span>
                      <span className="font-semibold">₦{(schedule.priceTiers.find(pt => pt.id === selectedTierId)?.price ?? Math.min(...schedule.priceTiers.map(pt => pt.price))).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Available seats</span>
                      <span className="font-semibold">{schedule.availableSeats}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedSchedule}
                  onClick={handleBookNow}
                >
                  {!selectedSchedule ? 'Select a Schedule' : 'Book Now'}
                  <Icon path={mdiArrowRight} size={0.67} className="ml-2" aria-hidden={true} />
                </Button>
                <Alert>
                  <Icon path={mdiInformation} size={0.67} className="" aria-hidden={true} />
                  <AlertDescription className="text-xs">
                    Free cancellation up to 24 hours before departure
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScheduleOption({
  schedule,
  isSelected,
  onSelect,
}: {
  schedule: DetailedSchedule
  isSelected: boolean
  onSelect: () => void
}) {
  const isAvailable = schedule.status === 'scheduled' && schedule.availableSeats > 0
  const isSoldOut = schedule.availableSeats === 0
  const isCancelled = schedule.status === 'cancelled'

  const startTime = new Date(schedule.startTime)
  const endTime = new Date(schedule.endTime)

  return (
    <button
      onClick={onSelect}
      disabled={!isAvailable}
      className={cn(
        'w-full p-3 border rounded-lg text-left transition-all',
        isSelected && 'border-primary bg-primary/5',
        !isAvailable && 'opacity-50 cursor-not-allowed',
        isAvailable && !isSelected && 'hover:border-primary/50',
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="text-sm text-muted-foreground">{startTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          <div className="font-semibold">{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div className="text-sm text-muted-foreground text-right">
          <div>→</div>
          <div>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{schedule.availableSeats} seats left</span>
        {schedule.availableSeats < 10 && schedule.availableSeats > 0 && (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            Filling Fast
          </Badge>
        )}
        {isSoldOut && (
          <Badge variant="destructive">Sold Out</Badge>
        )}
        {isCancelled && (
          <Badge variant="secondary">Cancelled</Badge>
        )}
      </div>
      {schedule.priceTiers && schedule.priceTiers.length > 0 && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">From </span>
          <span className="font-semibold">₦{Math.min(...schedule.priceTiers.map(pt => pt.price)).toLocaleString()}</span>
        </div>
      )}
    </button>
  )
}

function getNextAvailableDate() {
  // Use today's date (UTC-based string) so the week picker starts from today
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().split('T')[0]
}

function getNextNDates(n: number, from?: Date) {
  const start = from ? new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())) : new Date()
  const dates: Date[] = []
  for (let i = 0; i < n; i++) {
    const d = new Date(start)
    d.setUTCDate(start.getUTCDate() + i)
    dates.push(d)
  }
  return dates
}
