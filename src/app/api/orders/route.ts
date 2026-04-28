import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      customerName, 
      customerPhone, 
      customerEmail, 
      pickupType, 
      notes,
      items, 
      design,
      totalAmount 
    } = body;

    // Generate Order Number: CTK-YYYYMMDD-XXXX
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
    
    // Find count of orders today to generate sequence
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const countToday = await prisma.order.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        }
      }
    });
    
    const sequence = (countToday + 1).toString().padStart(4, "0");
    const orderNumber = `CTK-${dateString}-${sequence}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        isWalkIn: false,
        status: "Menunggu Pembayaran",
        pickupType,
        totalAmount,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          }))
        },
        design: design ? {
          create: {
            fileUrl: design.fileUrl || "",
            placement: design.placement || "Depan",
            notes: design.notes || ""
          }
        } : undefined,
      },
      include: {
        items: true,
        design: true,
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
