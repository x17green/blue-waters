'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Icon } from '@/src/components/ui/icon'
import { mdiCurrencyUsd, mdiLogout, mdiMapMarker, mdiFerry, mdiTrendingUp, mdiAccountGroup, mdiLoading, mdiAlertCircle, mdiRefresh } from '@mdi/js'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Badge } from '@/src/components/ui/badge'
import { ProfileCompletionModal } from '@/src/components/operator'
import { cn } from '@/src/lib/utils'

// API Response Types
interface ApiDashboardData {
  operator: {
    id: string
    name: string
    verified: boolean
    rating: number
    totalTrips: number
    activeTrips: number
    totalBookings: number
    monthlyRevenue: number
    lastMonthRevenue: number
    upcomingSchedules: number
  } | null
  revenueData: Array<{
    month: string
    revenue: number
  }>
  bookingsData: Array<{
    month: string
    bookings: number
  }>
  weeklyBookings: Array<{
    day: string
    bookings: number
  }>
  upcomingTrips: Array<{
    id: string
    name: string
    departure: string
    route: string
    passengers: number
    capacity: number
    status: string
    revenue: number
  }>
  recentBookings: Array<{
    id: string
    passengerName: string
    tripName: string
    amount: number
    status: string
    createdAt: string
  }>
  profileIncomplete?: boolean
}

export default function OperatorDashboard() {
  const [dashboardData, setDashboardData] = useState<ApiDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileForm, setProfileForm] = useState({
    organizationName: '',
    contactEmail: '',
    contactPhone: ''
  })
  const [savingProfile, setSavingProfile] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/operator/dashboard')

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data: ApiDashboardData = await response.json()
      setDashboardData(data)

      // Check if profile is incomplete and show modal
      if (data.profileIncomplete) {
        setShowProfileModal(true)
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  const handleSaveProfile = async () => {
    if (!profileForm.organizationName.trim()) {
      setError('Organization name is required')
      return
    }

    setSavingProfile(true)
    try {
      const response = await fetch('/api/operator/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setShowProfileModal(false)
      setError(null)
      // Refresh dashboard data
      await fetchDashboardData()
    } catch (err) {
      console.error('Error saving profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSavingProfile(false)
    }
  }


  let mainContent = null;
  if (isLoading) {
    mainContent = (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <Icon path={mdiLoading} size={2} className="animate-spin text-accent-500 mx-auto mb-4" />
          <p className="text-fg-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  } else if (error || !dashboardData) {
    mainContent = (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Card className="glass border border-border-default max-w-md">
          <CardContent className="text-center py-8">
            <Icon path={mdiAlertCircle} size={2} className="text-error-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-fg mb-2">Failed to load dashboard</h3>
            <p className="text-fg-muted mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <Icon path={mdiRefresh} size={0.6} className="mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  } else if (dashboardData && !dashboardData.operator) {
    mainContent = (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Card className="glass border border-border-default max-w-md">
          <CardContent className="text-center py-8">
            <Icon path={mdiAccountGroup} size={2} className="text-accent-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-fg mb-2">Welcome to Your Dashboard</h3>
            <p className="text-fg-muted mb-4">
              Please complete your operator profile to start managing your boat trips.
            </p>
            <Button onClick={() => setShowProfileModal(true)} className="bg-accent-600 hover:bg-accent-500 text-white">
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only destructure if dashboardData and operator exist
  let operator, revenueData, bookingsData, weeklyBookings, upcomingTrips, recentBookings;
  if (dashboardData && dashboardData.operator) {
    ({ operator, revenueData, bookingsData, weeklyBookings, upcomingTrips, recentBookings } = dashboardData);
  }

  // Calculate revenue change percentage only if operator exists
  let revenueChange = 0;
  if (operator) {
    revenueChange = operator.lastMonthRevenue > 0
      ? ((operator.monthlyRevenue - operator.lastMonthRevenue) / operator.lastMonthRevenue) * 100
      : 0;
  }
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // In a real app, fetch user data
    setUser({ email: 'operator@bluewaters.com' })
  }, [])

  const handleLogout = async () => {
    window.location.href = '/'
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <>
      {mainContent ? (
        <>
          {mainContent}
          <ProfileCompletionModal
            open={showProfileModal}
            onOpenChange={setShowProfileModal}
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            onSave={handleSaveProfile}
            saving={savingProfile}
            error={error}
          />
        </>
      ) : (
        <main className="min-h-screen bg-bg-primary">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-fg mb-2">
                    {operator?.name || 'Your Dashboard'}
                  </h1>
                  <p className="text-lg text-fg-muted">
                    Manage your boats, trips, and earnings
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge className={cn(
                      'text-xs',
                      operator?.verified ? 'bg-success-500/10 text-success-500 border-success-500/20' : 'bg-warning-500/10 text-warning-500 border-warning-500/20'
                    )}>
                      {operator?.verified ? 'Verified' : 'Unverified'}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Icon path={mdiTrendingUp} size={0.6} className="text-accent-500" />
                      <span className="text-sm text-fg-muted">{operator?.rating.toFixed(1)} rating</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline"
                  className="glass-subtle border border-border-default"
                >
                  <Icon path={refreshing ? mdiLoading : mdiRefresh} size={0.6} className={cn('mr-2', refreshing && 'animate-spin')} />
                  Refresh
                </Button>
              </div>
            </motion.div>

            {/* KPI Cards - All metrics restored */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {/* Total Trips */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-fg-muted text-sm mb-2">Total Trips</p>
                        <p className="text-4xl font-bold text-accent-400">
                          {operator?.totalTrips}
                        </p>
                        <p className="text-xs text-fg-subtle mt-1">
                          {operator?.activeTrips} active
                        </p>
                      </div>
                      <Icon path={mdiFerry} size={1.33} className="text-accent-500/50" aria-hidden={true} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Monthly Revenue */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-fg-muted text-sm mb-2">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-success-500">
                          ₦{((operator?.monthlyRevenue ?? 0) / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-fg-subtle mt-1 flex items-center gap-1">
                          <Icon path={mdiTrendingUp} size={0.5} className={cn(
                            revenueChange >= 0 ? 'text-success-500' : 'text-error-500'
                          )} />
                          {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}% from last month
                        </p>
                      </div>
                      <Icon path={mdiCurrencyUsd} size={1.33} className="text-success-500/50" aria-hidden={true} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Total Bookings */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-fg-muted text-sm mb-2">Total Bookings</p>
                        <p className="text-4xl font-bold text-info-500">
                          {operator?.totalBookings}
                        </p>
                        <p className="text-xs text-fg-subtle mt-1">
                          {operator?.upcomingSchedules} upcoming schedules
                        </p>
                      </div>
                      <Icon path={mdiAccountGroup} size={1.33} className="text-info-500/50" aria-hidden={true} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Rating */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-fg-muted text-sm mb-2">Rating</p>
                        <p className="text-4xl font-bold text-warning-500">
                          {operator?.rating?.toFixed(1) ?? 'N/A'}
                        </p>
                        <p className="text-xs text-fg-subtle mt-1">
                          ⭐ out of 5.0
                        </p>
                      </div>
                      <Icon path={mdiTrendingUp} size={1.33} className="text-warning-500/50" aria-hidden={true} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            {/* Charts and Trips */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-2"
              >
                <Card className="glass-card">
                  <CardHeader className="border-b border-border-subtle">
                    <CardTitle className="text-fg">Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border-subtle" />
                        <XAxis dataKey="month" className="stroke-fg-muted text-xs" />
                        <YAxis className="stroke-fg-muted text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--accent-500))"
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--accent-500))', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Weekly Bookings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-card border border-primary/10">
                  <CardHeader className="border-b border-primary/10">
                    <h2 className="text-xl font-bold text-primary">Weekly Bookings</h2>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dashboardData?.weeklyBookings || []}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis
                          dataKey="day"
                          className="stroke-fg-muted"
                          tick={{ fill: 'hsl(var(--foreground-muted))' }}
                        />
                        <YAxis
                          className="stroke-fg-muted"
                          tick={{ fill: 'hsl(var(--foreground-muted))' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                        <Bar
                          dataKey="bookings"
                          className="fill-accent-500"
                          radius={[8, 8, 0, 0]}
                          fill="hsl(var(--accent-500))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Upcoming Trips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass-card border border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10">
                  <h2 className="text-2xl font-bold text-primary">Upcoming Trips</h2>
                  <Button
                    href="/operator/trips/new"
                    className="bg-accent text-white font-semibold hover:bg-accent/90"
                  >
                    Create Trip
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {dashboardData?.upcomingTrips?.length ? (
                      dashboardData.upcomingTrips.map((trip, idx) => (
                        <motion.div
                          key={trip.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="glass-subtle p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-primary text-lg mb-2">
                                {trip.name}
                              </h3>
                              <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                                <span className="flex items-center gap-1">
                                  <Icon path={mdiMapMarker} size={0.6} aria-hidden={true} />
                                  {trip.route}
                                </span>
                                <span>{trip.departure}</span>
                                <span>
                                  {trip.passengers}/{trip.capacity} passengers
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col md:text-right gap-2">
                              <p className="text-lg font-bold text-accent">
                                ₦{trip.revenue.toLocaleString()}
                              </p>
                              <span
                                className={`text-xs font-semibold w-fit md:ml-auto px-3 py-1 rounded-full ${
                                  trip.status === 'ongoing'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-foreground/60">
                        <p>No upcoming trips scheduled</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Completion Modal always mounted */}
            <ProfileCompletionModal
              open={showProfileModal}
              onOpenChange={setShowProfileModal}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              onSave={handleSaveProfile}
              saving={savingProfile}
              error={error}
            />
          </div>
        </main>
      )}
    </>
  );
//                     <p className="text-fg-muted text-sm mb-2">Monthly Revenue</p>
//                     <p className="text-2xl font-bold text-success-500">
//                       ₦{(operator.monthlyRevenue / 1000).toFixed(0)}K
//                     </p>
//                     <p className="text-xs text-fg-subtle mt-1 flex items-center gap-1">
//                       <Icon path={mdiTrendingUp} size={0.5} className={cn(
//                         revenueChange >= 0 ? 'text-success-500' : 'text-error-500'
//                       )} />
//                       {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}% from last month
//                     </p>
//                   </div>
//                   <Icon path={mdiCurrencyUsd} size={1.33} className="text-success-500/50" aria-hidden={true} />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           <motion.div variants={itemVariants}>
//             <Card className="glass-card">
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="text-fg-muted text-sm mb-2">Total Bookings</p>
//                     <p className="text-4xl font-bold text-info-500">
//                       {operator.totalBookings}
//                     </p>
//                     <p className="text-xs text-fg-subtle mt-1">
//                       {operator.upcomingSchedules} upcoming schedules
//                     </p>
//                   </div>
//                   <Icon path={mdiAccountGroup} size={1.33} className="text-info-500/50" aria-hidden={true} />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           <motion.div variants={itemVariants}>
//             <Card className="glass-card">
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="text-fg-muted text-sm mb-2">Rating</p>
//                     <p className="text-4xl font-bold text-warning-500">
//                       {operator.rating.toFixed(1)}
//                     </p>
//                     <p className="text-xs text-fg-subtle mt-1">
//                       ⭐ out of 5.0
//                     </p>
//                   </div>
//                   <Icon path={mdiTrendingUp} size={1.33} className="text-warning-500/50" aria-hidden={true} />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </motion.div>

//         {/* Charts and Trips */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//           {/* Revenue Chart */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="lg:col-span-2"
//           >
//             <Card className="glass-card">
//               <CardHeader className="border-b border-border-subtle">
//                 <CardTitle className="text-fg">Revenue Trend</CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={revenueData}>
//                     <CartesianGrid strokeDasharray="3 3" className="stroke-border-subtle" />
//                     <XAxis dataKey="month" className="stroke-fg-muted text-xs" />
//                     <YAxis className="stroke-fg-muted text-xs" />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                         border: '1px solid rgba(255, 255, 255, 0.1)',
//                         borderRadius: '8px',
//                         color: 'white'
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="revenue"
//                       stroke="hsl(var(--accent-500))"
//                       strokeWidth={2}
//                       dot={{ fill: 'hsl(var(--accent-500))', r: 4 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Monthly Bookings */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <Card className="glass-card border border-primary/10">
//               <CardHeader className="border-b border-primary/10">
//                 <h2 className="text-xl font-bold text-primary">Weekly Bookings</h2>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={dashboardData?.weeklyBookings || []}>
//                     <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                     <XAxis
//                       dataKey="day"
//                       className="stroke-fg-muted"
//                       tick={{ fill: 'hsl(var(--foreground-muted))' }}
//                     />
//                     <YAxis
//                       className="stroke-fg-muted"
//                       tick={{ fill: 'hsl(var(--foreground-muted))' }}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: 'hsl(var(--background))',
//                         border: '1px solid hsl(var(--border))',
//                         borderRadius: '8px',
//                         color: 'hsl(var(--foreground))'
//                       }}
//                     />
//                     <Bar
//                       dataKey="bookings"
//                       className="fill-accent-500"
//                       radius={[8, 8, 0, 0]}
//                       fill="hsl(var(--accent-500))"
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>

//         {/* Upcoming Trips */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//         >
//           <Card className="glass-card border border-primary/10">
//             <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10">
//               <h2 className="text-2xl font-bold text-primary">Upcoming Trips</h2>
//               <Button
//                 href="/operator/trips/new"
//                 className="bg-accent text-white font-semibold hover:bg-accent/90"
//               >
//                 Create Trip
//               </Button>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 {dashboardData?.upcomingTrips?.length ? (
//                   dashboardData.upcomingTrips.map((trip, idx) => (
//                     <motion.div
//                       key={trip.id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.5, delay: idx * 0.1 }}
//                       className="glass-subtle p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors"
//                     >
//                       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-primary text-lg mb-2">
//                             {trip.name}
//                           </h3>
//                           <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
//                             <span className="flex items-center gap-1">
//                               <Icon path={mdiMapMarker} size={0.6} aria-hidden={true} />
//                               {trip.route}
//                             </span>
//                             <span>{trip.departure}</span>
//                             <span>
//                               {trip.passengers}/{trip.capacity} passengers
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex flex-col md:text-right gap-2">
//                           <p className="text-lg font-bold text-accent">
//                             ₦{trip.revenue.toLocaleString()}
//                           </p>
//                           <span
//                             className={`text-xs font-semibold w-fit md:ml-auto px-3 py-1 rounded-full ${
//                               trip.status === 'ongoing'
//                                 ? 'bg-green-100 text-green-700'
//                                 : 'bg-blue-100 text-blue-700'
//                             }`}
//                           >
//                             {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
//                           </span>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8 text-foreground/60">
//                     <p>No upcoming trips scheduled</p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Profile Completion Modal */}
//       <ProfileCompletionModal
//         open={showProfileModal}
//         onOpenChange={setShowProfileModal}
//         profileForm={profileForm}
//         setProfileForm={setProfileForm}
//         onSave={handleSaveProfile}
//         saving={savingProfile}
//         error={error}
//       />
//     </main>
//   )
}
