import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });

    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return NextResponse.json({
          success: true,
          message: "Welcome back! Your newsletter subscription has been reactivated.",
        });
      }
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to the Velvetique newsletter!",
      });
    }

    await NewsletterSubscriber.create({
      email: normalizedEmail,
      isActive: true,
      source: "footer",
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to Velvetique Beauty!",
    });
  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json(
      { success: false, message: "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}
