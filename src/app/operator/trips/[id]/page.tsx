'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Icon from '@mdi/react'
import {
  mdiArrowLeft,
  mdiContentSave,
  mdiDelete,
  mdiFerry,
  mdiMapMarker,
  mdiClockOutline,
  mdiCurrencyUsd,
  mdiInformation,
  mdiImage,
  mdiAlert,
  mdiCalendar,
  mdiOfficeBuilding,
  mdiRoadVariant,
} from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { mockTrips, mockVessels, type MockTrip } from '@/src/lib/mock-data'

/**
 * Edit Trip Page
 * Allows operators to modify existing trip details
 * 
 * Design System: Glassmorphism with form validation
 * Referenced: /operator/trips/[id] in route structure
 */
export default function EditTripPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [trip, setTrip] = useState<MockTrip | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load trip data
  useEffect(() => {
    const foundTrip = mockTrips.find((t) => t.id === params.id)
    if (foundTrip) {
      setTrip({ ...foundTrip })
    }
  }, [params.id])

  // Form handlers
  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    // TODO: Replace with actual API call
    console.log('Saving trip:', trip)
    router.push('/operator/trips')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return
    }
    // TODO: Implement delete API call
    console.log('Deleting trip:', params.id)
    router.push('/operator/trips')
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-subtle rounded-lg p-12 text-center">
          <Icon path={mdiAlert} size={2} className="mx-auto mb-4 text-warning-400" />
          <h2 className="text-xl font-semibold text-fg mb-2">Trip not found</h2>
          <p className="text-fg-muted mb-6">The trip you're looking for doesn't exist.</p>
          <Link href="/operator/trips">
            <Button variant="outline">
              <Icon path={mdiArrowLeft} size={0.6} className="mr-2" />
              Back to Trips
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
            href="/operator/trips"
            className="inline-flex items-center gap-2 text-fg-muted hover:text-fg transition-colors mb-2"
          >
            <Icon path={mdiArrowLeft} size={0.7} />
            <span className="text-sm">Back to Trips</span>
          </Link>
          <h1 className="text-3xl font-bold text-fg">Edit Trip</h1>
          <p className="text-fg-muted">Modify trip details and settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDelete} className="border-danger-500/30 text-danger-400 hover:bg-danger-500/10">
            <Icon path={mdiDelete} size={0.6} className="mr-2" />
            Delete Trip
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Icon path={mdiContentSave} size={0.6} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>

      {/* Trip Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="glass-subtle rounded-lg p-4 flex items-center gap-4">
          <Icon path={mdiInformation} size={1} className="text-accent-400" />
          <div className="flex-1">
            <h3 className="font-semibold text-fg">Trip Status</h3>
            <p className="text-sm text-fg-muted">
              This trip has {trip.schedules.length} active schedules and is currently accepting bookings.
            </p>
          </div>
          <Badge className="bg-success-500/10 text-success-400 border-0">Active</Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Basic Information */}
          <div className="glass-subtle rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
              <Icon path={mdiFerry} size={0.8} className="text-accent-400" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="tripName">Trip Name</Label>
                <Input
                  id="tripName"
                  value={trip.name}
                  onChange={(e) => setTrip({ ...trip, name: e.target.value })}
                  placeholder="e.g., Yenagoa to Port Harcourt Express"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={trip.slug}
                  onChange={(e) => setTrip({ ...trip, slug: e.target.value })}
                  placeholder="e.g., yenagoa-port-harcourt"
                />
                <p className="text-xs text-fg-muted mt-1">
                  Used in the URL: /trips/{trip.slug}
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={trip.description}
                  onChange={(e) => setTrip({ ...trip, description: e.target.value })}
                  placeholder="Describe the trip experience..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="glass-subtle rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
              <Icon path={mdiMapMarker} size={0.8} className="text-accent-400" />
              Route Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Departure */}
              <div className="space-y-3 p-4 rounded-lg bg-accent-500/5 border border-accent-500/20">
                <h3 className="font-medium text-fg flex items-center gap-2">
                  <Icon path={mdiOfficeBuilding} size={0.6} />
                  Departure
                </h3>
                <div>
                  <Label htmlFor="depLocation">Location</Label>
                  <Input
                    id="depLocation"
                    value={trip.departure.location}
                    onChange={(e) =>
                      setTrip({
                        ...trip,
                        departure: { ...trip.departure, location: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="depJetty">Jetty/Terminal</Label>
                  <Input
                    id="depJetty"
                    value={trip.departure.jetty}
                    onChange={(e) =>
                      setTrip({
                        ...trip,
                        departure: { ...trip.departure, jetty: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              {/* Arrival */}
              <div className="space-y-3 p-4 rounded-lg bg-success-500/5 border border-success-500/20">
                <h3 className="font-medium text-fg flex items-center gap-2">
                  <Icon path={mdiMapMarker} size={0.6} />
                  Arrival
                </h3>
                <div>
                  <Label htmlFor="arrLocation">Location</Label>
                  <Input
                    id="arrLocation"
                    value={trip.arrival.location}
                    onChange={(e) =>
                      setTrip({
                        ...trip,
                        arrival: { ...trip.arrival, location: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="arrJetty">Jetty/Terminal</Label>
                  <Input
                    id="arrJetty"
                    value={trip.arrival.jetty}
                    onChange={(e) =>
                      setTrip({
                        ...trip,
                        arrival: { ...trip.arrival, jetty: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={trip.duration}
                  onChange={(e) => setTrip({ ...trip, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  value={trip.distance}
                  onChange={(e) => setTrip({ ...trip, distance: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="glass-subtle rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
              <Icon path={mdiCurrencyUsd} size={0.8} className="text-accent-400" />
              Pricing
            </h2>

            <div>
              <Label htmlFor="basePrice">Base Price (₦)</Label>
              <Input
                id="basePrice"
                type="number"
                value={trip.basePrice}
                onChange={(e) => setTrip({ ...trip, basePrice: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-fg-muted mt-1">
                Starting price per passenger. Actual price may vary by schedule.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="glass-subtle rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
              <Icon path={mdiInformation} size={0.8} className="text-accent-400" />
              Highlights
            </h2>

            <div className="space-y-2">
              {trip.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => {
                      const newHighlights = [...trip.highlights]
                      newHighlights[index] = e.target.value
                      setTrip({ ...trip, highlights: newHighlights })
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newHighlights = trip.highlights.filter((_, i) => i !== index)
                      setTrip({ ...trip, highlights: newHighlights })
                    }}
                  >
                    <Icon path={mdiDelete} size={0.6} className="text-danger-400" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTrip({ ...trip, highlights: [...trip.highlights, 'New highlight'] })
                }}
              >
                Add Highlight
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Vessel Assignment */}
          <div className="glass-subtle rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-fg">Assigned Vessel</h2>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-accent-500/5 border border-accent-500/20">
                <p className="font-medium text-fg">{trip.vessel.name}</p>
                <p className="text-sm text-fg-muted capitalize">{trip.vessel.type}</p>
                <p className="text-xs text-fg-muted mt-1">
                  Capacity: {trip.vessel.capacity} passengers
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Change Vessel
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-subtle rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-fg">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-muted flex items-center gap-2">
                  <Icon path={mdiCalendar} size={0.6} />
                  Active Schedules
                </span>
                <span className="font-semibold text-fg">{trip.schedules.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-muted">Rating</span>
                <span className="font-semibold text-fg">{trip.rating}/5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-muted">Reviews</span>
                <span className="font-semibold text-fg">{trip.reviewCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-subtle rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-semibold text-fg">Quick Actions</h2>
            <Link href={`/operator/trips/${trip.id}/schedules`} className="block">
              <Button variant="outline" className="w-full">
                <Icon path={mdiCalendar} size={0.6} className="mr-2" />
                Manage Schedules
              </Button>
            </Link>
            <Link href={`/trips/${trip.id}`} className="block">
              <Button variant="outline" className="w-full">
                <Icon path={mdiRoadVariant} size={0.6} className="mr-2" />
                View Public Page
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
