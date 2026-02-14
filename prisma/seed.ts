// prisma/seed.ts
// Seed script for Yenagoa Boat Club Boat Cruise Booking System

// ✅ Import from single source of truth
import { prisma, UserRole, BookingStatus, PaymentStatus } from '../src/lib/prisma.client'

async function main() {
  console.log('🌊 Starting Yenagoa Boat Club database seeding...\n')

  // Clear existing data (in correct order to respect foreign keys)
  console.log('🗑️  Clearing existing data...')
  await prisma.promoCode.deleteMany()
  await prisma.review.deleteMany()
  await prisma.emailLog.deleteMany()
  await prisma.seatLock.deleteMany()
  await prisma.checkin.deleteMany()
  await prisma.webhookEvent.deleteMany()
  await prisma.manifest.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.bookingItem.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.tripSeat.deleteMany()
  await prisma.priceTier.deleteMany()
  await prisma.tripSchedule.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.vessel.deleteMany()
  await prisma.operator.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Test Users
  console.log('👥 Creating users...')
  const testUsers = await Promise.all([
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'customer@example.com',
        fullName: 'John Doe',
        phone: '+2348012345678',
        role: UserRole.customer,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'operator@bluewaters.ng',
        fullName: 'Mary Operator',
        phone: '+2348087654321',
        role: UserRole.operator,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'staff@bluewaters.ng',
        fullName: 'Staff Member',
        phone: '+2348099999999',
        role: UserRole.staff,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0000-000000000004',
        email: 'admin@bluewaters.ng',
        fullName: 'Admin User',
        phone: '+2348011111111',
        role: UserRole.admin,
        isActive: true,
      },
    }),
  ])
  console.log(`✅ Created ${testUsers.length} users`)

  // 2. Create Operators
  console.log('\n🚢 Creating operators...')
  const operators = await Promise.all([
    prisma.operator.create({
      data: {
        userId: testUsers[1].id,
        organizationName: 'Yenagoa Boat Club Marine Services',
        contactEmail: 'info@bluewaters.ng',
        contactPhone: '+2348087654321',
        verified: true,
      },
    }),
    prisma.operator.create({
      data: {
        userId: testUsers[2].id,
        organizationName: 'Bayelsa State Tourism Board',
        contactEmail: 'tourism@bayelsa.gov.ng',
        contactPhone: '+2348099999999',
        verified: true,
      },
    }),
  ])
  console.log(`✅ Created ${operators.length} operators`)

  // 3. Create Vessels
  console.log('\n⛴️  Creating vessels...')
  const vessels = await Promise.all([
    prisma.vessel.create({
      data: {
        operatorId: operators[0].id,
        name: 'MV Blue Pearl',
        registrationNo: 'BY-2024-001',
        capacity: 50,
        description: 'Luxury cruise vessel with air-conditioned cabin',
        vesselMetadata: {
          amenities: ['AC', 'Restroom', 'Sound System', 'Life Jackets'],
          maxSpeed: 25,
        },
      },
    }),
    prisma.vessel.create({
      data: {
        operatorId: operators[0].id,
        name: 'SS Ocean Breeze',
        registrationNo: 'BY-2024-002',
        capacity: 30,
        description: 'Compact speedboat for island hopping',
        vesselMetadata: {
          amenities: ['Life Jackets', 'Cooler', 'Music'],
          maxSpeed: 35,
        },
      },
    }),
    prisma.vessel.create({
      data: {
        operatorId: operators[1].id,
        name: 'Bayelsa Star',
        registrationNo: 'BY-GOV-2024-001',
        capacity: 80,
        description: 'Government-owned large capacity vessel for public tours',
        vesselMetadata: {
          amenities: ['AC', 'Restrooms', 'Food Service', 'WiFi', 'Medical Kit'],
          maxSpeed: 20,
        },
      },
    }),
  ])
  console.log(`✅ Created ${vessels.length} vessels`)

  // 4. Create Trips
  console.log('\n🗺️  Creating trips...')
  const trips = await Promise.all([
    prisma.trip.create({
      data: {
        vesselId: vessels[0].id,
        title: 'Sunset Cruise - Brass Island',
        description: 'Experience breathtaking sunset views on our evening cruise to Brass Island',
        durationMinutes: 120,
        isRecurring: true,
      },
    }),
    prisma.trip.create({
      data: {
        vesselId: vessels[1].id,
        title: 'Island Hopping Adventure',
        description: 'Visit 3 beautiful islands in one exciting day trip',
        durationMinutes: 240,
        isRecurring: true,
      },
    }),
    prisma.trip.create({
      data: {
        vesselId: vessels[2].id,
        title: 'Mangrove Safari Tour',
        description: 'Explore the rich biodiversity of Bayelsa mangrove forests',
        durationMinutes: 180,
        isRecurring: true,
      },
    }),
    prisma.trip.create({
      data: {
        vesselId: vessels[0].id,
        title: 'Private Charter - Corporate Event',
        description: 'Exclusive private charter for corporate team building',
        durationMinutes: 300,
        isRecurring: false,
      },
    }),
  ])
  console.log(`✅ Created ${trips.length} trips`)

  // 5. Create Trip Schedules (next 7 days)
  console.log('\n📅 Creating trip schedules...')
  const now = new Date()
  const schedules = []

  for (let i = 0; i < 7; i++) {
    const scheduleDate = new Date(now)
    scheduleDate.setDate(now.getDate() + i)
    scheduleDate.setHours(17, 0, 0, 0) // 5:00 PM

    // Sunset Cruise
    schedules.push(
      prisma.tripSchedule.create({
        data: {
          tripId: trips[0].id,
          startTime: scheduleDate,
          endTime: new Date(scheduleDate.getTime() + 120 * 60000),
          capacity: vessels[0].capacity,
          baseCurrency: 'NGN',
        },
      })
    )

    // Island Hopping (morning)
    const morningDate = new Date(scheduleDate)
    morningDate.setHours(9, 0, 0, 0)
    schedules.push(
      prisma.tripSchedule.create({
        data: {
          tripId: trips[1].id,
          startTime: morningDate,
          endTime: new Date(morningDate.getTime() + 240 * 60000),
          capacity: vessels[1].capacity,
          baseCurrency: 'NGN',
        },
      })
    )

    // Mangrove Safari (afternoon)
    const afternoonDate = new Date(scheduleDate)
    afternoonDate.setHours(14, 0, 0, 0)
    schedules.push(
      prisma.tripSchedule.create({
        data: {
          tripId: trips[2].id,
          startTime: afternoonDate,
          endTime: new Date(afternoonDate.getTime() + 180 * 60000),
          capacity: vessels[2].capacity,
          baseCurrency: 'NGN',
        },
      })
    )
  }

  const createdSchedules = await Promise.all(schedules)
  console.log(`✅ Created ${createdSchedules.length} trip schedules`)

  // 6. Create Price Tiers
  console.log('\n💰 Creating price tiers...')
  const priceTiers = []
  
  for (const schedule of createdSchedules) {
    // Economy Tier
    priceTiers.push(
      prisma.priceTier.create({
        data: {
          tripScheduleId: schedule.id,
          name: 'Economy',
          description: 'Standard seating with basic amenities',
          amountKobo: BigInt(500000), // ₦5,000
          capacity: Math.floor(schedule.capacity * 0.5),
          position: 1,
        },
      })
    )

    // Premium Tier
    priceTiers.push(
      prisma.priceTier.create({
        data: {
          tripScheduleId: schedule.id,
          name: 'Premium',
          description: 'Priority boarding with complimentary refreshments',
          amountKobo: BigInt(1000000), // ₦10,000
          capacity: Math.floor(schedule.capacity * 0.3),
          position: 2,
        },
      })
    )

    // VIP Tier
    priceTiers.push(
      prisma.priceTier.create({
        data: {
          tripScheduleId: schedule.id,
          name: 'VIP',
          description: 'Exclusive lounge access with full catering',
          amountKobo: BigInt(2000000), // ₦20,000
          capacity: Math.floor(schedule.capacity * 0.2),
          position: 3,
        },
      })
    )
  }

  const createdPriceTiers = await Promise.all(priceTiers)
  console.log(`✅ Created ${createdPriceTiers.length} price tiers`)

  // 7. Create Trip Seats
  console.log('\n🪑 Creating trip seats...')
  const seats = []
  
  for (const schedule of createdSchedules.slice(0, 3)) { // First 3 schedules only
    const scheduleTiers = createdPriceTiers.filter(
      (tier) => tier.tripScheduleId === schedule.id
    )

    let seatNumber = 1
    for (const tier of scheduleTiers) {
      for (let i = 0; i < (tier.capacity || 10); i++) {
        seats.push(
          prisma.tripSeat.create({
            data: {
              tripScheduleId: schedule.id,
              tierId: tier.id,
              seatLabel: `${tier.name.charAt(0)}${seatNumber.toString().padStart(2, '0')}`,
              isActive: true,
            },
          })
        )
        seatNumber++
      }
    }
  }

  const createdSeats = await Promise.all(seats)
  console.log(`✅ Created ${createdSeats.length} trip seats`)

  // 8. Create Promo Codes
  console.log('\n🎟️  Creating promo codes...')
  const promoCodes = await Promise.all([
    prisma.promoCode.create({
      data: {
        code: 'WELCOME2026',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 20,
        usageLimit: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      },
    }),
    prisma.promoCode.create({
      data: {
        code: 'EARLYBIRD',
        description: 'Early booking discount',
        discountType: 'fixed_amount',
        discountValue: 100000, // ₦1,000
        minPurchase: BigInt(500000),
        usageLimit: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        isActive: true,
      },
    }),
    prisma.promoCode.create({
      data: {
        code: 'GROUPDEAL',
        description: 'Group booking discount',
        discountType: 'percentage',
        discountValue: 15,
        minPurchase: BigInt(2000000), // Min ₦20,000
        maxDiscount: BigInt(500000), // Max ₦5,000
        perUserLimit: 2,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        isActive: true,
      },
    }),
  ])
  console.log(`✅ Created ${promoCodes.length} promo codes`)

  // 9. Create Sample Bookings
  console.log('\n📝 Creating sample bookings...')
  const booking1 = await prisma.booking.create({
    data: {
      userId: testUsers[0].id,
      tripScheduleId: createdSchedules[0].id,
      operatorId: operators[0].id,
      status: BookingStatus.confirmed,
      totalAmountKobo: BigInt(1000000),
      currency: 'NGN',
      promoCode: 'WELCOME2026',
      discountKobo: BigInt(200000),
      items: {
        create: [
          {
            priceTierId: createdPriceTiers.find(
              (t) => t.tripScheduleId === createdSchedules[0].id && t.name === 'Premium'
            )?.id,
            tripSeatId: createdSeats.find(
              (s) => s.tripScheduleId === createdSchedules[0].id
            )?.id,
            passengerName: 'John Doe',
            passengerPhone: '+2348012345678',
            ticketReference: 'BW-2026-0001',
            status: 'checked_in',
          },
        ],
      },
      payments: {
        create: {
          provider: 'metatickets',
          providerPaymentId: 'MT-2026-0001',
          status: PaymentStatus.succeeded,
          amountKobo: BigInt(1000000),
          currency: 'NGN',
        },
      },
    },
  })

  const booking2 = await prisma.booking.create({
    data: {
      userId: testUsers[0].id,
      tripScheduleId: createdSchedules[1].id,
      operatorId: operators[0].id,
      status: BookingStatus.held,
      totalAmountKobo: BigInt(500000),
      currency: 'NGN',
      holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      items: {
        create: {
          priceTierId: createdPriceTiers.find(
            (t) => t.tripScheduleId === createdSchedules[1].id && t.name === 'Economy'
          )?.id,
          passengerName: 'Jane Smith',
          passengerPhone: '+2348098765432',
          ticketReference: 'BW-2026-0002',
        },
      },
    },
  })

  console.log(`✅ Created 2 sample bookings`)

  // 10. Create Reviews
  console.log('\n⭐ Creating reviews...')
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        tripId: trips[0].id,
        userId: testUsers[0].id,
        rating: 5,
        title: 'Amazing Sunset Experience!',
        comment:
          'The sunset cruise was absolutely breathtaking. The crew was professional and friendly. Highly recommended!',
        isVerified: true,
        isPublic: true,
      },
    }),
    prisma.review.create({
      data: {
        tripId: trips[1].id,
        userId: testUsers[0].id,
        rating: 4,
        title: 'Great Island Tour',
        comment: 'Loved the island hopping experience. Could use more time at each island.',
        isVerified: true,
        isPublic: true,
        adminResponse: 'Thank you for your feedback! We will consider extending tour durations.',
        respondedAt: new Date(),
      },
    }),
  ])
  console.log(`✅ Created ${reviews.length} reviews`)

  // 11. Create Email Logs
  console.log('\n📧 Creating email logs...')
  const emailLogs = await Promise.all([
    prisma.emailLog.create({
      data: {
        userId: testUsers[0].id,
        recipient: testUsers[0].email!,
        channel: 'email',
        type: 'booking_confirmation',
        subject: 'Your Yenagoa Boat Club Booking Confirmation',
        body: 'Your booking for Sunset Cruise has been confirmed.',
        provider: 'sendgrid',
        providerMsgId: 'SG-2026-0001',
        status: 'sent',
        sentAt: new Date(),
      },
    }),
    prisma.emailLog.create({
      data: {
        userId: testUsers[0].id,
        recipient: testUsers[0].phone!,
        channel: 'sms',
        type: 'booking_reminder',
        body: 'Reminder: Your cruise departs tomorrow at 5:00 PM. Ticket: BW-2026-0001',
        provider: 'twilio',
        providerMsgId: 'TW-2026-0001',
        status: 'sent',
        sentAt: new Date(),
      },
    }),
  ])
  console.log(`✅ Created ${emailLogs.length} email logs`)

  console.log('\n✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   • ${testUsers.length} users`)
  console.log(`   • ${operators.length} operators`)
  console.log(`   • ${vessels.length} vessels`)
  console.log(`   • ${trips.length} trips`)
  console.log(`   • ${createdSchedules.length} trip schedules`)
  console.log(`   • ${createdPriceTiers.length} price tiers`)
  console.log(`   • ${createdSeats.length} trip seats`)
  console.log(`   • ${promoCodes.length} promo codes`)
  console.log(`   • 2 bookings`)
  console.log(`   • ${reviews.length} reviews`)
  console.log(`   • ${emailLogs.length} email logs`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
