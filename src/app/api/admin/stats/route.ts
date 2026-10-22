import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { ContactInquiry } from "@/models/ContactInquiry";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { requireAdminSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const [
      totalOrders,
      ordersRevenue,
      totalProducts,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      lowStockProducts,
      inquiriesCount,
      subscribersCount,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: { $in: ["PAID", "PENDING"] }, orderStatus: { $ne: "CANCELLED" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Product.countDocuments(),
      User.countDocuments({ role: "CUSTOMER" }),
      Order.countDocuments({ orderStatus: { $in: ["PENDING", "CONFIRMED", "PROCESSING"] } }),
      Order.countDocuments({ orderStatus: "DELIVERED" }),
      Product.countDocuments({ stock: { $lte: 10 } }),
      ContactInquiry.countDocuments(),
      NewsletterSubscriber.countDocuments({ isActive: true }),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const totalRevenue = ordersRevenue[0]?.total || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        deliveredOrders,
        lowStockProducts,
        inquiriesCount,
        subscribersCount,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
