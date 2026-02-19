/**
 * Mock Data for Bayelsa Boat Club
 * Used for rapid UI development and testing
 * Replace with real API calls in Phase 2
 */

export interface MockVessel {
  id: string
  name: string
  type: 'speedboat' | 'ferry' | 'luxury'
  capacity: number
  image: string
  amenities: string[]
  safetyRating: number
}

export interface MockSchedule {
  id: string
  departureTime: string
  arrivalTime: string
  availableSeats: number
  price: number
  status: 'available' | 'filling-fast' | 'sold-out' | 'cancelled'
}

export interface MockTrip {
  id: string
  name: string
  slug: string
  departure: {
    location: string
    jetty: string
    coordinates: { lat: number; lng: number }
  }
  arrival: {
    location: string
    jetty: string
    coordinates: { lat: number; lng: number }
  }
  duration: number // minutes
  distance: number // km
  basePrice: number
  description: string
  highlights: string[]
  vessel: MockVessel
  schedules: MockSchedule[]
  images: string[]
  rating: number
  reviewCount: number
  popularityScore: number
  // optional trip-level route (used by operator UI mocks)
  routeName?: string
}

export interface MockBooking {
  id: string
  bookingReference: string
  tripId: string
  tripName: string
  scheduleId: string
  departureDate: string
  departureTime: string
  arrivalTime: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'checked-in'
  passengers: {
    firstName: string
    lastName: string
    email: string
    phone: string
    seatNumber?: string
  }[]
  totalAmount: number
  paymentStatus: 'paid' | 'pending' | 'refunded'
  qrCode: string // base64 or URL
  createdAt: string
  departure: string
  arrival: string
}

// Mock Vessels
export const mockVessels: MockVessel[] = [
  {
    id: 'vessel-1',
    name: 'MV Bayelsa Queen',
    type: 'ferry',
    capacity: 120,
    image: '/vessels/bayelsa-queen.jpg',
    amenities: ['Air Conditioning', 'WiFi', 'Restrooms', 'Snack Bar', 'Life Jackets', 'First Aid'],
    safetyRating: 5,
  },
  {
    id: 'vessel-2',
    name: 'Yenagoa Express',
    type: 'speedboat',
    capacity: 45,
    image: '/vessels/yenagoa-express.jpg',
    amenities: ['Life Jackets', 'First Aid', 'Storage Compartments'],
    safetyRating: 5,
  },
  {
    id: 'vessel-3',
    name: 'Delta Princess',
    type: 'luxury',
    capacity: 80,
    image: '/vessels/delta-princess.jpg',
    amenities: ['VIP Lounge', 'Air Conditioning', 'WiFi', 'Entertainment System', 'Restrooms', 'Snack Bar', 'Life Jackets'],
    safetyRating: 5,
  },
  {
    id: 'vessel-4',
    name: 'River Runner',
    type: 'speedboat',
    capacity: 35,
    image: '/vessels/river-runner.jpg',
    amenities: ['Life Jackets', 'First Aid', 'Weather Protection'],
    safetyRating: 4,
  },
]

// Mock Trips
export const mockTrips: MockTrip[] = [
  {
    id: 'trip-1',
    name: 'Yenagoa to Port Harcourt Express',
    slug: 'yenagoa-port-harcourt',
    routeName: 'Yenagoa → Port Harcourt',
    departure: {
      location: 'Yenagoa',
      jetty: 'Yenagoa Central Jetty',
      coordinates: { lat: 4.9267, lng: 6.2676 },
    },
    arrival: {
      location: 'Port Harcourt',
      jetty: 'Port Harcourt Marina',
      coordinates: { lat: 4.8156, lng: 7.0498 },
    },
    duration: 90,
    distance: 75,
    basePrice: 5000,
    description: 'Experience a smooth and comfortable journey from Yenagoa to Port Harcourt. Our modern vessels ensure safety and comfort throughout your trip.',
    highlights: [
      'Daily departures',
      'Comfortable seating',
      'Onboard refreshments',
      'Professional crew',
      'Safety certified',
    ],
    vessel: mockVessels[0],
    schedules: [
      {
        id: 'sch-1-1',
        departureTime: '08:00',
        arrivalTime: '09:30',
        availableSeats: 45,
        price: 5000,
        status: 'available',
      },
      {
        id: 'sch-1-2',
        departureTime: '11:00',
        arrivalTime: '12:30',
        availableSeats: 12,
        price: 5000,
        status: 'filling-fast',
      },
      {
        id: 'sch-1-3',
        departureTime: '14:00',
        arrivalTime: '15:30',
        availableSeats: 78,
        price: 5000,
        status: 'available',
      },
      {
        id: 'sch-1-4',
        departureTime: '17:00',
        arrivalTime: '18:30',
        availableSeats: 0,
        price: 5500,
        status: 'sold-out',
      },
    ],
    images: [
      '/trips/yenagoa-ph-1.jpg',
      '/trips/yenagoa-ph-2.jpg',
      '/trips/yenagoa-ph-3.jpg',
    ],
    rating: 4.8,
    reviewCount: 324,
    popularityScore: 95,
  },
  {
    id: 'trip-2',
    name: 'Yenagoa to Brass Scenic Route',
    slug: 'yenagoa-brass-scenic',
    routeName: 'Yenagoa → Brass',
    departure: {
      location: 'Yenagoa',
      jetty: 'Yenagoa Central Jetty',
      coordinates: { lat: 4.9267, lng: 6.2676 },
    },
    arrival: {
      location: 'Brass',
      jetty: 'Brass Island Terminal',
      coordinates: { lat: 4.3067, lng: 6.2429 },
    },
    duration: 120,
    distance: 95,
    basePrice: 6500,
    description: 'Enjoy the scenic beauty of the Niger Delta waterways on this popular route to Brass Island. Perfect for tourists and business travelers alike.',
    highlights: [
      'Scenic river views',
      'Wildlife spotting opportunities',
      'Luxury vessel',
      'Onboard entertainment',
      'Complimentary snacks',
    ],
    vessel: mockVessels[2],
    schedules: [
      {
        id: 'sch-2-1',
        departureTime: '07:00',
        arrivalTime: '09:00',
        availableSeats: 35,
        price: 6500,
        status: 'available',
      },
      {
        id: 'sch-2-2',
        departureTime: '15:00',
        arrivalTime: '17:00',
        availableSeats: 52,
        price: 6500,
        status: 'available',
      },
    ],
    images: [
      '/trips/yenagoa-brass-1.jpg',
      '/trips/yenagoa-brass-2.jpg',
      '/trips/yenagoa-brass-3.jpg',
    ],
    rating: 4.9,
    reviewCount: 187,
    popularityScore: 88,
  },
  {
    id: 'trip-3',
    name: 'Port Harcourt to Yenagoa',
    slug: 'port-harcourt-yenagoa',
    routeName: 'Port Harcourt → Yenagoa',
    departure: {
      location: 'Port Harcourt',
      jetty: 'Port Harcourt Marina',
      coordinates: { lat: 4.8156, lng: 7.0498 },
    },
    arrival: {
      location: 'Yenagoa',
      jetty: 'Yenagoa Central Jetty',
      coordinates: { lat: 4.9267, lng: 6.2676 },
    },
    duration: 90,
    distance: 75,
    basePrice: 5000,
    description: 'Return journey from Port Harcourt to Yenagoa. Multiple daily departures for your convenience.',
    highlights: [
      'Daily departures',
      'Express service',
      'Modern vessels',
      'Professional crew',
      'Safety first',
    ],
    vessel: mockVessels[0],
    schedules: [
      {
        id: 'sch-3-1',
        departureTime: '09:00',
        arrivalTime: '10:30',
        availableSeats: 67,
        price: 5000,
        status: 'available',
      },
      {
        id: 'sch-3-2',
        departureTime: '12:00',
        arrivalTime: '13:30',
        availableSeats: 89,
        price: 5000,
        status: 'available',
      },
      {
        id: 'sch-3-3',
        departureTime: '15:00',
        arrivalTime: '16:30',
        availableSeats: 23,
        price: 5000,
        status: 'filling-fast',
      },
      {
        id: 'sch-3-4',
        departureTime: '18:00',
        arrivalTime: '19:30',
        availableSeats: 45,
        price: 5500,
        status: 'available',
      },
    ],
    images: [
      '/trips/ph-yenagoa-1.jpg',
      '/trips/ph-yenagoa-2.jpg',
    ],
    rating: 4.7,
    reviewCount: 298,
    popularityScore: 92,
  },
  {
    id: 'trip-4',
    name: 'Brass to Yenagoa Return',
    slug: 'brass-yenagoa',
    routeName: 'Brass → Yenagoa',
    departure: {
      location: 'Brass',
      jetty: 'Brass Island Terminal',
      coordinates: { lat: 4.3067, lng: 6.2429 },
    },
    arrival: {
      location: 'Yenagoa',
      jetty: 'Yenagoa Central Jetty',
      coordinates: { lat: 4.9267, lng: 6.2676 },
    },
    duration: 120,
    distance: 95,
    basePrice: 6500,
    description: 'Return from Brass Island to Yenagoa with our premium service.',
    highlights: [
      'Comfortable journey',
      'Scenic views',
      'Refreshments included',
      'Experienced crew',
    ],
    vessel: mockVessels[2],
    schedules: [
      {
        id: 'sch-4-1',
        departureTime: '10:00',
        arrivalTime: '12:00',
        availableSeats: 42,
        price: 6500,
        status: 'available',
      },
      {
        id: 'sch-4-2',
        departureTime: '16:00',
        arrivalTime: '18:00',
        availableSeats: 8,
        price: 6500,
        status: 'filling-fast',
      },
    ],
    images: [
      '/trips/brass-yenagoa-1.jpg',
    ],
    rating: 4.8,
    reviewCount: 156,
    popularityScore: 85,
  },
  {
    id: 'trip-5',
    name: 'Yenagoa to Warri Express',
    slug: 'yenagoa-warri',
    routeName: 'Yenagoa → Warri',
    departure: {
      location: 'Yenagoa',
      jetty: 'Yenagoa Central Jetty',
      coordinates: { lat: 4.9267, lng: 6.2676 },
    },
    arrival: {
      location: 'Warri',
      jetty: 'Warri River Terminal',
      coordinates: { lat: 5.5167, lng: 5.7500 },
    },
    duration: 75,
    distance: 65,
    basePrice: 4500,
    description: 'Fast and reliable service to Warri. Perfect for daily commuters and business travelers.',
    highlights: [
      'Express service',
      'Multiple departures',
      'Affordable pricing',
      'Reliable schedule',
    ],
    vessel: mockVessels[1],
    schedules: [
      {
        id: 'sch-5-1',
        departureTime: '07:30',
        arrivalTime: '08:45',
        availableSeats: 28,
        price: 4500,
        status: 'available',
      },
      {
        id: 'sch-5-2',
        departureTime: '13:00',
        arrivalTime: '14:15',
        availableSeats: 31,
        price: 4500,
        status: 'available',
      },
      {
        id: 'sch-5-3',
        departureTime: '16:30',
        arrivalTime: '17:45',
        availableSeats: 15,
        price: 4500,
        status: 'filling-fast',
      },
    ],
    images: [
      '/trips/yenagoa-warri-1.jpg',
      '/trips/yenagoa-warri-2.jpg',
    ],
    rating: 4.6,
    reviewCount: 412,
    popularityScore: 90,
  },
  {
    id: 'trip-6',
    name: 'Yenagoa Island Hopping Tour',
    slug: 'yenagoa-island-tour',
    departure: {
      location: 'Yenagoa',
      jetty: 'Yenagoa Central Jetty',
      coordinates: { lat: 4.9267, lng: 6.2676 },
    },
    arrival: {
      location: 'Yenagoa',
      jetty: 'Yenagoa Central Jetty',
      coordinates: { lat: 4.9267, lng: 6.2676 },
    },
    duration: 180,
    distance: 45,
    basePrice: 8500,
    description: 'Experience the beauty of the Niger Delta with our guided island hopping tour. Visit multiple scenic spots and learn about local culture.',
    highlights: [
      'Guided tour',
      'Multiple island stops',
      'Cultural experience',
      'Photography opportunities',
      'Lunch included',
      'Small group size',
    ],
    vessel: mockVessels[3],
    schedules: [
      {
        id: 'sch-6-1',
        departureTime: '09:00',
        arrivalTime: '12:00',
        availableSeats: 18,
        price: 8500,
        status: 'available',
      },
      {
        id: 'sch-6-2',
        departureTime: '14:00',
        arrivalTime: '17:00',
        availableSeats: 6,
        price: 8500,
        status: 'filling-fast',
      },
    ],
    images: [
      '/trips/island-tour-1.jpg',
      '/trips/island-tour-2.jpg',
      '/trips/island-tour-3.jpg',
      '/trips/island-tour-4.jpg',
    ],
    rating: 5.0,
    reviewCount: 89,
    popularityScore: 78,
  },
]

// Mock Bookings (for authenticated user)
export const mockBookings: MockBooking[] = [
  {
    id: 'booking-1',
    bookingReference: 'YBC-001-2602',
    tripId: 'trip-1',
    tripName: 'Yenagoa to Port Harcourt Express',
    scheduleId: 'sch-1-1',
    departureDate: '2026-02-20',
    departureTime: '08:00',
    arrivalTime: '09:30',
    status: 'confirmed',
    passengers: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+234 801 234 5678',
        seatNumber: 'A12',
      },
    ],
    totalAmount: 5000,
    paymentStatus: 'paid',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    createdAt: '2026-02-14T10:30:00Z',
    departure: 'Yenagoa Central Jetty',
    arrival: 'Port Harcourt Marina',
  },
  {
    id: 'booking-2',
    bookingReference: 'YBC-002-2602',
    tripId: 'trip-2',
    tripName: 'Yenagoa to Brass Scenic Route',
    scheduleId: 'sch-2-1',
    departureDate: '2026-02-22',
    departureTime: '07:00',
    arrivalTime: '09:00',
    status: 'confirmed',
    passengers: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+234 801 234 5678',
        seatNumber: 'B08',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '+234 802 345 6789',
        seatNumber: 'B09',
      },
    ],
    totalAmount: 13000,
    paymentStatus: 'paid',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    createdAt: '2026-02-13T14:22:00Z',
    departure: 'Yenagoa Central Jetty',
    arrival: 'Brass Island Terminal',
  },
  {
    id: 'booking-3',
    bookingReference: 'YBC-003-2601',
    tripId: 'trip-5',
    tripName: 'Yenagoa to Warri Express',
    scheduleId: 'sch-5-1',
    departureDate: '2026-01-15',
    departureTime: '07:30',
    arrivalTime: '08:45',
    status: 'completed',
    passengers: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+234 801 234 5678',
        seatNumber: 'C05',
      },
    ],
    totalAmount: 4500,
    paymentStatus: 'paid',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    createdAt: '2026-01-10T09:15:00Z',
    departure: 'Yenagoa Central Jetty',
    arrival: 'Warri River Terminal',
  },
  {
    id: 'booking-4',
    bookingReference: 'YBC-004-2602',
    tripId: 'trip-1',
    tripName: 'Yenagoa to Port Harcourt Express',
    scheduleId: 'sch-1-2',
    departureDate: '2026-02-25',
    departureTime: '11:00',
    arrivalTime: '12:30',
    status: 'pending',
    passengers: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+234 801 234 5678',
      },
    ],
    totalAmount: 5000,
    paymentStatus: 'pending',
    qrCode: '',
    createdAt: '2026-02-14T16:45:00Z',
    departure: 'Yenagoa Central Jetty',
    arrival: 'Port Harcourt Marina',
  },
  {
    id: 'booking-5',
    bookingReference: 'YBC-005-2601',
    tripId: 'trip-3',
    tripName: 'Port Harcourt to Yenagoa',
    scheduleId: 'sch-3-1',
    departureDate: '2026-01-20',
    departureTime: '09:00',
    arrivalTime: '10:30',
    status: 'cancelled',
    passengers: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+234 801 234 5678',
      },
    ],
    totalAmount: 5000,
    paymentStatus: 'refunded',
    qrCode: '',
    createdAt: '2026-01-18T11:20:00Z',
    departure: 'Port Harcourt Marina',
    arrival: 'Yenagoa Central Jetty',
  },
]

// Helper functions
export function getTripById(id: string): MockTrip | undefined {
  return mockTrips.find((trip) => trip.id === id)
}

export function getTripBySlug(slug: string): MockTrip | undefined {
  return mockTrips.find((trip) => trip.slug === slug)
}

export function getBookingById(id: string): MockBooking | undefined {
  return mockBookings.find((booking) => booking.id === id)
}

export function getBookingByReference(ref: string): MockBooking | undefined {
  return mockBookings.find((booking) => booking.bookingReference === ref)
}

export function searchTrips(query: {
  from?: string
  to?: string
  date?: string
  maxPrice?: number
}): MockTrip[] {
  let results = [...mockTrips]

  if (query.from) {
    const from = query.from.toLowerCase()
    results = results.filter((trip) =>
      trip.departure.location.toLowerCase().includes(from)
    )
  }

  if (query.to) {
    const to = query.to.toLowerCase()
    results = results.filter((trip) =>
      trip.arrival.location.toLowerCase().includes(to)
    )
  }

  if (query.maxPrice !== undefined) {
    results = results.filter((trip) => trip.basePrice <= query.maxPrice!)
  }

  // Sort by popularity
  results.sort((a, b) => b.popularityScore - a.popularityScore)

  return results
}

export function getPopularTrips(limit: number = 6): MockTrip[] {
  return [...mockTrips]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

export function getUpcomingBookings(): MockBooking[] {
  const now = new Date()
  return mockBookings
    .filter((booking) => {
      const departureDate = new Date(booking.departureDate)
      return departureDate >= now && booking.status === 'confirmed'
    })
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
}

export function getPastBookings(): MockBooking[] {
  const now = new Date()
  return mockBookings
    .filter((booking) => {
      const departureDate = new Date(booking.departureDate)
      return departureDate < now || booking.status === 'completed'
    })
    .sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime())
}
