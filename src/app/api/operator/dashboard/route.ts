/**
 * Operator Dashboard API Route
 *
 * GET /api/operator/dashboard - Get dashboard statistics for authenticated operator
 */

import { NextRequest } from 'next/server'
import { startOfMonth, endOfMonth, subMonths, format, startOfDay, endOfDay } from 'date-fns'

import { apiError, apiResponse, verifyRole } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma.client'

/**
 * GET /api/operator/dashboard
 * Get dashboard statistics for the authenticated operator
 */
export async function GET(request: NextRequest) {
  try {
    // Verify operator role
    const user = await verifyRole(request, ['operator', 'admin'])

    // Get operator info
    const operator = await prisma.operator.findFirst({
      where: {
        userId: user.role === 'admin' ? undefined : user.id,
        ...(user.role === 'admin' && { userId: user.id })
      },
      include: {
        user: true,
      }
    })

    // Check if operator profile is complete
    const isProfileIncomplete = !operator || !operator.organizationName || operator.organizationName.trim() === ''

    if (!operator) {
      return apiResponse({
        operator: null,
        revenueData: [],
        bookingsData: [],
        weeklyBookings: [],
        upcomingTrips: [],
        recentBookings: [],
        profileIncomplete: true
      })
    }

    if (isProfileIncomplete) {
      return apiResponse({
        operator: {
          id: operator.id,
          name: operator.organizationName || 'Unnamed Operator',
          verified: operator.verified,
          rating: 0,
          totalTrips: 0,
          activeTrips: 0,
          totalBookings: 0,
          monthlyRevenue: 0,
          lastMonthRevenue: 0,
          upcomingSchedules: 0
        },
        revenueData: [],
        bookingsData: [],
        weeklyBookings: [],
        upcomingTrips: [],
        recentBookings: [],
        profileIncomplete: true
      })
    }

    // Get current date info
    const now = new Date()
    const currentMonth = startOfMonth(now)
    const lastMonth = startOfMonth(subMonths(now, 1))

    // Get operator statistics
    const [
      totalTrips,
      activeTrips,
      totalBookings,
      monthlyBookings,
      weeklyBookings,
      revenueData,
      upcomingSchedules,
      recentBookings
    ] = await Promise.all([
      // Total trips count
      prisma.trip.count({
        where: { operatorId: operator.id }
      }),

      // Active trips count
      prisma.trip.count({
        where: {
          operatorId: operator.id,
          isActive: true
        }
      }),

      // Total bookings across all trips
      prisma.booking.count({
        where: {
          tripSchedule: {
            trip: {
              operatorId: operator.id
            }
          }
        }
      }),

      // Monthly bookings for the last 6 months
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', b."createdAt") as month,
          COUNT(*) as bookings
        FROM "Booking" b
        JOIN "TripSchedule" ts ON b."tripScheduleId" = ts.id
        JOIN "Trip" t ON ts."tripId" = t.id
        WHERE t."operatorId" = ${operator.id}
        AND b."createdAt" >= ${subMonths(now, 6)}
        GROUP BY DATE_TRUNC('month', b."createdAt")
        ORDER BY month DESC
      `,

      // Weekly bookings for the last 7 days
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('day', b."createdAt") as day,
          COUNT(*) as bookings
        FROM "Booking" b
        JOIN "TripSchedule" ts ON b."tripScheduleId" = ts.id
        JOIN "Trip" t ON ts."tripId" = t.id
        WHERE t."operatorId" = ${operator.id}
        AND b."createdAt" >= ${startOfDay(subMonths(now, 1))}
        GROUP BY DATE_TRUNC('day', b."createdAt")
        ORDER BY day ASC
      `,

      // Revenue data for the last 6 months
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', b."createdAt") as month,
          SUM(b."totalAmountKobo") / 100.0 as revenue
        FROM "Booking" b
        JOIN "TripSchedule" ts ON b."tripScheduleId" = ts.id
        JOIN "Trip" t ON ts."tripId" = t.id
        WHERE t."operatorId" = ${operator.id}
        AND b.status = 'confirmed'
        AND b."createdAt" >= ${subMonths(now, 6)}
        GROUP BY DATE_TRUNC('month', b."createdAt")
        ORDER BY month DESC
      `,

      // Upcoming schedules (next 7 days)
      prisma.tripSchedule.count({
        where: {
          trip: {
            operatorId: operator.id
          },
          startTime: {
            gte: now,
            lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          },
          status: 'scheduled'
        }
      }),

      // Recent bookings (last 10)
      prisma.booking.findMany({
        where: {
          tripSchedule: {
            trip: {
              operatorId: operator.id
            }
          }
        },
        include: {
          tripSchedule: {
            include: {
              trip: true
            }
          },
          user: {
            select: {
              fullName: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })
    ])

    // Get average rating
    const avgRating = await prisma.review.aggregate({
      where: {
        trip: {
          operatorId: operator.id
        }
      },
      _avg: {
        rating: true
      }
    })

    // Calculate monthly revenue
    const monthlyRevenue = await prisma.$queryRaw`
      SELECT SUM(b."totalAmountKobo") / 100.0 as revenue
      FROM "Booking" b
      JOIN "TripSchedule" ts ON b."tripScheduleId" = ts.id
      JOIN "Trip" t ON ts."tripId" = t.id
      WHERE t."operatorId" = ${operator.id}
      AND b.status = 'confirmed'
      AND b."createdAt" >= ${currentMonth}
    ` as any[]

    // Calculate last month revenue for comparison
    const lastMonthRevenue = await prisma.$queryRaw`
      SELECT SUM(b."totalAmountKobo") / 100.0 as revenue
      FROM "Booking" b
      JOIN "TripSchedule" ts ON b."tripScheduleId" = ts.id
      JOIN "Trip" t ON ts."tripId" = t.id
      WHERE t."operatorId" = ${operator.id}
      AND b.status = 'confirmed'
      AND b."createdAt" >= ${lastMonth}
      AND b."createdAt" < ${currentMonth}
    ` as any[]

    // Format revenue data for charts
    const formattedRevenueData = (revenueData as any[]).map(item => ({
      month: format(new Date(item.month), 'MMM'),
      revenue: Number(item.revenue) || 0
    })).reverse()

    // Format bookings data for charts
    const formattedBookingsData = (monthlyBookings as any[]).map(item => ({
      month: format(new Date(item.month), 'MMM'),
      bookings: Number(item.bookings) || 0
    })).reverse()

    // Format weekly bookings data for charts
    const formattedWeeklyBookings = (weeklyBookings as any[]).map(item => ({
      day: format(new Date(item.day), 'EEE'),
      bookings: Number(item.bookings) || 0
    }))

    // Get upcoming trips/schedules
    const upcomingTripsData = await prisma.tripSchedule.findMany({
      where: {
        trip: {
          operatorId: operator.id
        },
        startTime: {
          gte: now,
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        },
        status: 'scheduled'
      },
      include: {
        trip: {
          include: {
            vessel: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 5
    })

    const formattedUpcomingTrips = upcomingTripsData.map((schedule: any) => ({
      id: schedule.id,
      name: schedule.trip.title,
      departure: format(schedule.startTime, 'HH:mm'),
      route: `${schedule.departurePort || 'Port'} → ${schedule.arrivalPort || 'Port'}`,
      passengers: schedule._count.bookings,
      capacity: schedule.trip.vessel?.capacity || 0,
      status: schedule.status,
      revenue: schedule.priceTiers?.[0]?.amountKobo ? Number(schedule.priceTiers[0].amountKobo) / 100 * schedule._count.bookings : 0
    }))

    return apiResponse({
      operator: {
        id: operator.id,
        name: operator.organizationName,
        verified: operator.verified,
        rating: avgRating._avg?.rating || 0,
        totalTrips,
        activeTrips,
        totalBookings,
        monthlyRevenue: Number(monthlyRevenue[0]?.revenue) || 0,
        lastMonthRevenue: Number(lastMonthRevenue[0]?.revenue) || 0,
        upcomingSchedules
      },
      revenueData: formattedRevenueData,
      bookingsData: formattedBookingsData,
      weeklyBookings: formattedWeeklyBookings,
      upcomingTrips: formattedUpcomingTrips,
      recentBookings: recentBookings.map((booking: any) => ({
        id: booking.id,
        passengerName: booking.user?.fullName || 'Unknown',
        tripName: booking.tripSchedule.trip.title,
        amount: Number(booking.totalAmountKobo) / 100,
        status: booking.status,
        createdAt: booking.createdAt
      }))
    })

  } catch (error) {
    console.error('Error fetching operator dashboard:', error)
    return apiError('Failed to fetch dashboard data', 500)
  }
}