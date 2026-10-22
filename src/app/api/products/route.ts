import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { requireAdminSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "featured";
    const bestSeller = searchParams.get("bestSeller");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "24");
    const page = parseInt(searchParams.get("page") || "1");

    const query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
        { categoryName: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      // Find category by slug
      const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        query.categoryName = { $regex: category, $options: "i" };
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bestSeller === "true") {
      query.isBestSeller = true;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    } else if (sort === "rating") {
      sortOption = { rating: -1, reviewCount: -1 };
    } else if (sort === "best-selling") {
      sortOption = { isBestSeller: -1, reviewCount: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    await connectDB();

    // Check slug uniqueness
    const existing = await Product.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    const product = await Product.create(body);

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
