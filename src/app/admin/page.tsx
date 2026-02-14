import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@mdi/react"
import { mdiAccountGroup, mdiCreditCard, mdiCog, mdiShield, mdiChartBar, mdiFileDocument } from "@mdi/js"

async function getDashboardStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/stats`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      stats: {
        totalUsers: 0,
        activeBookings: 0,
        totalRevenue: 0,
        revenueChange: 0,
        systemHealth: 0
      },
      recentActivity: []
    }
  }
}

export default async function AdminDashboard() {
  const { stats, recentActivity } = await getDashboardStats()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System management and oversight</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Icon path={mdiShield} size={0.75} className="mr-1" />
          Administrator
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Icon path={mdiAccountGroup} size={0.75} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Icon path={mdiCreditCard} size={0.75} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Icon path={mdiChartBar} size={0.75} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Icon path={mdiCog} size={0.75} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.systemHealth}%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Icon path={mdiAccountGroup} size={1} />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Icon path={mdiCreditCard} size={1} />
              <span>Payment Reconciliation</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Icon path={mdiFileDocument} size={1} />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Icon path={mdiShield} size={1} />
              <span>Audit Logs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Icon path={mdiCog} size={1} />
              <span>System Settings</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Icon path={mdiChartBar} size={1} />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.details || activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()} by {activity.user}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">System initialized</p>
                  <p className="text-xs text-muted-foreground">Welcome to the admin dashboard</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}