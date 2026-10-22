import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/models/Order";

export async function POST(req: Request) {
  try {
    const { orderNumber, email } = await req.json();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, message: "Order number and email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne({
      orderNumber: orderNumber.trim(),
      "customer.email": email.toLowerCase().trim(),
    }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "No order found with the provided details" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        items: order.items,
        total: order.total,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        statusHistory: order.statusHistory,
      },
    });
  } catch (error) {
    console.error("Track Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to track order" },
      { status: 500 }
    );
  }
}
