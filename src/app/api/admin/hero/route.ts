import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { HeroSlide } from "@/models/HeroSlide";
import { requireAdminSession } from "@/lib/auth/session";

export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    console.error("Admin Hero GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to load hero slides" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    await connectDB();

    const slide = await HeroSlide.create(body);
    return NextResponse.json({ success: true, message: "Hero slide created", slide });
  } catch (error) {
    console.error("Admin Hero POST Error:", error);
    return NextResponse.json({ success: false, message: "Failed to create slide" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { _id, ...updateData } = body;
    await connectDB();

    const slide = await HeroSlide.findByIdAndUpdate(_id, { $set: updateData }, { new: true });
    return NextResponse.json({ success: true, message: "Hero slide updated", slide });
  } catch (error) {
    console.error("Admin Hero PUT Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update slide" }, { status: 500 });
  }
}
