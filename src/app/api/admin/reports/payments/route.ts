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
    const payments = await prisma.payment.findMany({
      where: {
        createdAt: dateFilter,
      },
      select: {
        method: true,
        amount: true,
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: dateFilter,
      },
      select: {
        paymentMethod: true,
        totalAmount: true,
      },
    });

    const methods: Record<string, number> = {};

    payments.forEach(p => {
      const method = p.method || "Other";
      methods[method] = (methods[method] || 0) + p.amount;
    });

    transactions.forEach(t => {
      const method = t.paymentMethod || "Other";
      methods[method] = (methods[method] || 0) + t.totalAmount;
    });

    const report = Object.entries(methods).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate payment report" }, { status: 500 });
  }
}
