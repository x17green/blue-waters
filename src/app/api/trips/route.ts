/**
 * Trips API Route
 * 
 * GET /api/trips - List available trips (public)
 * POST /api/trips - Create new trip (operator only)
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'

import { apiError, apiResponse, UnauthorizedError, verifyAuth, verifyRole } from '@/src/lib/api-auth'
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

    // Build where clause
    const where: any = {
      status: 'active',
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
            },
          },
          operator: {
            select: {
              id: true,
              companyName: true,
              rating: true,
            },
          },

          schedules: includeSchedules ? {
            where: {
              startTime: { gte: new Date() },
              status: 'scheduled',
            },
            orderBy: { startTime: 'asc' },
            take: 5,
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
          createdAt: trip.createdAt,
        }
      }),
    )

    return apiResponse({
      trips: tripsWithPricing,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
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

    return apiResponse({
      trip: {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        category: trip.category,
        durationMinutes: trip.durationMinutes,
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
