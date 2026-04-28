import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
const midtransClient = require('midtrans-client');

export async function POST(req: Request) {
  try {
    const notificationJson = await req.json();

    let apiClient = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-TEST',
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-TEST'
    });

    const statusResponse = await apiClient.transaction.notification(notificationJson);
    
    let orderId = statusResponse.order_id;
    let transactionStatus = statusResponse.transaction_status;
    let fraudStatus = statusResponse.fraud_status;

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let paymentStatus = "Pending";
    let orderStatus = order.status;

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'accept') {
        paymentStatus = "Success";
        orderStatus = "Pembayaran Dikonfirmasi";
      }
    } else if (transactionStatus == 'settlement') {
      paymentStatus = "Success";
      orderStatus = "Pembayaran Dikonfirmasi";
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      paymentStatus = "Failed";
      orderStatus = "Dibatalkan";
    } else if (transactionStatus == 'pending') {
      paymentStatus = "Pending";
    }

    // Update payment record
    await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        status: paymentStatus,
        transactionId: statusResponse.transaction_id,
        paymentDate: paymentStatus === "Success" ? new Date() : undefined,
      }
    });

    // Update order status if payment successful
    if (order.status !== orderStatus) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: orderStatus }
      });
      
      // Create status history
      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: orderStatus,
          notes: `Updated via Midtrans: ${transactionStatus}`,
        }
      });
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error("Failed to process notification:", error);
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 });
  }
}
