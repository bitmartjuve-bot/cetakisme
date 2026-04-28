import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

// Fix untuk Turbopack/Windows: Jika DATABASE_URL terbaca sebagai string "undefined", hapus agar fallback bekerja
if (process.env.DATABASE_URL === 'undefined' || process.env.DATABASE_URL === '') {
  delete process.env.DATABASE_URL;
}

const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl !== 'undefined' && envUrl !== '') {
    return envUrl;
  }
  // Gunakan path absolut untuk dev.db
  const dbPath = path.resolve(process.cwd(), 'dev.db').replace(/\\/g, '/');
  return `file:${dbPath}`;
};

const url = getDatabaseUrl();

// Force re-initialization in dev to clear broken state
if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).prisma = undefined;
}

// Di Prisma 7, PrismaLibSql menerima Config object
const adapter = new PrismaLibSql({ url });


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });


if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;