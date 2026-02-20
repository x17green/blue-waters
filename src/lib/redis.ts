/**
 * Redis Client Configuration (Upstash Serverless)
 * 
 * Used for:
 * - Seat locking during checkout (10-minute TTL)
 * - Caching trip availability
 * - Rate limiting
 * - Session storage
 */

import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined')
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined')
}

/**
 * Serverless Redis client for Upstash
 * Works with Next.js Edge Runtime and Vercel Functions
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

/**
 * Redis key prefixes for namespacing
 */
export const REDIS_KEYS = {
  SEAT_LOCK: 'seat_lock',
  BOOKING_HOLD: 'booking_hold',
  TRIP_CAPACITY: 'trip_capacity',
  RATE_LIMIT: 'rate_limit',
  SESSION: 'session',
} as const

/**
 * Redis TTL constants (in seconds)
 */
export const REDIS_TTL = {
  SEAT_LOCK: 600, // 10 minutes for checkout
  BOOKING_HOLD: 600, // 10 minutes
  TRIP_CAPACITY: 300, // 5 minutes cache (used for capacity snapshots)
  AVAILABILITY_SNAPSHOT: 15, // short-lived availability snapshot (seconds)
  RATE_LIMIT: 60, // 1 minute
  SESSION: 86400, // 24 hours
  API_CACHE_TRIPS: 300, // cache trips list (seconds)
  API_CACHE_SCHEDULES: 15, // cache schedules for short window (seconds)
} as const

/**
 * Helper to build Redis keys
 */
export function buildRedisKey(prefix: string, ...parts: string[]): string {
  return [prefix, ...parts].join(':')
}

// Cache versioning helpers (avoid wildcard key scans)
const CACHE_VERSION_PREFIX = 'cache_version'

export async function getCacheVersion(namespace: string): Promise<number> {
  const key = `${CACHE_VERSION_PREFIX}:${namespace}`
  const v = await redis.get<number | string>(key)
  if (v == null) return 0
  if (typeof v === 'string') return parseInt(v, 10) || 0
  return v
}

export async function bumpCacheVersion(namespace: string): Promise<number> {
  const key = `${CACHE_VERSION_PREFIX}:${namespace}`
  // redis.incr returns new value
  const newVal = await redis.incr(key)
  return typeof newVal === 'string' ? parseInt(newVal, 10) : newVal
}

// build a key that includes the current version for a namespace.
// this ensures invalidation by bumping version instead of deleting keys.
export async function buildVersionedRedisKey(namespace: string, ...parts: string[]): Promise<string> {
  const version = await getCacheVersion(namespace)
  return [namespace, `v${version}`, ...parts].join(':')
}
