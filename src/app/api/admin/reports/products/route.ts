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

  const dateFilter: any = {};
  if (from && to) {
    dateFilter.gte = new Date(from);
    dateFilter.lte = new Date(to);
  }

  try {
    // Top products from Orders
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: { createdAt: dateFilter },
      },
      include: { product: true },
    });

    // Top products from Transactions (POS)
    const transactionItems = await prisma.transactionItem.findMany({
      where: {
        transaction: { createdAt: dateFilter },
      },
      include: { product: true },
    });

    const products: Record<string, any> = {};

    [...orderItems, ...transactionItems].forEach(item => {
      const id = item.productId;
      if (!products[id]) {
        products[id] = {
          id,
          name: item.product.name,
          units: 0,
          revenue: 0,
        };
      }
      products[id].units += item.quantity;
      products[id].revenue += item.price * item.quantity;
    });

    const sortedProducts = Object.values(products).sort((a, b) => b.units - a.units);
    const totalRevenue = sortedProducts.reduce((sum, p) => sum + p.revenue, 0);

    const report = sortedProducts.map(p => ({
      ...p,
      percentage: totalRevenue > 0 ? (p.revenue / totalRevenue) * 100 : 0,
    }));

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate product report" }, { status: 500 });
  }
}
