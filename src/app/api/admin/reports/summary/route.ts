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
    const orders = await prisma.order.findMany({
      where: {
        createdAt: dateFilter,
      },
      select: {
        totalAmount: true,
        createdAt: true,
        isWalkIn: true,
        status: true,
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: dateFilter,
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    // Calculate summary
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === "Selesai").length;
    const cancelledOrders = orders.filter(o => o.status === "Dibatalkan").length;
    
    const onlineRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const posRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalRevenue = onlineRevenue + posRevenue;

    return NextResponse.json({
      totalRevenue,
      onlineRevenue,
      posRevenue,
      totalOrders,
      completedOrders,
      cancelledOrders,
      avgOrderValue: totalOrders > 0 ? onlineRevenue / totalOrders : 0,
      dailyData: groupDataByDate(orders, transactions),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}

function groupDataByDate(orders: any[], transactions: any[]) {
  const data: Record<string, any> = {};
  
  orders.forEach(o => {
    const date = o.createdAt.toISOString().split("T")[0];
    if (!data[date]) data[date] = { date, online: 0, pos: 0 };
    data[date].online += o.totalAmount;
  });

  transactions.forEach(t => {
    const date = t.createdAt.toISOString().split("T")[0];
    if (!data[date]) data[date] = { date, online: 0, pos: 0 };
    data[date].pos += t.totalAmount;
  });

  return Object.values(data).sort((a, b) => a.date.localeCompare(b.date));
}
