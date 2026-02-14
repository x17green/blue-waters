import PublicLayout from '@/src/components/layouts/public-layout'
import type { ReactNode } from 'react'

/**
 * Public Pages Layout
 * 
 * Wraps all public-facing routes with PublicLayout (header + footer).
 * This route group includes:
 * - Home page (/)
 * - Auth pages (/login, /signup, /forgot-password, /reset-password)
 * - Booking pages (/book, /search, /checkout)
 * - Examples (/examples/*)
 * 
 * Note: /dashboard and /operator routes have their own layouts
 */
export default function PublicPagesLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>
}
