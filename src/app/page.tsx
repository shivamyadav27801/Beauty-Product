import { connectDB } from "@/lib/db/connect";
import { HeroSlide } from "@/models/HeroSlide";
import { Category } from "@/models/Category";
import { Promotion } from "@/models/Promotion";
import { Product } from "@/models/Product";
import { HeroSection } from "@/components/home/HeroSection";
import { BenefitsStrip } from "@/components/home/BenefitsStrip";
import { CategorySection } from "@/components/home/CategorySection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { ServiceStrip } from "@/components/home/ServiceStrip";

// Opt-out of full static generation to ensure live MongoDB data updates
export const revalidate = 60;

export default async function HomePage() {
  await connectDB();

  const [heroSlides, categories, promotion, bestSellers] = await Promise.all([
    HeroSlide.find({ isActive: true }).sort({ order: 1 }).lean(),
    Category.find({ isActive: true }).sort({ order: 1 }).lean(),
    Promotion.findOne({ isActive: true }).lean(),
    Product.find({ isActive: true, isBestSeller: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),
  ]);

  // Transform MongoDB docs for clean client component props
  const serializedSlides = heroSlides.map((slide: any) => ({
    _id: slide._id.toString(),
    badge: slide.badge,
    title: slide.title,
    description: slide.description,
    buttonText: slide.buttonText,
    buttonUrl: slide.buttonUrl,
    image: slide.image,
  }));

  const serializedCategories = categories.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    image: cat.image,
  }));

  const serializedPromo = promotion
    ? {
        title: promotion.title,
        subtitle: (promotion as any).badge || "LIMITED TIME OFFER",
        description: promotion.description,
        buttonText: promotion.buttonText,
        buttonUrl: promotion.buttonUrl,
        image: promotion.image,
        discountPercentage: promotion.discountPercentage,
      }
    : undefined;

  const serializedBestSellers = bestSellers.map((prod: any) => ({
    _id: prod._id.toString(),
    name: prod.name,
    slug: prod.slug,
    price: prod.price,
    salePrice: prod.salePrice,
    compareAtPrice: prod.compareAtPrice,
    thumbnail: prod.thumbnail,
    rating: prod.rating,
    reviewCount: prod.reviewCount,
    stock: prod.stock,
    categoryName: prod.categoryName,
    sku: prod.sku,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Large pink luxury skincare hero */}
      <HeroSection slides={serializedSlides} />

      {/* 2. White benefits strip */}
      <BenefitsStrip />

      {/* 3. Shop by Category */}
      <CategorySection categories={serializedCategories} />

      {/* 4. Pink + product promotional banner */}
      <PromoBanner data={serializedPromo} />

      {/* 5. Best Sellers */}
      <BestSellersSection products={serializedBestSellers} />

      {/* 6. Shipping / Returns / Payment / Support strip */}
      <ServiceStrip />
    </div>
  );
}
