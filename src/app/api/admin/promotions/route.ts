import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Promotion } from "@/models/Promotion";
import { requireAdminSession } from "@/lib/auth/session";

export async function GET() {
  try {
    await connectDB();
    const promotion = await Promotion.findOne().lean();
    return NextResponse.json({ success: true, promotion });
  } catch (error) {
    console.error("Admin Promotion GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load promotion" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    await connectDB();

    const promotion = await Promotion.findOneAndUpdate({}, { $set: body }, { new: true, upsert: true });
    return NextResponse.json({ success: true, message: "Promotion banner saved", promotion });
  } catch (error) {
    console.error("Admin Promotion PUT Error:", error);
    return NextResponse.json({ success: false, message: "Failed to save promotion" }, { status: 500 });
  }
}
