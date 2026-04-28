import { defineConfig } from '@prisma/config';
import "dotenv/config"; // Ini baris tambahan agar dia bisa baca file .env di atas

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});