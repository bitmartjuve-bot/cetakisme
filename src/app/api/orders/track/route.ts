import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
      select: {
        orderNumber: true,
        customerName: true,
        status: true,
        createdAt: true,
        statusHistory: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Sanitize data: Only return first name
    const firstName = order.customerName.split(" ")[0];

    return NextResponse.json({
      ...order,
      customerName: firstName,
    });
  } catch (error) {
    console.error("Failed to track order:", error);
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
