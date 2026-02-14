import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Icon from "@mdi/react"
import { mdiCheckCircle, mdiCloseCircle, mdiClock, mdiAlert, mdiDownload, mdiRefresh } from "@mdi/js"

async function getPayments(status?: string) {
  try {
    const params = new URLSearchParams()
    if (status) params.set('status', status)

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/payments?${params}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch payments')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching payments:', error)
    return {
      payments: [],
      summary: {
        totalRevenue: 0,
        successfulPayments: 0,
        pendingPayments: 0,
        failedPayments: 0
      }
    }
  }
}

interface AdminPaymentsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminPaymentsPage({ searchParams }: AdminPaymentsPageProps) {
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined
  const { payments, summary } = await getPayments(status)

  const getStatusBadge = (status: string) => {
    const configs = {
      completed: { variant: "default" as const, icon: mdiCheckCircle, color: "text-green-600" },
      pending: { variant: "secondary" as const, icon: mdiClock, color: "text-yellow-600" },
      failed: { variant: "destructive" as const, icon: mdiCloseCircle, color: "text-red-600" },
      disputed: { variant: "outline" as const, icon: mdiAlert, color: "text-orange-600" }
    }

    const config = configs[status as keyof typeof configs] || configs.pending

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon path={config.icon} size={0.5} className={config.color} />
        {status}
      </Badge>
    )
  }

  const getMethodBadge = (method: string) => {
    const labels = {
      card: "Card",
      bank_transfer: "Bank Transfer",
      wallet: "Digital Wallet",
      cash: "Cash"
    }
    return <Badge variant="outline">{labels[method as keyof typeof labels] || method}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Reconciliation</h1>
          <p className="text-muted-foreground">Monitor and reconcile all payment transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icon path={mdiRefresh} size={0.75} className="mr-2" />
            Sync
          </Button>
          <Button variant="outline">
            <Icon path={mdiDownload} size={0.75} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{summary.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.successfulPayments}</div>
            <p className="text-xs text-muted-foreground">98.5% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.failedPayments}</div>
            <p className="text-xs text-muted-foreground">Needs investigation</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Payments ({payments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Payment Transactions</CardTitle>
              <CardDescription>Complete payment history and reconciliation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.id.slice(0, 8)}...</TableCell>
                      <TableCell className="font-mono text-sm">{payment.bookingId.slice(0, 8)}...</TableCell>
                      <TableCell>{payment.customer}</TableCell>
                      <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{getMethodBadge(payment.method)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.reference.slice(0, 8)}...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">
                Completed payments will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">
                Pending payments requiring attention will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">
                Failed payments requiring investigation will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}