import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { Providers } from '@/src/components/providers'

const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Bayelsa Boat Club - Boat Booking Platform | Ministry of Marine and Blue Economy',
  description: 'Book safe, reliable, and affordable boat trips across Bayelsa waterways. Experience the beauty of water travel with Bayelsa Boat Club.',
  keywords: 'boat booking, bayelsa, water transport, cruise, boat rental',
  openGraph: {
    title: 'Bayelsa Boat Club - Boat Booking Platform',
    description: 'Book safe, reliable, and affordable boat trips across Bayelsa waterways',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
