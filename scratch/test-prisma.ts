import { prisma } from "../src/lib/prisma";

async function test() {
  try {
    console.log("Testing Prisma connection...");
    const products = await prisma.product.findMany();
    console.log("Success! Found products:", products.length);
    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}

test();
