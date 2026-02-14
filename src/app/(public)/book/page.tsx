
'use client'

import { motion } from 'framer-motion'
import Icon from '@mdi/react'
import { mdiArrowLeft, mdiClock, mdiGasStation, mdiMapMarker, mdiStar, mdiAccountGroup, mdiCheckCircle } from '@mdi/js'
import Image from 'next/image'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { mockTrips, getTripById, type MockTrip, type MockSchedule } from '@/src/lib/mock-data'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Badge } from '@/src/components/ui/badge'

function BookContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get params from URL (from trips detail page)
  const tripIdFromUrl = searchParams.get('trip')
  const scheduleIdFromUrl = searchParams.get('schedule')
  const dateFromUrl = searchParams.get('date')
  
  const [selectedTripData, setSelectedTripData] = useState<MockTrip | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<MockSchedule | null>(null)
  const [passengers, setPassengers] = useState(1)
  const [searchDate, setSearchDate] = useState(dateFromUrl || getNextAvailableDate())
  const [filteredTrips, setFilteredTrips] = useState(mockTrips)

  // Load trip and schedule from URL params
  useEffect(() => {
    if (tripIdFromUrl) {
      const trip = getTripById(tripIdFromUrl)
      if (trip) {
        setSelectedTripData(trip)
        
        // Also set the schedule if provided
        if (scheduleIdFromUrl) {
          const schedule = trip.schedules.find((s: MockSchedule) => s.id === scheduleIdFromUrl)
          if (schedule) {
            setSelectedSchedule(schedule)
          }
        }
      }
    }
  }, [tripIdFromUrl, scheduleIdFromUrl])

  useEffect(() => {
    // In a real app, this would filter based on actual data
    setFilteredTrips(mockTrips)
  }, [searchDate])

  function getNextAvailableDate(): string {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const handleSelectTrip = (trip: MockTrip) => {
    setSelectedTripData(trip)
    setSelectedSchedule(null) // Reset schedule when selecting new trip
  }

  const handleSelectSchedule = (schedule: MockSchedule) => {
    setSelectedSchedule(schedule)
  }

  const handleProceedToCheckout = () => {
    if (selectedTripData && selectedSchedule) {
      const query = new URLSearchParams({
        trip: selectedTripData.id,
        schedule: selectedSchedule.id,
        passengers: passengers.toString(),
        date: searchDate,
      }).toString()
      router.push(`/checkout?${query}`)
    }
  }

  const totalPrice = selectedSchedule ? selectedSchedule.price * passengers : 0
  const serviceFee = totalPrice * 0.05
  const grandTotal = totalPrice + serviceFee

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success'
      case 'filling-fast':
        return 'warning'
      case 'sold-out':
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <main className="min-h-screen bg-bg-900">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            className="mb-4 text-accent-500 flex items-center gap-2"
            onClick={() => router.push('/trips')}
          >
            <Icon path={mdiArrowLeft} size={0.6} aria-hidden={true} />
            Back to Trips
          </Button>
          <h1 className="text-4xl font-bold text-accent-500 mb-2">Book Your Journey</h1>
          <p className="text-lg text-fg-muted">
            {selectedTripData ? 'Select a schedule and complete your booking' : 'Browse and book from our available boat trips'}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-subtle rounded-2xl p-6 shadow-lg mb-8 border border-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Select Date"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              min={getNextAvailableDate()}
            />
            <Input
              label="Number of Passengers"
              type="number"
              value={String(passengers)}
              onChange={(e) => setPassengers(Math.max(1, Number(e.target.value)))}
              min="1"
              max="10"
            />
            <Button className="bg-gradient-to-r from-accent-600 to-accent-400 text-white font-semibold mt-6">
              Search
            </Button>
          </div>
        </motion.div>

        {/* Available Trips or Schedule Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trips List or Schedule Selector */}
          <div className="lg:col-span-2">
            {!selectedTripData ? (
              <>
                <h2 className="text-2xl font-bold text-accent-500 mb-6">
                  Available Trips ({filteredTrips.length})
                </h2>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredTrips.map((trip: MockTrip) => (
                    <motion.div
                      key={trip.id}
                      variants={itemVariants}
                      onClick={() => handleSelectTrip(trip)}
                      className="cursor-pointer transition-all duration-300 hover:shadow-lg"
                    >
                      <Card className="glass-card border border-border">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row h-full">
                            {/* Image */}
                            <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                              <Image
                                src={trip.images[0]}
                                alt={trip.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-accent-500 mb-2">
                                  {trip.name}
                                </h3>
                                <div className="space-y-3 mb-4">
                                  <div className="flex items-center gap-2 text-fg-muted">
                                    <Icon path={mdiMapMarker} size={0.6} className="text-accent-500" aria-hidden={true} />
                                    <span className="font-semibold">{trip.departure.location} → {trip.arrival.location}</span>
                                  </div>
                                  <div className="flex gap-6 text-sm text-fg-muted">
                                    <div className="flex items-center gap-1">
                                      <Icon path={mdiClock} size={0.6} className="text-accent-500" aria-hidden={true} />
                                      {trip.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Icon path={mdiAccountGroup} size={0.6} className="text-accent-500" aria-hidden={true} />
                                      {trip.vessel.capacity} seats
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {trip.vessel.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                                    <Badge key={idx} variant="outline" className="bg-accent-500/10 text-accent-500 border-accent-500">
                                      {amenity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Icon
                                        key={i}
                                        path={mdiStar}
                                        size={0.6}
                                        className={
                                          i < Math.floor(trip.rating)
                                            ? 'fill-accent-500 text-accent-500'
                                            : 'text-fg-dim'
                                        }
                                        aria-hidden={true}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-semibold text-fg">
                                    {trip.rating}
                                  </span>
                                </div>
                                <p className="text-sm text-fg-muted">
                                  From <span className="text-2xl font-bold text-accent-500">₦{Math.min(...trip.schedules.map((s: MockSchedule) => s.price)).toLocaleString()}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-accent-500">
                    Select Schedule
                  </h2>
                  <Button
                    variant="outline"
                    className="text-accent-500 border-accent-500"
                    onClick={() => {
                      setSelectedTripData(null)
                      setSelectedSchedule(null)
                    }}
                  >
                    Change Trip
                  </Button>
                </div>

                <Card className="mb-6 border border-border">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-accent-500 mb-2">{selectedTripData.name}</h3>
                    <div className="flex items-center gap-2 text-fg-muted mb-4">
                      <Icon path={mdiMapMarker} size={0.6} className="text-accent-500" aria-hidden={true} />
                      <span className="font-semibold">{selectedTripData.departure.location} → {selectedTripData.arrival.location}</span>
                    </div>
                    <p className="text-fg-muted">{selectedTripData.description}</p>
                  </CardContent>
                </Card>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {selectedTripData.schedules.map((schedule: MockSchedule) => (
                    <motion.div
                      key={schedule.id}
                      variants={itemVariants}
                      onClick={() => schedule.status === 'available' || schedule.status === 'filling-fast' ? handleSelectSchedule(schedule) : null}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedSchedule?.id === schedule.id
                          ? 'ring-2 ring-accent-500 shadow-lg'
                          : schedule.status === 'available' || schedule.status === 'filling-fast'
                          ? 'hover:shadow-lg'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Card className="border border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Icon path={mdiClock} size={0.8} className="text-accent-500" aria-hidden={true} />
                                <span className="font-bold text-lg">{schedule.departureTime}</span>
                                <span className="text-fg-muted">→</span>
                                <span className="font-semibold text-fg-muted">{schedule.arrivalTime}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <Badge
                                  variant="outline"
                                  className={`border ${getStatusColor(schedule.status) === 'success' ? 'border-success-500 text-success-500' : getStatusColor(schedule.status) === 'warning' ? 'border-warning-500 text-warning-500' : 'border-danger-500 text-danger-500'}`}
                                >
                                  {schedule.status.replace('-', ' ').toUpperCase()}
                                </Badge>
                                <span className="text-fg-muted">
                                  {schedule.availableSeats} seats available
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-accent-500">₦{schedule.price.toLocaleString()}</p>
                              <p className="text-xs text-fg-muted">per person</p>
                            </div>
                            {selectedSchedule?.id === schedule.id && (
                              <Icon path={mdiCheckCircle} size={1} className="text-accent-500 ml-4" aria-hidden={true} />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          {/* Booking Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-8"
            >
              {selectedTripData && selectedSchedule ? (
                <Card className="glass-subtle border-2 border-accent-500 shadow-lg">
                  <CardHeader className="flex flex-col items-start px-6 py-4 border-b border-border">
                    <h3 className="text-xl font-bold text-accent-500">Booking Summary</h3>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-fg-muted mb-1">Trip</p>
                      <p className="font-bold text-fg">{selectedTripData.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-fg-muted mb-1">Route</p>
                      <p className="font-semibold text-accent-500">
                        {selectedTripData.departure.location} → {selectedTripData.arrival.location}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-fg-muted mb-1">Date</p>
                      <p className="font-semibold text-fg">{new Date(searchDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    <div>
                      <p className="text-sm text-fg-muted mb-1">Time</p>
                      <p className="font-semibold text-fg">
                        {selectedSchedule.departureTime} - {selectedSchedule.arrivalTime}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-fg">Passengers</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPassengers(Math.max(1, passengers - 1))}
                          >
                            −
                          </Button>
                          <span className="w-8 text-center font-bold">{passengers}</span>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setPassengers(Math.min(selectedSchedule.availableSeats, passengers + 1))}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 pb-4 border-b border-border">
                        <div className="flex justify-between text-sm">
                          <span className="text-fg-muted">Price per person</span>
                          <span className="font-semibold">
                            ₦{selectedSchedule.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-fg-muted">Subtotal ({passengers}x)</span>
                          <span className="font-semibold">
                            ₦{totalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-fg-muted">Service Fee (5%)</span>
                          <span className="font-semibold">
                            ₦{Math.round(serviceFee).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <span className="font-bold text-lg text-accent-500">Total</span>
                        <span className="font-bold text-2xl text-accent-500">
                          ₦{Math.round(grandTotal).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleProceedToCheckout}
                      className="w-full bg-gradient-to-r from-accent-600 to-accent-400 text-white font-bold text-lg py-3"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full text-accent-500 border-accent-500"
                      onClick={() => setSelectedSchedule(null)}
                    >
                      Change Schedule
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-subtle border border-border">
                  <CardContent className="p-6 text-center">
                    <Icon path={mdiClock} size={2.67} className="text-accent-500/20 mx-auto mb-4" aria-hidden={true} />
                    <p className="text-fg-muted text-lg">
                      {selectedTripData ? 'Select a schedule to see booking details' : 'Select a trip to start booking'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Book() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookContent />
    </Suspense>
  )
}
