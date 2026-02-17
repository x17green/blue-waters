export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Icon from "@mdi/react"
import { mdiMagnify, mdiDownload, mdiFilter, mdiCalendar, mdiAccount, mdiShieldCheck, mdiLogin, mdiLogout, mdiCreditCard, mdiFileDocument, mdiCog } from "@mdi/js"
import { format } from "date-fns"

async function getAuditLogs(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    const params = new URLSearchParams()

    if (searchParams.page) params.set('page', searchParams.page as string)
    if (searchParams.limit) params.set('limit', searchParams.limit as string)
    if (searchParams.action) params.set('action', searchParams.action as string)
    if (searchParams.userId) params.set('userId', searchParams.userId as string)
    if (searchParams.startDate) params.set('startDate', searchParams.startDate as string)
    if (searchParams.endDate) params.set('endDate', searchParams.endDate as string)

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/audit-logs?${params}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch audit logs')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return {
      auditLogs: [],
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      filters: { actions: [] }
    }
  }
}

interface AdminAuditLogsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminAuditLogsPage({ searchParams }: AdminAuditLogsPageProps) {
  const { auditLogs, pagination, filters } = await getAuditLogs(searchParams)

  const getActionIcon = (action: string) => {
    const icons = {
      login: mdiLogin,
      logout: mdiLogout,
      payment_created: mdiCreditCard,
      payment_completed: mdiCreditCard,
      booking_created: mdiFileDocument,
      booking_updated: mdiFileDocument,
      user_created: mdiAccount,
      user_updated: mdiAccount,
      settings_changed: mdiCog,
      admin_action: mdiShieldCheck
    }
    return icons[action as keyof typeof icons] || mdiShieldCheck
  }

  const getActionBadge = (action: string) => {
    const variants = {
      login: "default",
      logout: "secondary",
      payment_created: "default",
      payment_completed: "default",
      booking_created: "default",
      booking_updated: "secondary",
      user_created: "default",
      user_updated: "secondary",
      settings_changed: "outline",
      admin_action: "destructive"
    } as const

    return <Badge variant={variants[action as keyof typeof variants] || "outline"}>{action.replace('_', ' ')}</Badge>
  }

  const formatDetails = (details: any) => {
    if (!details) return 'No details'

    try {
      const parsed = typeof details === 'string' ? JSON.parse(details) : details
      return Object.entries(parsed)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    } catch {
      return String(details)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Monitor system activity and user actions</p>
        </div>
        <Button variant="outline">
          <Icon path={mdiDownload} size={0.75} className="mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon path={mdiFilter} size={0.75} />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select defaultValue={searchParams.action as string}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All actions</SelectItem>
                  {filters.actions.map((action: string) => (
                    <SelectItem key={action} value={action}>
                      {action.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">User ID</label>
              <Input
                placeholder="Search by user ID"
                defaultValue={searchParams.userId as string}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                defaultValue={searchParams.startDate as string}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                defaultValue={searchParams.endDate as string}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button>Apply Filters</Button>
            <Button variant="outline">Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Showing {auditLogs.length} of {pagination.total} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {log.users?.first_name} {log.users?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.users?.email}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {log.users?.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon path={getActionIcon(log.action)} size={0.75} />
                      {getActionBadge(log.action)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate text-sm" title={formatDetails(log.details)}>
                      {formatDetails(log.details)}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.ip_address || 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate text-sm" title={log.user_agent}>
                      {log.user_agent || 'N/A'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {auditLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}