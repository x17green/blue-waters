import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Icon from "@mdi/react"
import { mdiMagnify, mdiFilter, mdiAccountCheck, mdiAccountRemove, mdiDotsHorizontal } from "@mdi/js"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

async function getUsers(search?: string, role?: string, status?: string) {
  try {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (role) params.set('role', role)
    if (status) params.set('status', status)

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/users?${params}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
    return { users: [], pagination: { total: 0 } }
  }
}

interface AdminUsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const role = typeof searchParams.role === 'string' ? searchParams.role : undefined
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined

  const { users, pagination } = await getUsers(search, role, status)

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive",
      operator: "default",
      staff: "secondary",
      customer: "outline"
    } as const
    return <Badge variant={variants[role as keyof typeof variants] || "outline"}>{role}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      suspended: "destructive"
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users and permissions</p>
        </div>
        <Button>
          <Icon path={mdiAccountCheck} size={0.75} className="mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Icon path={mdiMagnify} size={0.75} className="absolute left-3 top-3 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9" name="search" defaultValue={search} />
            </div>
            <Button variant="outline" type="submit">
              <Icon path={mdiFilter} size={0.75} className="mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({pagination.total})</CardTitle>
          <CardDescription>All registered system users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/avatars/${user.id}.jpg`} />
                        <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}</TableCell>
                  <TableCell>{user.bookings?.[0]?.count || 0}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Icon path={mdiDotsHorizontal} size={0.75} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Icon path={mdiAccountRemove} size={0.75} className="mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}