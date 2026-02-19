/**
 * Trips API Route
 * 
 * GET /api/trips - List available trips (public)
 * POST /api/trips - Create new trip (operator only)
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'

import { apiError, apiResponse, UnauthorizedError, verifyRole } from '@/src/lib/api-auth'
import { prisma } from '@/src/lib/prisma.client'

const createTripSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  vesselId: z.string().uuid(),
  routeId: z.string().uuid().optional(),
  durationMinutes: z.number().int().min(15).max(1440),
  category: z.enum(['tour', 'transport', 'charter', 'event']),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  highlights: z.array(z.string()).optional(),
  // Trip-level canonical route (optional)
  departurePort: z.string().min(2).optional(),
  arrivalPort: z.string().min(2).optional(),
  routeName: z.string().max(200).optional(),
})

/**
 * GET /api/trips
 * List available trips with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const category = searchParams.get('category')
    const operatorId = searchParams.get('operatorId')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const includeSchedules = searchParams.get('includeSchedules') === 'true'
    const scheduleStart = searchParams.get('startDate')
    const scheduleEnd = searchParams.get('endDate')

    // Build where clause
    const where: any = {
      isActive: true,
    }

    // --- Redis-backed cache: attempt read before hitting DB ---
    // Cache key includes query params so different queries are cached separately
    try {
      // lazy import to avoid circular deps during tests
      const { redis, buildRedisKey } = await import('@/src/lib/redis')
      const cacheKey = buildRedisKey('api_cache', 'trips', `cat:${category||'_'}`, `op:${operatorId||'_'}`, `q:${search||'_'}`, `incSchedules:${includeSchedules}`, `start:${scheduleStart||'_'}`, `end:${scheduleEnd||'_'}`, `l:${limit}`, `o:${offset}`)
      const cached = await redis.get<string | object>(cacheKey)
      if (cached) {
        let payload: any = null
        if (typeof cached === 'string') {
          try {
            payload = JSON.parse(cached)
          } catch (parseErr) {
            console.warn('Trips cache parse failed — deleting malformed cache key', { cacheKey, cached, parseErr })
            try { await redis.del(cacheKey) } catch (delErr) { console.warn('Failed to delete malformed cache key', delErr) }
            payload = null
          }
        } else if (typeof cached === 'object') {
          // Upstash may return parsed objects in some contexts — accept it
          payload = cached
        }

        if (payload) {
          // compute ETag and support conditional GET
          const { createHash } = await import('crypto')
          const etag = createHash('sha1').update(JSON.stringify(payload)).digest('hex')
          const ifNoneMatch = request.headers.get('if-none-match')
          if (ifNoneMatch && ifNoneMatch === etag) {
            return new Response(null, {
              status: 304,
              headers: {
                'ETag': etag,
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
                'X-Cache': 'HIT',
              },
            })
          }

          return apiResponse(payload, 200, {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
            'X-Cache': 'HIT',
            'ETag': etag,
          })
        }
      }
    } catch (cacheErr) {
      // non-fatal — continue to DB query
      console.warn('Trips cache read failed', cacheErr)
    }

    if (category) {
      where.category = category
    }

    if (operatorId) {
      where.operatorId = operatorId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // helper to build schedule where (used for include)
    const scheduleWhere: any = { status: 'scheduled' }
    if (scheduleStart || scheduleEnd) {
      scheduleWhere.startTime = {}
      if (scheduleStart) scheduleWhere.startTime.gte = new Date(scheduleStart)
      if (scheduleEnd) scheduleWhere.startTime.lte = new Date(scheduleEnd)
    } else {
      scheduleWhere.startTime = { gte: new Date() }
    }

    // Fetch trips
    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        include: {
          vessel: {
            select: {
              id: true,
              name: true,
              registrationNo: true,
              capacity: true,
              vesselMetadata: true, // include image path & metadata
            },
          },
          operator: {
            select: {
              id: true,
              companyName: true,
              rating: true,
            },
          },

          // includeSchedules supports optional date range and returns price tiers so client can show per-day availability/prices
          schedules: includeSchedules ? {
            where: scheduleWhere,
            orderBy: { startTime: 'asc' },
            // if the client passed a date range, return more rows; otherwise keep a small default
            take: (scheduleStart || scheduleEnd) ? 100 : 5,
            include: {
              priceTiers: {
                orderBy: { amountKobo: 'asc' },
              },
            },
          } : false,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.trip.count({ where }),
    ])

    // Calculate price range for each trip
    const tripsWithPricing = await Promise.all(
      trips.map(async (trip) => {
        const schedules = await prisma.tripSchedule.findMany({
          where: { tripId: trip.id },
          include: {
            priceTiers: {
              orderBy: { amountKobo: 'asc' },
            },
          },
        })

        const allPrices = schedules.flatMap((s) =>
          s.priceTiers.map((pt) => Number(pt.amountKobo)),
        )
        const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0
        const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0

        return {
          id: trip.id,
          title: trip.title,
          description: trip.description,
          category: trip.category,
          durationMinutes: trip.durationMinutes,
          highlights: trip.highlights,
          amenities: trip.amenities,
          // Trip-level canonical route (may be null) — preferred by UI when present
          departurePort: trip.departurePort ?? null,
          arrivalPort: trip.arrivalPort ?? null,
          routeName: trip.routeName ?? null,
          pricing: {
            minPrice: minPrice / 100,
            maxPrice: maxPrice / 100,
            tiers: allPrices.length,
          },
          vessel: trip.vessel || undefined,
          operator: trip.operator ? {
            id: trip.operator.id,
            companyName: trip.operator.companyName,
            rating: trip.operator.rating ? Number(trip.operator.rating) : null,
          } : undefined,
          // Include schedules when the caller requested them so the UI can render per-day availability
          schedules: trip.schedules ? trip.schedules.map((s: any) => ({
            id: s.id,
            startTime: s.startTime,
            endTime: s.endTime,
            capacity: s.capacity,
            bookedSeats: s.bookedSeats,
            availableSeats: s.capacity - s.bookedSeats,
            status: s.status,
            departurePort: s.departurePort,
            arrivalPort: s.arrivalPort,
            priceTiers: (s.priceTiers || []).map((pt: any) => ({
              id: pt.id,
              name: pt.name,
              price: (pt.amountKobo ? Number(pt.amountKobo) : (pt.priceKobo ?? 0)) / 100,
              capacity: pt.capacity,
            })),
          })) : undefined,
          createdAt: trip.createdAt,
        }
      }),
    )

    const payload = {
      trips: tripsWithPricing,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    }

    // Try to populate cache (best-effort)
    try {
      const { redis, buildRedisKey, REDIS_TTL } = await import('@/src/lib/redis')
      const cacheKey = buildRedisKey('api_cache', 'trips', `cat:${category||'_'}`, `op:${operatorId||'_'}`, `q:${search||'_'}`, `incSchedules:${includeSchedules}`, `start:${scheduleStart||'_'}`, `end:${scheduleEnd||'_'}`, `l:${limit}`, `o:${offset}`)
      await redis.setex(cacheKey, REDIS_TTL.API_CACHE_TRIPS, JSON.stringify(payload))
    } catch (cacheErr) {
      console.warn('Trips cache write failed', cacheErr)
    }

    // Compute ETag for payload and handle conditional GETs
    const { createHash } = await import('crypto')
    const etag = createHash('sha1').update(JSON.stringify(payload)).digest('hex')
    const ifNoneMatch = request.headers.get('if-none-match')
    if (ifNoneMatch && ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
          'X-Cache': 'MISS',
        },
      })
    }

    return apiResponse(payload, 200, {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      'X-Cache': 'MISS',
      'ETag': etag,
    })

  } catch (error) {
    console.error('Error fetching trips:', error)
    return apiError('Failed to fetch trips', 500)
  }
}

/**
 * POST /api/trips
 * Create new trip (operator only)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate and verify operator role
    const user = await verifyRole(request, ['operator', 'admin'])

    // 2. Parse and validate request body
    const body = await request.json()
    const validatedData = createTripSchema.parse(body)

    // 3. Verify vessel exists and belongs to operator
    const vessel = await prisma.vessel.findUnique({
      where: { id: validatedData.vesselId },
    })

    if (!vessel) {
      return apiError('Vessel not found', 404)
    }

    // Get operator profile
    const operator = await prisma.operator.findFirst({
      where: { userId: user.id },
    })

    if (!operator) {
      return apiError('Operator profile not found', 404)
    }

    if (vessel.operatorId !== operator.id) {
      return apiError('Vessel does not belong to operator', 403)
    }

    // 4. Create trip
    const trip = await prisma.trip.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        vesselId: validatedData.vesselId,
        operatorId: operator.id,
        durationMinutes: validatedData.durationMinutes,
        category: validatedData.category,
        amenities: validatedData.amenities || [],
        highlights: validatedData.highlights || [],
        departurePort: validatedData.departurePort || null,
        arrivalPort: validatedData.arrivalPort || null,
        routeName: validatedData.routeName || null,
      },
      include: {
        vessel: true,
        operator: true,
      },
    })

    // 5. Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'trip',
        entityId: trip.id,
        action: 'create',
        userId: user.id,
        changes: validatedData,
      },
    })

    // Invalidate related caches (best-effort)
    try {
      const { redis, buildRedisKey } = await import('@/src/lib/redis')
      const keys = await redis.keys(buildRedisKey('api_cache', 'trips', '*'))
      if (keys && keys.length > 0) {
        await Promise.all(keys.map((k) => redis.del(k)))
      }
    } catch (err) {
      console.warn('Failed to invalidate trips cache after create', err)
    }

    return apiResponse({
      trip: {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        category: trip.category,
        durationMinutes: trip.durationMinutes,
        departurePort: trip.departurePort ?? null,
        arrivalPort: trip.arrivalPort ?? null,
        routeName: trip.routeName ?? null,
        amenities: trip.amenities,
        highlights: trip.highlights,
        vessel: trip.vessel || undefined,
        operator: trip.operator ? {
          id: trip.operator.id,
          companyName: trip.operator.companyName,
          rating: trip.operator.rating ? Number(trip.operator.rating) : null,
        } : undefined,
        createdAt: trip.createdAt,
      },
      message: 'Trip created successfully. Now add schedules and pricing tiers.',
    }, 201)

  } catch (error) {
    console.error('Error creating trip:', error)

    if (error instanceof UnauthorizedError) {
      return apiError(error.message, 401)
    }

    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.errors[0].message}`, 400)
    }

    return apiError('Failed to create trip', 500)
  }
}
