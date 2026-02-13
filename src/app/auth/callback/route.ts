import { NextResponse } from 'next/server'

import { createClient } from '@/src/lib/supabase/server'

/**
 * Auth callback handler for OAuth providers and email confirmation
 * Exchanges auth code for session
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString()

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to provided URL or dashboard
  return NextResponse.redirect(redirectTo ? `${origin}${redirectTo}` : `${origin}/dashboard`)
}
