/**
 * Authentication Middleware for API Routes
 * 
 * Verifies Supabase JWT tokens and extracts user information
 */

import { createClient } from '@/src/lib/supabase/server'
import { NextRequest } from 'next/server'

export interface AuthUser {
  id: string
  email: string
  role: string
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

/**
 * Verify user authentication from request
 * Throws UnauthorizedError if not authenticated
 * 
 * @param request - Next.js request object
 * @returns Authenticated user object
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new UnauthorizedError('Authentication required')
  }

  // Get user role from database
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email || '',
    role: profile?.role || 'customer',
  }
}

/**
 * Verify user has specific role
 * 
 * @param request - Next.js request object
 * @param allowedRoles - Array of allowed roles
 * @returns Authenticated user object
 */
export async function verifyRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<AuthUser> {
  const user = await verifyAuth(request)

  if (!allowedRoles.includes(user.role)) {
    throw new UnauthorizedError('Insufficient permissions')
  }

  return user
}

/**
 * API Response helper
 */
export function apiResponse<T>(data: T, status: number = 200) {
  return Response.json(data, { status })
}

/**
 * API Error response helper
 */
export function apiError(message: string, status: number = 400) {
  return Response.json({ error: message }, { status })
}
