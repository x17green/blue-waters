/**
 * @deprecated Use the new client utilities instead:
 * - For Client Components: import { createClient } from '@/src/lib/supabase/client'
 * - For Server Components/Actions: import { createClient } from '@/src/lib/supabase/server'
 * - For Middleware: import { updateSession } from '@/src/lib/supabase/middleware'
 *
 * This file is kept for backward compatibility only.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
