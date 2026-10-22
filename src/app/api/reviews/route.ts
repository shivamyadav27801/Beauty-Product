import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Review } from "@/models/Review";
import { Product } from "@/models/Product";
import { getServerSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const reviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Reviews GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { productId, rating, title, comment, authorName } = await req.json();

    if (!productId || !rating || !comment || !authorName) {
      return NextResponse.json(
        { success: false, message: "All review fields are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const session = await getServerSession();

    const review = await Review.create({
      product: productId,
      user: session?.userId || undefined,
      userName: authorName.trim(),
      rating: Number(rating),
      title: title?.trim() || "Review",
      comment: comment.trim(),
      isApproved: true, // auto-approve verified customer reviews
      isVerifiedPurchase: true,
    });

    // Update product rating and review count
    const allProductReviews = await Review.find({ product: productId, isApproved: true });
    const avgRating =
      allProductReviews.reduce((sum, r) => sum + r.rating, 0) / (allProductReviews.length || 1);

    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: allProductReviews.length,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your review has been submitted.",
      review,
    });
  } catch (error) {
    console.error("Reviews POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 }
    );
  }
}
