import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { SiteSetting } from "@/models/SiteSetting";
import { requireAdminSession } from "@/lib/auth/session";

export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSetting.findOne().lean();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Get Settings Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load settings" }, { status: 500 });
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

    const settings = await SiteSetting.findOneAndUpdate({}, { $set: body }, { new: true, upsert: true });

    return NextResponse.json({ success: true, message: "Settings saved successfully", settings });
  } catch (error) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ success: false, message: "Failed to save settings" }, { status: 500 });
  }
}
