'use client'

import { type User } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Bookmark, Calendar, LogOut, MapPin, Ship, User as UserIcon } from 'lucide-react'
import Link from 'next/link'

import { signOut } from '@/src/app/auth/actions'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

interface Booking {
  id: string
  bookingReference: string
  numberOfPassengers: number
  totalAmount: number
  bookingStatus: string
  createdAt: string
  trip?: {
    name: string
    description?: string
    vessel?: {
      name: string
      vesselClass: string
    }
    schedule?: {
      departureTime: string
    }
  }
}

interface DashboardClientProps {
  user: User
  bookings: Booking[]
}

export default function DashboardClient({ user, bookings }: DashboardClientProps) {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold">⛵</span>
              </div>
              <span className="font-bold text-xl text-primary">Blue Waters</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-foreground/60">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'Traveler'}!
            </h1>
            <p className="text-foreground/60">Manage your bookings and explore new destinations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Bookmark className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
                <p className="text-xs text-muted-foreground">All time bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
                <Ship className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length}
                </div>
                <p className="text-xs text-muted-foreground">Confirmed bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <UserIcon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">Member since {new Date(user.created_at || '').toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Your latest trip reservations</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Ship className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                  <p className="text-foreground/60 mb-4">No bookings yet</p>
                  <Link href="/search">
                    <Button>Browse Available Trips</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {booking.trip?.name || 'Trip Name'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-foreground/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {booking.trip?.vessel?.name || 'Vessel'}
                          </span>
                          <span>{booking.numberOfPassengers} passengers</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary mb-1">
                          ₦{(Number(booking.totalAmount) / 100).toLocaleString()}
                        </div>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            booking.bookingStatus === 'CONFIRMED'
                              ? 'bg-green-100 text-green-700'
                              : booking.bookingStatus === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle>Book a New Trip</CardTitle>
                <CardDescription>Explore destinations and reserve your journey</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/search">
                  <Button className="w-full">Browse Trips</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/20 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
