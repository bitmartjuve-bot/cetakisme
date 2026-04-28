import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids, status } = await req.json();

  if (!ids || !Array.isArray(ids) || !status) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    await prisma.$transaction([
      prisma.order.updateMany({
        where: { id: { in: ids } },
        data: { status },
      }),
      ...ids.map((id: string) =>
        prisma.orderStatusHistory.create({
          data: {
            orderId: id,
            status,
            notes: "Bulk status update by admin",
          },
        })
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update orders" }, { status: 500 });
  }
}
