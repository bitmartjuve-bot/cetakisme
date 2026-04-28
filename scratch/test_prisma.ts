import { PrismaClient } from '@prisma/client'
console.log(PrismaClient)
// @ts-ignore
const p = new PrismaClient({})
console.log('Success')
