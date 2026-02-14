/**
 * Bookings API Route
 * 
 * POST /api/bookings - Create new booking with seat lock
 * GET /api/bookings - List user's bookings
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'

import { apiError, apiResponse, UnauthorizedError, verifyAuth } from '@/src/lib/api-auth'
import { prisma } from '@/src/lib/prisma.client'
import { lockSeats } from '@/src/lib/seat-lock'

// Validation schemas
const createBookingSchema = z.object({
  tripScheduleId: z.string().uuid(),
  numberOfPassengers: z.number().int().min(1).max(20),
  passengers: z.array(z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email().optional(),
    emergencyContact: z.string().optional(),
  })),
  priceTierId: z.string().uuid(),
})

/**
 * POST /api/bookings
 * Create a new booking with seat lock
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await verifyAuth(request)

    // 2. Parse and validate request body
    const body = await request.json()
    const validatedData = createBookingSchema.parse(body)

    // 3. Verify trip schedule exists and get pricing
    const schedule = await prisma.tripSchedule.findUnique({
      where: { id: validatedData.tripScheduleId },
      include: {
        trip: {
          include: {
            vessel: true,
          },
        },
        priceTiers: {
          where: { id: validatedData.priceTierId },
        },
      },
    })

    if (!schedule) {
      return apiError('Trip schedule not found', 404)
    }

    if (schedule.status !== 'scheduled') {
      return apiError('Trip is not available for booking', 400)
    }

    if (new Date(schedule.startTime) < new Date()) {
      return apiError('Cannot book past trips', 400)
    }

    const priceTier = schedule.priceTiers[0]
    if (!priceTier || priceTier.priceKobo === null) {
      return apiError('Price tier not found', 404)
    }

    // 4. Validate passenger count matches
    if (validatedData.passengers.length !== validatedData.numberOfPassengers) {
      return apiError('Passenger count mismatch', 400)
    }

    // 5. Lock seats
    const lockResult = await lockSeats(
      validatedData.tripScheduleId,
      user.id,
      validatedData.numberOfPassengers,
    )

    if (!lockResult.success) {
      return apiError(lockResult.message, 409)
    }

    // 6. Calculate total amount
    const totalAmountKobo = Number(priceTier.amountKobo) * validatedData.numberOfPassengers

    // 7. Create booking in database (transaction)
    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          userId: user.id,
          tripScheduleId: validatedData.tripScheduleId,
          numberOfPassengers: validatedData.numberOfPassengers,
          priceTierId: validatedData.priceTierId,
          totalAmountKobo,
          status: 'held',
          paymentStatus: 'pending',
          bookingReference: `BW${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          holdExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      })

      // Create booking items
      await tx.bookingItem.createMany({
        data: validatedData.passengers.map((passenger, index) => ({
          bookingId: newBooking.id,
          priceTierId: validatedData.priceTierId,
          seatNumber: null, // Assigned later if vessel has assigned seating
          passengerName: passenger.fullName,
          passengerPhone: passenger.phone,
          passengerEmail: passenger.email,
          priceKobo: priceTier.priceKobo,
        })),
      })

      // Create passengers for manifest
      await tx.passenger.createMany({
        data: validatedData.passengers.map((passenger) => ({
          bookingId: newBooking.id,
          fullName: passenger.fullName,
          phone: passenger.phone,
          email: passenger.email,
          emergencyContact: passenger.emergencyContact,
        })),
      })

      return newBooking
    })

    // 8. Return booking with payment information
    return apiResponse({
      booking: {
        id: booking.id,
        reference: booking.bookingReference,
        status: booking.status,
        totalAmount: Number(booking.totalAmountKobo) / 100, // Convert to Naira
        holdExpiresAt: booking.holdExpiresAt,
        tripSchedule: {
          id: schedule.id,
          startTime: schedule.startTime,
          trip: {
            title: schedule.trip.title,
            description: schedule.trip.description,
          },
          vessel: {
            name: schedule.trip.vessel?.name,
          },
        },
      },
      lockId: lockResult.lockId,
      message: 'Booking created successfully. Complete payment within 10 minutes.',
    }, 201)

  } catch (error) {
    console.error('Error creating booking:', error)

    if (error instanceof UnauthorizedError) {
      return apiError(error.message, 401)
    }

    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.errors[0].message}`, 400)
    }

    return apiError('Failed to create booking', 500)
  }
}

/**
 * GET /api/bookings
 * List user's bookings
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await verifyAuth(request)

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 3. Build query filters
    const where: any = { userId: user.id }
    if (status) {
      where.status = status
    }

    // 4. Fetch bookings
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          tripSchedule: {
            include: {
              trip: {
                include: {
                  vessel: true,
                },
              },
            },
          },
          priceTier: true,
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.booking.count({ where }),
    ])

    return apiResponse({
      bookings: bookings.map((booking) => ({
        id: booking.id,
        reference: booking.bookingReference,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        numberOfPassengers: booking.numberOfPassengers,
        totalAmount: Number(booking.totalAmountKobo) / 100,
        createdAt: booking.createdAt,
        tripSchedule: {
          startTime: booking.tripSchedule.startTime,
          trip: {
            title: booking.tripSchedule.trip.title,
            description: booking.tripSchedule.trip.description,
          },
          vessel: {
            name: booking.tripSchedule.trip.vessel?.name,
          },
        },
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })

  } catch (error) {
    console.error('Error fetching bookings:', error)

    if (error instanceof UnauthorizedError) {
      return apiError(error.message, 401)
    }

    return apiError('Failed to fetch bookings', 500)
  }
}
