/**
 * Root API Route - AstroMANIA Enterprises
 *
 * GET /api - Welcome endpoint with project information and branding
 */

import { NextRequest } from 'next/server'
import { apiResponse } from '@/lib/api-auth'

const BRANDING_ASCII = `"
       d8888          888                    888b     d888        d8888 888b    888 8888888        d8888
      d88888          888                    8888b   d8888       d88888 8888b   888   888         d88888
     d88P888          888                    88888b.d88888      d88P888 88888b  888   888        d88P888
    d88P 888 .d8888b  888888 888d888 .d88b.  888Y88888P888     d88P 888 888Y88b 888   888       d88P 888
   d88P  888 88K      888    888P"  d88""88b 888 Y888P 888    d88P  888 888 Y88b888   888      d88P  888
  d88P   888 "Y8888b. 888    888    888  888 888  Y8P  888   d88P   888 888  Y88888   888     d88P   888
 d8888888888      X88 Y88b.  888    Y88..88P 888   "   888  d8888888888 888   Y8888   888    d8888888888
d88P     888  88888P'  "Y888 888     "Y88P"  888       888 d88P     888 888    Y888 8888888 d88P     888














































8888888888          888                                     d8b
888                 888                                     Y8P
888                 888
8888888    88888b.  888888 .d88b.  888d888 88888b.  888d888 888 .d8888b   .d88b.
888        888 "88b 888   d8P  Y8b 888P"   888 "88b 888P"   888 88K      d8P  Y8b
888        888  888 888   88888888 888     888  888 888     888 "Y8888b. 88888888
888        888  888 Y88b. Y8b.     888     888 d88P 888     888      X88 Y8b.
8888888888 888  888  "Y888 "Y8888  888     88888P"  888     888  88888P'  "Y8888
                                           888
                                           888
                                           888
"`

const LICENSE_INFO = {
  license: "MIT License",
  copyright: "Copyright (c) 2026 AstroMANIA Enterprises",
  developer: "Developed by: Precious Okoyen (x17green)",
  permissions: [
    "Free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
    "Permission granted to any person obtaining a copy of this software"
  ],
  conditions: [
    "The above copyright notice and this permission notice shall be included in all copies",
    "or substantial portions of the Software"
  ],
  warranty: "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED",
  liability: "IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY"
}

const PROJECT_INFO = {
  name: "Blue Waters - Bayelsa Boat Club Boat Cruise System",
  version: "1.0.0",
  description: "Advanced seat management and booking system for boat cruises in Bayelsa, Nigeria",
  features: [
    "Real-time seat booking and management",
    "Operator dashboard with analytics",
    "Admin panel for system management",
    "Supabase authentication integration",
    "Prisma ORM with PostgreSQL",
    "Next.js 16 with TypeScript",
    "Glassmorphism design system",
    "Mobile-responsive interface"
  ],
  technologies: [
    "Next.js 16 (App Router)",
    "TypeScript",
    "Prisma ORM",
    "PostgreSQL",
    "Supabase Auth",
    "Tailwind CSS",
    "shadcn/ui",
    "Framer Motion",
    "Recharts",
    "React Hook Form"
  ],
  endpoints: {
    public: [
      "/api (this endpoint)",
      "/api/trips",
      "/api/bookings"
    ],
    authenticated: [
      "/api/operator/dashboard",
      "/api/admin/*"
    ]
  }
}

/**
 * GET /api
 * Welcome endpoint with project information and branding
 */
export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return apiResponse({
    branding: BRANDING_ASCII,
    project: PROJECT_INFO,
    license: LICENSE_INFO,
    api: {
      version: "v1",
      baseUrl,
      documentation: `${baseUrl}/docs/api.md`,
      status: "operational",
      timestamp: new Date().toISOString(),
      endpoints: PROJECT_INFO.endpoints
    },
    contact: {
      company: "AstroMANIA Enterprises",
      developer: "Precious Okoyen (x17green)",
      year: "2026"
    },
    message: "Welcome to Blue Waters API - Bayelsa Boat Cruise Booking System"
  })
}