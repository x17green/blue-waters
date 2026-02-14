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

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/checkout', '/book', '/operator', '/profile', '/admin']
  const isProtectedRoute = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
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
