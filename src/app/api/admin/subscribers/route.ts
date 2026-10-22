import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { requireAdminSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, subscribers });
  } catch (error) {
    console.error("Admin Subscribers Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load subscribers" }, { status: 500 });
  }
}
