import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { ContactInquiry } from "@/models/ContactInquiry";
import { requireAdminSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error("Admin Inquiries Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load inquiries" }, { status: 500 });
  }
}
