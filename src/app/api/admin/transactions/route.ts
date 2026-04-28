import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = {};
  if (from && to) {
    where.createdAt = {
      gte: new Date(from),
      lte: new Date(to),
    };
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    location,
    customerName,
    customerPhone,
    items,
    totalAmount,
    discount,
    paymentMethod,
    amountPaid,
    change,
  } = body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Transaction
      const transaction = await tx.transaction.create({
        data: {
          location,
          customerName,
          customerPhone,
          totalAmount,
          discount,
          paymentMethod,
          amountPaid,
          change,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Reduce Stock for each item
      for (const item of items) {
        // Find variant (for POS, we usually assume a specific variant or just the first available if not specified)
        // But the prompt says "click product -> add to cart". 
        // In the schema, TransactionItem has productId, but not variantId.
        // Let's assume we reduce stock from the FIRST variant if no specific variant is selected in POS.
        // Or better, let's update TransactionItem to include variantId if possible.
        // Looking at schema: TransactionItem has productId.
        // I'll try to find a variant of that product and reduce its stock.
        
        const variant = await tx.productVariant.findFirst({
          where: { productId: item.productId },
        });

        if (variant) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: { decrement: item.quantity } },
          });

          await tx.stockHistory.create({
            data: {
              variantId: variant.id,
              change: -item.quantity,
              reason: `POS Transaction ${transaction.id}`,
            },
          });
        }
      }

      return transaction;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 });
  }
}
