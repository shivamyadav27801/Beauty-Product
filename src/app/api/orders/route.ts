import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/models/Order";
import { getServerSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

    if (isAdmin) {
      const status = searchParams.get("status");
      const search = searchParams.get("search");
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");

      const query: any = {};
      if (status && status !== "ALL") {
        query.orderStatus = status;
      }
      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: "i" } },
          { "customer.fullName": { $regex: search, $options: "i" } },
          { "customer.email": { $regex: search, $options: "i" } },
        ];
      }

      const skip = (page - 1) * limit;
      const [orders, total] = await Promise.all([
        Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Order.countDocuments(query),
      ]);

      return NextResponse.json({
        success: true,
        orders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Customer orders
    const orders = await Order.find({ user: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Orders API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load orders" },
      { status: 500 }
    );
  }
}
