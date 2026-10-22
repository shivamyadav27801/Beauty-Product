import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { HeroSlide } from "@/models/HeroSlide";
import { Category } from "@/models/Category";
import { Promotion } from "@/models/Promotion";
import { Product } from "@/models/Product";
import { SiteSetting } from "@/models/SiteSetting";

export async function GET() {
  try {
    await connectDB();

    const [heroSlides, categories, promotion, bestSellers, settings] = await Promise.all([
      HeroSlide.find({ isActive: true }).sort({ order: 1 }).lean(),
      Category.find({ isActive: true }).sort({ order: 1 }).lean(),
      Promotion.findOne({ isActive: true }).lean(),
      Product.find({ isActive: true, isBestSeller: true }).sort({ createdAt: -1 }).limit(8).lean(),
      SiteSetting.findOne().lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        heroSlides,
        categories,
        promotion,
        bestSellers,
        settings,
      },
    });
  } catch (error) {
    console.error("Home API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load home data" },
      { status: 500 }
    );
  }
}
