# Authentication & Layout System

## Overview

Bayelsa Boat Club now uses a **centralized authentication context** with **role-aware layouts** for different user types. This document explains the architecture and usage patterns.

## Architecture

### 1. AuthContext (`src/contexts/auth-context.tsx`)

**Single source of truth** for authentication state across the entire application.

#### Features:
- ✅ Single Supabase subscription for entire app (no duplicate listeners)
- ✅ Syncs `auth.users` with `public.users` database table
- ✅ Role-aware user data with TypeScript types
- ✅ Utility methods for role checking
- ✅ Automatic session refresh on auth state changes

#### Usage:

```tsx
import { useAuth } from '@/src/hooks/use-auth'

function MyComponent() {
  const { 
    user,           // Supabase auth user
    appUser,        // Database user with role
    loading,        // Auth initialization state
    isAuthenticated,
    isOperator,     // Role checks
    isCustomer,
    isStaff,
    isAdmin,
    hasRole,        // Flexible role checking
    signOut,        // Sign out method
    refreshUser     // Refresh user data from database
  } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <h1>Welcome, {appUser?.fullName || 'User'}!</h1>
      <p>Role: {appUser?.role}</p>
      
      {isOperator && <OperatorFeatures />}
      {hasRole(['admin', 'staff']) && <AdminPanel />}
    </div>
  )
}
```

### 2. Dashboard Layouts

Two distinct layouts for different user roles, both using **dark glassmorphism** design system.

#### User Dashboard Layout (`src/components/layouts/user-dashboard-layout.tsx`)

For **customers** booking trips and managing their reservations.

**Features:**
- Glassmorphic header with navigation (Dashboard, Book Trip, Search, Profile)
- User menu with name and role display
- Minimal footer with support links
- Smooth animations
- Mobile responsive

**Usage:**

```tsx
import UserDashboardLayout from '@/src/components/layouts/user-dashboard-layout'

export default function DashboardPage() {
  return (
    <UserDashboardLayout>
      <h1>My Bookings</h1>
      {/* Your dashboard content */}
    </UserDashboardLayout>
  )
}
```

#### Operator Dashboard Layout (`src/components/layouts/operator-dashboard-layout.tsx`)

For **operators** managing trips, bookings, and revenue.

**Features:**
- Professional glassmorphic header with extensive navigation
- Notification center with badge
- Settings access
- Mobile menu with hamburger toggle
- System status indicator
- Compact footer with operational links
- Role-aware branding

**Usage:**

```tsx
import OperatorDashboardLayout from '@/src/components/layouts/operator-dashboard-layout'

export default function OperatorDashboardPage() {
  return (
    <OperatorDashboardLayout>
      <h1>Operations Overview</h1>
      {/* Your operator dashboard content */}
    </OperatorDashboardLayout>
  )
}
```

### 3. Design System Integration

Both layouts use **Bayelsa Boat Club Design Tokens** from `src/design-system/tokens.ts`:

#### Colors:
- `--bg-950`: Deepest background (app background)
- `--bg-900`: Cards and containers
- `--accent-400`: Primary accent (hover states)
- `--accent-500`: Primary accent (default)
- `--fg`: Primary text
- `--fg-muted`: Secondary text
- `--border-subtle`: Subtle borders

#### Glass Effects:
- `.glass`: Base glassmorphism effect
- `.glass-subtle`: Subtle glass for primary surfaces
- `.glass-strong`: Strong glass for secondary cards
- `.glass-hover`: Hover state enhancement

#### Spacing:
- Uses 8px base scale via design tokens
- Consistent padding and margins

## Migration Guide

### Updating Existing Pages

#### Before:
```tsx
'use client'
import { useAuth } from '@/src/hooks/use-auth'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  
  return (
    <div>
      {/* Manual header */}
      <nav>...</nav>
      {/* Content */}
      {/* Manual footer */}
    </div>
  )
}
```

#### After:
```tsx
'use client'
import { useAuth } from '@/src/hooks/use-auth'
import UserDashboardLayout from '@/src/components/layouts/user-dashboard-layout'

export default function Dashboard() {
  const { appUser, loading } = useAuth()
  
  return (
    <UserDashboardLayout>
      {/* Just your content - header/footer handled by layout */}
      <h1>Welcome, {appUser?.fullName}!</h1>
      {/* Your dashboard content */}
    </UserDashboardLayout>
  )
}
```

### Role-Based Access Control

Use the `hasRole()` method for flexible access control:

```tsx
import { useAuth } from '@/src/hooks/use-auth'

export default function ProtectedPage() {
  const { hasRole, loading } = useAuth()

  if (loading) return <LoadingSpinner />

  // Single role check
  if (!hasRole('operator')) {
    return <Unauthorized />
  }

  // Multiple roles allowed
  if (!hasRole(['operator', 'admin', 'staff'])) {
    return <Unauthorized />
  }

  return <SensitiveContent />
}
```

### Server-Side Protection

For API routes and server components:

```tsx
// app/api/operator/route.ts
import { createClient } from '@/src/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch user role from database
  const { data: appUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (appUser?.role !== 'operator' && appUser?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Proceed with operator logic
}
```

## Benefits

### Performance
- **Single subscription**: One `onAuthStateChange` listener instead of per-component
- **Cached user data**: Database user fetched once and shared
- **Reduced re-renders**: Centralized state management

### Developer Experience
- **Type safety**: Full TypeScript support for user and role types
- **Consistent API**: Same hook signature everywhere
- **Role utilities**: `isOperator`, `hasRole()`, etc. built-in
- **Simple layouts**: Wrap pages in layout component - done!

### User Experience
- **Consistent navigation**: Same header/footer across related pages
- **Role-appropriate UI**: Different layouts for customers vs operators
- **Professional design**: Glassmorphism with design tokens
- **Smooth animations**: Framer Motion transitions

## Troubleshooting

### "useAuth must be used within an AuthProvider"

**Problem**: Component using `useAuth()` is not wrapped in `AuthProvider`.

**Solution**: Ensure `<Providers>` wraps your app in `layout.tsx`:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>  {/* This includes AuthProvider */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### User role not updating

**Problem**: Database role changed but `appUser.role` still shows old value.

**Solution**: Call `refreshUser()` after role changes:

```tsx
const { refreshUser } = useAuth()

async function updateUserRole(newRole: string) {
  // Update role in database
  await updateRoleInDatabase(newRole)
  
  // Refresh auth context
  await refreshUser()
}
```

### Layout not applying styles

**Problem**: CSS variables not defined or glassmorphism not working.

**Solution**: Ensure design tokens are imported in `globals.css`:

```css
/* src/app/globals.css */
@import '../design-system/tokens.css';
```

## Next Steps

1. **Migrate dashboard pages** to use new layouts
2. **Add middleware** for route protection based on roles
3. **Implement role-based navigation** (hide menu items user can't access)
4. **Add permission system** beyond basic roles if needed

## Related Files

- `src/contexts/auth-context.tsx` - AuthContext implementation
- `src/components/layouts/user-dashboard-layout.tsx` - Customer layout
- `src/components/layouts/operator-dashboard-layout.tsx` - Operator layout
- `src/components/providers.tsx` - Root providers wrapper
- `src/hooks/use-auth.ts` - Hook re-export
- `src/design-system/tokens.ts` - Design tokens
- `prisma/schema.prisma` - User model with roles
