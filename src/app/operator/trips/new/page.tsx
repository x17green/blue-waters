/**
 * Create New Trip Form Page
 * 
 * Allows operators to create new boat trips with details, pricing tiers, and initial schedules
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Icon } from '@/src/components/ui/icon'
import { mdiChevronLeft, mdiPlus, mdiClose, mdiContentSave, mdiFerry, mdiMapMarker, mdiClock, mdiCurrencyUsd } from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'

import { Textarea } from '@/src/components/ui/textarea'
import { Label } from '@/src/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Badge } from '@/src/components/ui/badge'
import { useAuth } from '@/src/hooks/use-auth'
import { useToast } from '@/src/hooks/use-toast'
import { mockVessels } from '@/lib/mock-data'

const tripSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  vesselId: z.string().min(1, 'Please select a vessel'),
  routeId: z.string().optional(),
  durationMinutes: z.number().int().min(15).max(1440),
  category: z.enum(['tour', 'transport', 'charter', 'event']),
  amenities: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  // Trip-level route fields
  departurePort: z.string().min(2).optional(),
  arrivalPort: z.string().min(2).optional(),
  routeName: z.string().max(200).optional(),
})

type TripFormValues = z.infer<typeof tripSchema>

export default function CreateTripPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vessels, setVessels] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [highlights, setHighlights] = useState<string[]>([])
  const [newAmenity, setNewAmenity] = useState('')
  const [newHighlight, setNewHighlight] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      category: 'tour',
      durationMinutes: 60,
      amenities: [],
      highlights: [],
    },
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchVesselsAndRoutes()
    }
  }, [user, loading, router])

  const fetchVesselsAndRoutes = async () => {
    try {
      // TODO: Fetch actual vessels and routes from API
      // For now, use mock data from src/lib/mock-data
      setVessels(mockVessels);

      setRoutes([
        { id: '1', name: 'Yenagoa - Kaiama', startLocation: 'Yenagoa', endLocation: 'Kaiama' },
        { id: '2', name: 'Yenagoa - Nembe', startLocation: 'Yenagoa', endLocation: 'Nembe' },
        { id: '3', name: 'Yenagoa - Brass', startLocation: 'Yenagoa', endLocation: 'Brass' },
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      const updated = [...amenities, newAmenity.trim()]
      setAmenities(updated)
      setValue('amenities', updated)
      setNewAmenity('')
    }
  }

  const handleRemoveAmenity = (index: number) => {
    const updated = amenities.filter((_, i) => i !== index)
    setAmenities(updated)
    setValue('amenities', updated)
  }

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      const updated = [...highlights, newHighlight.trim()]
      setHighlights(updated)
      setValue('highlights', updated)
      setNewHighlight('')
    }
  }

  const handleRemoveHighlight = (index: number) => {
    const updated = highlights.filter((_, i) => i !== index)
    setHighlights(updated)
    setValue('highlights', updated)
  }

  const onSubmit = async (data: TripFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amenities,
          highlights,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create trip')
      }

      const result = await response.json()

      toast({
        title: 'Success!',
        description: 'Trip created successfully. Now add schedules and pricing.',
      })

      router.push(`/operator/trips/${result.trip.id}/schedules`)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create trip',
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/operator/trips">
          <Button variant="ghost" className="gap-2 mb-4">
            <Icon path={mdiChevronLeft} size={0.6} aria-hidden={true} />
            Back to Trips
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Trip</h1>
        <p className="text-muted-foreground mt-1">
          Add a new boat trip to your offerings
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about your trip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Sunset Bay Tour"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your trip experience, what passengers can expect..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  onValueChange={(value) => setValue('category', value as any)}
                  defaultValue="tour"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tour">Tour</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="charter">Charter</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  placeholder="60"
                  {...register('durationMinutes', { valueAsNumber: true })}
                />
                {errors.durationMinutes && (
                  <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vessel & Route */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon path={mdiFerry} size={0.8} aria-hidden={true} />
              Vessel & Route
            </CardTitle>
            <CardDescription>
              Select the vessel and optional predefined route
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vesselId">Vessel *</Label>
              <Select onValueChange={(value) => setValue('vesselId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vessel" />
                </SelectTrigger>
                <SelectContent>
                  {vessels.map((vessel) => (
                    <SelectItem key={vessel.id} value={vessel.id}>
                      {vessel.name} - {vessel.type} (Capacity: {vessel.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vesselId && (
                <p className="text-sm text-destructive">{errors.vesselId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="routeId">Route (Optional)</Label>
              <Select onValueChange={(value) => setValue('routeId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a predefined route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div>
                  <Label htmlFor="routeName">Route name</Label>
                  <Input id="routeName" placeholder="e.g., Yenagoa → Brass" {...register('routeName')} />
                </div>
                <div>
                  <Label htmlFor="departurePort">Departure port</Label>
                  <Input id="departurePort" placeholder="Yenagoa" {...register('departurePort')} />
                </div>
                <div>
                  <Label htmlFor="arrivalPort">Arrival port</Label>
                  <Input id="arrivalPort" placeholder="Brass" {...register('arrivalPort')} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>
              What facilities and services are available on this trip?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., WiFi, Life Jackets, Refreshments"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
              />
              <Button type="button" onClick={handleAddAmenity} variant="outline">
                <Icon path={mdiPlus} size={0.6} aria-hidden={true} />
              </Button>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="hover:text-destructive"
                    >
                      <Icon path={mdiClose} size={0.5} aria-hidden={true} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Highlights</CardTitle>
            <CardDescription>
              Key attractions or features of this trip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Scenic waterfall view, Wildlife spotting"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
              />
              <Button type="button" onClick={handleAddHighlight} variant="outline">
                <Icon path={mdiPlus} size={0.6} aria-hidden={true} />
              </Button>
            </div>
            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    {highlight}
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(index)}
                      className="hover:text-destructive"
                    >
                      <Icon path={mdiClose} size={0.5} aria-hidden={true} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/operator/trips">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Icon path={mdiContentSave} size={0.6} aria-hidden={true} />
            {isSubmitting ? 'Creating...' : 'Create Trip'}
          </Button>
        </div>
      </form>
    </div>
  )
}
