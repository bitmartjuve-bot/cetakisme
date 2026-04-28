import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
const midtransClient = require('midtrans-client');

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Initialize Snap API
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-TEST',
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-TEST'
    });

    const itemDetails = order.items.map(item => ({
      id: item.productId,
      price: item.price,
      quantity: item.quantity,
      name: `${item.product.name} - ${item.size}`
    }));

    let parameter = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: order.totalAmount
      },
      customer_details: {
        first_name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail || undefined,
      },
      item_details: itemDetails
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Save payment record if not exists
    await prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        amount: order.totalAmount,
      },
      create: {
        orderId: order.id,
        method: "Midtrans Snap",
        status: "Pending",
        amount: order.totalAmount,
      }
    });

    return NextResponse.json({ token: transaction.token });
  } catch (error) {
    console.error("Failed to create token:", error);
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 });
  }
}
