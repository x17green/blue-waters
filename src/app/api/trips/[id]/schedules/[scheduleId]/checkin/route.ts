/**
 * Check-in API
 * POST /api/trips/[id]/schedules/[scheduleId]/checkin
 */

import { NextRequest, NextResponse } from 'next/server'

import { verifyAuth } from '@/src/lib/api-auth'
import { prisma } from '@/src/lib/prisma.client'

// Helper functions
function apiResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

interface CheckinRequest {
  qrCode?: string
  passengerId?: string
  method: 'qr' | 'manual'
}

interface BoardingPassData {
  passenger: {
    id: string
    fullName: string
    email: string | null
    phone: string | null
  }
  booking: {
    id: string
    bookingReference: string | null
    status: string
  }
  trip: {
    id: string
    title: string
    departurePort: string | null
    arrivalPort: string | null
  }
  schedule: {
    id: string
    startTime: Date
    endTime: Date
  }
  vessel: {
    name: string
    registrationNo: string | null
  }
  checkin: {
    id: string
    checkedInAt: Date
    method: string
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scheduleId: string }> },
): Promise<NextResponse> {
  try {
    // 1. Verify authentication (operator/staff only)
    let user
    try {
      user = await verifyAuth(request)
    } catch (error) {
      return apiError('Unauthorized', 401)
    }

    const operatorRoles = ['operator', 'staff', 'admin']
    if (!operatorRoles.includes(user.role)) {
      return apiError('Insufficient permissions', 403)
    }

    // 2. Parse request body
    const body: CheckinRequest = await request.json()
    const { qrCode, passengerId, method } = body

    if (!qrCode && !passengerId) {
      return apiError('Either qrCode or passengerId is required', 400)
    }

    const { id: tripId, scheduleId } = await params

    // 3. Find passenger and booking
    let passenger
    let booking

    if (qrCode) {
      // QR code check-in
      booking = await prisma.booking.findFirst({
        where: { qrCode },
        include: {
          passengers: true,
          user: true,
          tripSchedule: {
            include: {
              trip: {
                include: {
                  vessel: true,
                },
              },
            },
          },
        },
      })

      if (!booking) {
        return apiError('Invalid QR code', 404)
      }

      if (booking.tripScheduleId !== scheduleId) {
        return apiError('QR code is not valid for this trip schedule', 400)
      }

      // Get first passenger (assuming QR scan for first passenger)
      passenger = booking.passengers[0]
    } else if (passengerId) {
      // Manual check-in by passenger ID
      passenger = await prisma.passenger.findUnique({
        where: { id: passengerId },
        include: {
          booking: {
            include: {
              user: true,
              tripSchedule: {
                include: {
                  trip: {
                    include: {
                      vessel: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      if (!passenger) {
        return apiError('Passenger not found', 404)
      }

      booking = passenger.booking

      if (booking.tripScheduleId !== scheduleId) {
        return apiError('Passenger is not booked for this trip schedule', 400)
      }
    }

    if (!passenger || !booking) {
      return apiError('Passenger or booking not found', 404)
    }

    // 4. Check if already checked in
    const existingCheckin = await prisma.checkin.findUnique({
      where: { passengerId: passenger.id },
    })

    if (existingCheckin) {
      return apiError('Passenger already checked in', 409)
    }

    // 5. Verify booking is confirmed
    if (booking.status !== 'confirmed') {
      return apiError(
        `Booking status is ${booking.status}, check-in only allowed for confirmed bookings`,
        400,
      )
    }

    // 6. Create check-in record
    const checkin = await prisma.checkin.create({
      data: {
        passengerId: passenger.id,
        bookingId: booking.id,
        checkedInById: user.id,
        checkedInAt: new Date(),
        method: method || 'qr',
      },
    })

    // 7. Build boarding pass data
    const boardingPass: BoardingPassData = {
      passenger: {
        id: passenger.id,
        fullName: passenger.fullName,
        email: passenger.email,
        phone: passenger.phone,
      },
      booking: {
        id: booking.id,
        bookingReference: booking.bookingReference,
        status: booking.status,
      },
      trip: {
        id: booking.tripSchedule.trip.id,
        title: booking.tripSchedule.trip.title,
        departurePort: booking.tripSchedule.departurePort,
        arrivalPort: booking.tripSchedule.arrivalPort,
      },
      schedule: {
        id: booking.tripSchedule.id,
        startTime: booking.tripSchedule.startTime,
        endTime: booking.tripSchedule.endTime,
      },
      vessel: {
        name: booking.tripSchedule.trip.vessel.name,
        registrationNo: booking.tripSchedule.trip.vessel.registrationNo,
      },
      checkin: {
        id: checkin.id,
        checkedInAt: checkin.checkedInAt,
        method: checkin.method,
      },
    }

    return apiResponse(boardingPass, 200)
  } catch (error) {
    console.error('Error processing check-in:', error)
    return apiError('Internal server error', 500)
  }
}

/**
 * GET - Retrieve check-in status for a passenger or all passengers
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scheduleId: string }> },
): Promise<NextResponse> {
  try {
    // Verify authentication
    try {
      await verifyAuth(request)
    } catch (error) {
      return apiError('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const passengerId = searchParams.get('passengerId')
    const { scheduleId } = await params

    if (passengerId) {
      // Get check-in status for specific passenger
      const checkin = await prisma.checkin.findUnique({
        where: { passengerId },
        include: {
          passenger: true,
          booking: true,
          checkedInBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      })

      if (!checkin) {
        return apiResponse({ checkedIn: false }, 200)
      }

      return apiResponse(
        {
          checkedIn: true,
          checkin,
        },
        200,
      )
    } else {
      // Get all check-ins for this trip schedule
      const checkins = await prisma.checkin.findMany({
        where: {
          booking: {
            tripScheduleId: scheduleId,
          },
        },
        include: {
          passenger: true,
          booking: {
            select: {
              bookingReference: true,
              status: true,
            },
          },
          checkedInBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          checkedInAt: 'desc',
        },
      })

      // Get total passenger count for the schedule
      const totalPassengers = await prisma.passenger.count({
        where: {
          booking: {
            tripScheduleId: scheduleId,
            status: 'confirmed',
          },
        },
      })

      return apiResponse(
        {
          checkins,
          stats: {
            checkedIn: checkins.length,
            totalPassengers,
            remaining: totalPassengers - checkins.length,
          },
        },
        200,
      )
    }
  } catch (error) {
    console.error('Error fetching check-in data:', error)
    return apiError('Internal server error', 500)
  }
}
