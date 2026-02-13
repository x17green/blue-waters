/**
 * ⚠️ ⚠️ ⚠️ DEPRECATED - DO NOT USE ⚠️ ⚠️ ⚠️
 *
 * THIS CLIENT IS INCOMPATIBLE WITH NEXT.JS APP ROUTER SSR!
 *
 * Using this client will cause:
 * - Session conflicts and authentication errors
 * - "Auth session missing!" errors
 * - Users being logged out unexpectedly
 * - Cookie synchronization issues
 *
 * Use the new client utilities instead:
 * - For Client Components: import { createClient } from '@/src/lib/supabase/client'
 * - For Server Components/Actions: import { createClient } from '@/src/lib/supabase/server'
 * - For Middleware: import { updateSession } from '@/src/lib/supabase/middleware'
 * - For Auth Hook: import { useAuth } from '@/src/hooks/use-auth'
 *
 * This file is kept for backward compatibility with scripts only.
 * DO NOT IMPORT THIS IN ANY COMPONENTS OR PAGES!
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
  )
}

/**
 * @deprecated DO NOT USE IN COMPONENTS OR PAGES - Use @supabase/ssr clients instead
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
