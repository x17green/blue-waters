import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Middleware Supabase client for session refresh and route protection
 * Handles cookies in middleware context
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user role if authenticated
  let userRole: string | null = null
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    
    userRole = userData?.role || 'customer'
  }

  // Protected routes that require authentication on **server** navigations.
  // '/book' is intentionally omitted so anonymous users can browse the booking page;
  // authentication will be enforced by the booking API when the user submits.
  const protectedPaths = ['/dashboard', '/checkout', '/operator', '/profile', '/admin']
  const isProtectedRoute = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // if we already know the user's role, make sure a direct hit to /dashboard
  // sends them to the correct dashboard immediately; this prevents a
  // cached server component from later mis‑redirecting.
  if (user && userRole && request.nextUrl.pathname === '/dashboard') {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (['operator', 'staff'].includes(userRole)) {
      return NextResponse.redirect(new URL('/operator/dashboard', request.url))
    }
    // otherwise let the customer stay on /dashboard
  }

  // Role-based route protection
  if (user && userRole) {
    const isOperatorRoute = request.nextUrl.pathname.startsWith('/operator')
    const isCustomerDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isOperatorRole = ['operator', 'staff', 'admin'].includes(userRole)
    const isAdminRole = userRole === 'admin'

    // Redirect non-admin users trying to access admin routes
    if (isAdminRoute && !isAdminRole) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Redirect customers trying to access operator routes
    if (isOperatorRoute && !isOperatorRole) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Redirect operators trying to access customer dashboard
    if (isCustomerDashboard && isOperatorRole) {
      const url = request.nextUrl.clone()
      url.pathname = '/operator/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirect to appropriate dashboard if accessing auth pages while logged in
  const authPaths = ['/login', '/signup']
  const isAuthRoute = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isAuthRoute && user && userRole) {
    const url = request.nextUrl.clone()
    // Role-based redirect for authenticated users
    const isOperatorRole = ['operator', 'staff', 'admin'].includes(userRole)
    const isAdminRole = userRole === 'admin'
    
    if (isAdminRole) {
      url.pathname = '/admin'
    } else if (isOperatorRole) {
      url.pathname = '/operator/dashboard'
    } else {
      url.pathname = '/dashboard'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
