// @ts-nocheck - Prisma client types are generated at build time
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: any
}

export const prisma =
  globalForPrisma.prisma ??
  new (PrismaClient as any)({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
