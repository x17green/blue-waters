'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockTrips, searchTrips, type MockTrip } from '@/lib/mock-data'
import Icon from '@mdi/react'
import { mdiClock, mdiMapMarker, mdiStar, mdiAccountGroup, mdiArrowRight, mdiMagnify } from '@mdi/js'

export default function TripsPage() {
  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'duration'>('popularity')

  // Get filtered and sorted trips
  const trips = useMemo(() => {
    let results = searchTrips({
      from: searchFrom,
      to: searchTo,
      maxPrice,
    })

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.basePrice - b.basePrice)
        break
      case 'price-high':
        results.sort((a, b) => b.basePrice - a.basePrice)
        break
      case 'duration':
        results.sort((a, b) => a.duration - b.duration)
        break
      case 'popularity':
      default:
        results.sort((a, b) => b.popularityScore - a.popularityScore)
    }

    return results
  }, [searchFrom, searchTo, maxPrice, sortBy])

  const handleClearFilters = () => {
    setSearchFrom('')
    setSearchTo('')
    setMaxPrice(undefined)
    setSortBy('popularity')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <Card className="glass-subtle mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon path={mdiMagnify} size={0.83} className="" aria-hidden={true} />
            Search Trips
          </CardTitle>
          <CardDescription>
            Filter trips by departure, destination, and price
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From */}
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                placeholder="e.g., Yenagoa"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
              />
            </div>

            {/* To */}
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                placeholder="e.g., Port Harcourt"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price (₦)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="e.g., 10000"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Label htmlFor="sortBy">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger id="sortBy" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Shortest Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={!searchFrom && !searchTo && !maxPrice && sortBy === 'popularity'}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          {trips.length} {trips.length === 1 ? 'trip' : 'trips'} found
        </p>
      </div>

      {/* Trip Grid */}
      {trips.length === 0 ? (
        <Card className="glass-subtle p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Icon path={mdiMagnify} size={1} className="text-muted-foreground" aria-hidden={true} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No trips found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search filters
          </p>
          <Button onClick={handleClearFilters} variant="outline">
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}

function TripCard({ trip }: { trip: MockTrip }) {
  const availableSchedules = trip.schedules.filter((s) => s.status !== 'sold-out' && s.status !== 'cancelled')
  const lowestPrice = Math.min(...trip.schedules.map((s) => s.price))
  const hasFillingFast = trip.schedules.some((s) => s.status === 'filling-fast')

  return (
    <Card className="glass-card overflow-hidden hover:glass-hover transition-all">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-cyan-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-6xl opacity-20">🚢</span>
        </div>
        {hasFillingFast && (
          <Badge className="absolute top-4 right-4 bg-orange-500">
            Filling Fast
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{trip.name}</CardTitle>
        <CardDescription className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Icon path={mdiMapMarker} size={0.67} className="" aria-hidden={true} />
            <span>
              {trip.departure.location} → {trip.arrival.location}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon path={mdiClock} size={0.67} className="" aria-hidden={true} />
            <span>{trip.duration} minutes • {trip.distance} km</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Icon path={mdiStar} size={0.67} className="fill-yellow-400 text-yellow-400" aria-hidden={true} />
            <span className="font-semibold">{trip.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({trip.reviewCount} reviews)
          </span>
        </div>

        {/* Vessel Info */}
        <div className="flex items-center gap-2 text-sm">
          <Icon path={mdiAccountGroup} size={0.67} className="text-muted-foreground" aria-hidden={true} />
          <span className="text-muted-foreground">
            {trip.vessel.name} • {trip.vessel.capacity} seats
          </span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1">
          {trip.vessel.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {trip.vessel.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{trip.vessel.amenities.length - 3} more
            </Badge>
          )}
        </div>

        {/* Price and Availability */}
        <div className="pt-4 border-t">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold">₦{lowestPrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">per person</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {availableSchedules.length} schedule{availableSchedules.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/trips/${trip.id}`}>
            View Details
            <Icon path={mdiArrowRight} size={0.67} className="ml-2" aria-hidden={true} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
