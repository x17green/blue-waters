import { NextRequest } from 'next/server'

import { apiResponse, apiError } from '@/src/lib/api-auth' // reuse helper for consistency

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { namespace } = body
    if (!namespace) {
      return apiError('namespace is required', 400)
    }
    const { bumpCacheVersion } = await import('@/src/lib/redis')
    const newVal = await bumpCacheVersion(namespace)
    return apiResponse({ namespace, newVersion: newVal })
  } catch (err) {
    console.error('cache-bump error', err)
    return apiError('failed to bump cache', 500)
  }
}
