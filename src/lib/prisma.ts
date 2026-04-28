import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Mengambil URL dari env atau hardcoded
const connectionString = process.env.DATABASE_URL || "postgresql://postgres.xyxqajklkptowqbbijpv:Cetakismeorg1234*@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres"

console.log('Connecting to database with URL:', connectionString.split('@')[1]); // Log part of URL for debugging

const pool = new pg.Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma