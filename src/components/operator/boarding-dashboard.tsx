'use client'

/**
 * Boarding Dashboard for Operators
 * Shows real-time check-in status and passenger management
 */

import { useState, useEffect, useCallback } from 'react'
import { QRScanner } from './qr-scanner'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Progress } from '@/src/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table'
import {
  Users,
  UserCheck,
  UserX,
  Ship,
  Clock,
  RefreshCw,
  Download,
} from 'lucide-react'

interface CheckinData {
  id: string
  checkedInAt: string
  method: string
  passenger: {
    id: string
    fullName: string
    email: string | null
    phone: string | null
  }
  booking: {
    bookingReference: string | null
    status: string
  }
  checkedInBy: {
    id: string
    fullName: string | null
    email: string | null
  } | null
}

interface CheckinStats {
  checkins: CheckinData[]
  stats: {
    checkedIn: number
    totalPassengers: number
    remaining: number
  }
}

interface BoardingDashboardProps {
  tripId: string
  scheduleId: string
}

export function BoardingDashboard({
  tripId,
  scheduleId,
}: BoardingDashboardProps) {
  const [stats, setStats] = useState<CheckinStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch check-in statistics
  const fetchStats = useCallback(async () => {
    try {
      setRefreshing(true)
      const response = await fetch(
        `/api/trips/${tripId}/schedules/${scheduleId}/checkin`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch check-in data')
      }

      const data: CheckinStats = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [tripId, scheduleId])

  // Initial fetch
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  // Handle successful check-in
  const handleCheckinComplete = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  // Download manifest
  const handleDownloadManifest = async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(
        `/api/trips/${tripId}/schedules/${scheduleId}/manifest?format=${format}`
      )

      if (!response.ok) {
        throw new Error('Failed to generate manifest')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `manifest-${scheduleId}-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading manifest:', err)
      alert('Failed to download manifest')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchStats}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  const completionPercentage = stats
    ? (stats.stats.checkedIn / stats.stats.totalPassengers) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Passengers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats.totalPassengers || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.stats.checkedIn || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.stats.remaining || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completionPercentage.toFixed(0)}%
            </div>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={fetchStats}
          variant="outline"
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
        <Button
          onClick={() => handleDownloadManifest('pdf')}
          variant="outline"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF Manifest
        </Button>
        <Button
          onClick={() => handleDownloadManifest('csv')}
          variant="outline"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download CSV Manifest
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
          <TabsTrigger value="checkins">Check-in Log</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-4">
          <QRScanner
            tripId={tripId}
            scheduleId={scheduleId}
            onCheckinComplete={handleCheckinComplete}
          />
        </TabsContent>

        <TabsContent value="checkins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Check-in Log</CardTitle>
              <CardDescription>
                Recent passenger check-ins for this trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats && stats.checkins.length > 0 ? (
                <Table>
                  <TableCaption>
                    Showing {stats.checkins.length} check-ins
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Passenger</TableHead>
                      <TableHead>Booking Ref</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Checked By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.checkins.map((checkin) => (
                      <TableRow key={checkin.id}>
                        <TableCell className="font-medium">
                          {checkin.passenger.fullName}
                        </TableCell>
                        <TableCell>
                          {checkin.booking.bookingReference || 'N/A'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {checkin.passenger.email || checkin.passenger.phone}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              checkin.method === 'qr' ? 'default' : 'secondary'
                            }
                          >
                            {checkin.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(
                              checkin.checkedInAt
                            ).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {checkin.checkedInBy?.fullName || 'System'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No passengers checked in yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
