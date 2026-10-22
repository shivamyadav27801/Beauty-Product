import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Coupon } from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      // Fallback for default seed coupon GLOW15 if not yet in DB
      if (code.toUpperCase().trim() === "GLOW15") {
        const discount = Math.round(((cartTotal || 0) * 15) / 100);
        return NextResponse.json({
          success: true,
          message: "15% discount applied!",
          coupon: {
            code: "GLOW15",
            discountPercent: 15,
            discountAmount: discount,
          },
          discount,
        });
      }
      return NextResponse.json(
        { success: false, message: "Invalid or expired coupon code" },
        { status: 400 }
      );
    }

    // Check expiry
    const now = new Date();
    if (coupon.startDate && coupon.startDate > now) {
      return NextResponse.json(
        { success: false, message: "This coupon is not active yet" },
        { status: 400 }
      );
    }
    if (coupon.expiryDate && coupon.expiryDate < now) {
      return NextResponse.json(
        { success: false, message: "This coupon has expired" },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (coupon.minimumOrderAmount && (cartTotal || 0) < coupon.minimumOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order value of ₹${coupon.minimumOrderAmount} required for this coupon`,
        },
        { status: 400 }
      );
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.round(((cartTotal || 0) * coupon.discountValue) / 100);
      if (coupon.maximumDiscountAmount && discount > coupon.maximumDiscountAmount) {
        discount = coupon.maximumDiscountAmount;
      }
    } else {
      discount = Math.min(coupon.discountValue, cartTotal || 0);
    }

    return NextResponse.json({
      success: true,
      message: `Coupon ${coupon.code} applied!`,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountType === "PERCENTAGE" ? coupon.discountValue : 0,
        discountAmount: discount,
      },
      discount,
    });
  } catch (error) {
    console.error("Coupon Validate Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
