import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Icon from "@mdi/react"
import { mdiChartLine, mdiDownload, mdiCalendar, mdiTrendingUp, mdiAccountGroup, mdiCreditCard, mdiFileDocument } from "@mdi/js"

async function getReports(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    const params = new URLSearchParams()

    if (searchParams.type) params.set('type', searchParams.type as string)
    if (searchParams.startDate) params.set('startDate', searchParams.startDate as string)
    if (searchParams.endDate) params.set('endDate', searchParams.endDate as string)

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/reports?${params}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch reports')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching reports:', error)
    return {
      type: 'overview',
      metrics: {
        totalRevenue: 0,
        totalBookings: 0,
        completedBookings: 0,
        totalUsers: 0,
        newCustomers: 0,
        conversionRate: 0
      },
      summary: {
        totalRevenue: 0,
        totalBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        successfulPayments: 0,
        failedPayments: 0
      },
      charts: {},
      breakdowns: {},
      transactions: [],
      bookings: [],
      users: []
    }
  }
}

interface AdminReportsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  const reportData = await getReports(searchParams)
  const reportType = searchParams.type as string || 'overview'

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icon path={mdiCalendar} size={0.75} className="mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Icon path={mdiDownload} size={0.75} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Report Type:</label>
            <Select defaultValue={reportType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
                <SelectItem value="users">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon path={mdiCreditCard} size={0.75} />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(reportData.metrics.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Total earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon path={mdiFileDocument} size={0.75} />
                  Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.metrics.totalBookings}</div>
                <p className="text-xs text-muted-foreground">Total bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon path={mdiTrendingUp} size={0.75} />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{reportData.metrics.completedBookings}</div>
                <p className="text-xs text-muted-foreground">Confirmed bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon path={mdiAccountGroup} size={0.75} />
                  Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.metrics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Total users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.metrics.newCustomers}</div>
                <p className="text-xs text-muted-foreground">New customers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(reportData.metrics.conversionRate)}</div>
                <p className="text-xs text-muted-foreground">Booking rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Icon path={mdiChartLine} size={3} className="mx-auto mb-2 opacity-50" />
                    <p>Chart visualization would be displayed here</p>
                    <p className="text-sm">Revenue by month data available in API response</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bookings by Status</CardTitle>
                <CardDescription>Distribution of booking statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(reportData.charts.bookingsByStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{status}</Badge>
                      </div>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalRevenue)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{reportData.summary.successfulPayments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{reportData.summary.failedPayments}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(reportData.breakdowns.byMethod).map(([method, amount]) => (
                    <div key={method} className="flex items-center justify-between">
                      <Badge variant="outline">{method.replace('_', ' ')}</Badge>
                      <span className="font-medium">{formatCurrency(amount as number)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(reportData.breakdowns.byStatus).map(([status, amount]) => (
                    <div key={status} className="flex items-center justify-between">
                      <Badge variant={status === 'completed' ? 'default' : 'secondary'}>{status}</Badge>
                      <span className="font-medium">{formatCurrency(amount as number)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Bookings Report */}
      {reportType === 'bookings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.summary.totalBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{reportData.summary.confirmedBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{reportData.summary.cancelledBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(reportData.summary.totalRevenue)}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bookings by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(reportData.breakdowns.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <Badge variant="outline">{status}</Badge>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Report */}
      {reportType === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.summary.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{reportData.summary.activeUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.summary.newUsers}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(reportData.breakdowns.byRole).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <Badge variant="outline">{role}</Badge>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}