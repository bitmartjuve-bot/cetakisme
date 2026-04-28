import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import "dotenv/config"
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Inisialisasi Prisma Client dengan adapter PostgreSQL untuk Prisma 7
const connectionString = `${process.env.DATABASE_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')

  // 0. Menghapus data lama agar tidak terjadi duplikasi saat di-seed ulang
  await prisma.stockHistory.deleteMany()
  await prisma.transactionItem.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.orderStatusHistory.deleteMany()
  await prisma.orderDesign.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.setting.deleteMany()
  await prisma.user.deleteMany()

  console.log('Cleared existing data.')

  // 1. Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cetakisme.com' },
    update: {},
    create: {
      email: 'admin@cetakisme.com',
      name: 'Admin Cetakisme',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // 2. Seed Settings
  const settingsData = [
    { key: 'store_name', value: 'Cetakisme' },
    { key: 'store_tagline', value: 'Apply your Imagination' },
    { key: 'store_address_1', value: 'Lingkungan IV, Tumumpa Dua, Tuminting, Manado City, North Sulawesi 95239' },
    { key: 'store_address_2', value: 'Paniki Bawah, Mapanget, Manado City, North Sulawesi 95256' },
    { key: 'store_whatsapp', value: '+6285156103411' },
    { key: 'store_instagram', value: '@cetakisme' },
    { key: 'store_facebook', value: 'Cetakisme' },
    { key: 'store_tiktok', value: '@cetakisme' },
    { key: 'min_order_default', value: '12' },
  ]

  for (const setting of settingsData) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    })
  }

  // 3. Seed Products
  const productsData = [
    { name: 'Kaos Oblong', price: 45000 },
    { name: 'Polo Shirt', price: 75000 },
    { name: 'Hoodie', price: 120000 },
  ]

  const createdProducts = []
  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        description: `Bahan berkualitas untuk ${p.name}`,
        variants: {
          create: [
            { size: 'M', color: 'Hitam', stock: 50 },
            { size: 'L', color: 'Hitam', stock: 50 },
            { size: 'M', color: 'Putih', stock: 50 },
            { size: 'L', color: 'Putih', stock: 50 },
          ],
        },
      },
    })
    createdProducts.push(product)
  }

  // 4. Seed Orders
  // Order 1: Online Lunas
  await prisma.order.create({
    data: {
      orderNumber: 'CTK-20240115-0001',
      customerName: 'Budi Santoso',
      customerPhone: '08123456789',
      customerEmail: 'budi@example.com',
      isWalkIn: false,
      status: 'Dalam Produksi',
      pickupType: 'Kirim',
      totalAmount: 45000 * 12,
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            size: 'M',
            color: 'Hitam',
            quantity: 12,
            price: 45000,
          },
        ],
      },
      payment: {
        create: {
          method: 'Transfer',
          status: 'Success',
          amount: 45000 * 12,
        },
      },
    },
  })

  // Order 2: Online Pending
  await prisma.order.create({
    data: {
      orderNumber: 'CTK-20240115-0002',
      customerName: 'Siti Aminah',
      customerPhone: '08987654321',
      isWalkIn: false,
      status: 'Menunggu Pembayaran',
      pickupType: 'Tumumpa',
      totalAmount: 120000 * 12,
      items: {
        create: [
          {
            productId: createdProducts[2].id,
            size: 'L',
            color: 'Putih',
            quantity: 12,
            price: 120000,
          },
        ],
      },
      payment: {
        create: {
          method: 'QRIS',
          status: 'Pending',
          amount: 120000 * 12,
        },
      },
    },
  })

  // Order 3: Walk-in Selesai
  await prisma.order.create({
    data: {
      orderNumber: 'CTK-20240115-0003',
      customerName: 'Andi Walkin',
      customerPhone: '08112233445',
      isWalkIn: true,
      status: 'Selesai',
      pickupType: 'Paniki',
      totalAmount: 75000 * 2,
      items: {
        create: [
          {
            productId: createdProducts[1].id,
            size: 'M',
            color: 'Hitam',
            quantity: 2,
            price: 75000,
          },
        ],
      },
      payment: {
        create: {
          method: 'Tunai',
          status: 'Success',
          amount: 75000 * 2,
        },
      },
    },
  })

  console.log('Seed data successfully inserted!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })