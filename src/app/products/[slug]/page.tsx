import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductActions } from "./ProductActions";
import { ProductReviews } from "./ProductReviews";
import { Star, ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";

export const revalidate = 60;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  await connectDB();

  const productDoc = await Product.findOne({ slug, isActive: true }).lean();
  if (!productDoc) {
    notFound();
  }

  const product = {
    ...productDoc,
    _id: productDoc._id.toString(),
    category: productDoc.category.toString(),
    createdAt: productDoc.createdAt?.toISOString(),
    updatedAt: productDoc.updatedAt?.toISOString(),
  };

  // Fetch related products from same category or best sellers
  const relatedDocs = await Product.find({
    _id: { $ne: productDoc._id },
    isActive: true,
  })
    .limit(4)
    .lean();

  const relatedProducts = relatedDocs.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    price: p.price,
    salePrice: p.salePrice,
    compareAtPrice: p.compareAtPrice,
    thumbnail: p.thumbnail,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    categoryName: p.categoryName,
    sku: p.sku,
  }));

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > displayPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - displayPrice) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-neutral-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#b55b6c]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#b55b6c]">Shop</Link>
          <span>/</span>
          <span className="text-neutral-800 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Info (Images + Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#faf5f6] border border-pink-100/60 shadow-xs">
              <Image
                src={product.thumbnail || "/images/products/niacinamide-serum.jpg"}
                alt={product.name}
                fill
                priority
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-[#b55b6c] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail list */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 flex-shrink-0 cursor-pointer hover:border-[#b55b6c]"
                  >
                    <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Pricing, Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
                {product.categoryName || "VELVETIQUE BEAUTY"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Rating and SKU */}
              <div className="flex items-center gap-4 mt-2.5 text-xs text-neutral-500">
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <span className="font-semibold text-neutral-800 ml-1">
                    {product.rating?.toFixed(1) || "5.0"}
                  </span>
                  <span className="text-neutral-500">({product.reviewCount || 120} reviews)</span>
                </div>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 pt-1 border-t border-b border-neutral-100 py-4">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                ₹{displayPrice}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-neutral-400 line-through">
                    ₹{product.compareAtPrice}
                  </span>
                  <span className="text-xs text-[#b55b6c] font-semibold">
                    Save ₹{(product.compareAtPrice! - displayPrice)}
                  </span>
                </>
              )}
              <span className="text-xs text-neutral-400 ml-auto">Inclusive of all taxes</span>
            </div>

            {/* Short Description */}
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              {product.shortDescription || product.description}
            </p>

            {/* Stock indicator */}
            <div className="text-xs">
              {product.stock > 0 ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  In Stock ({product.stock} available for dispatch)
                </span>
              ) : (
                <span className="text-rose-600 font-medium">Currently Out of Stock</span>
              )}
            </div>

            {/* Client Add to Cart & Buy Now Actions */}
            <ProductActions
              product={{
                _id: product._id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                salePrice: product.salePrice,
                thumbnail: product.thumbnail,
                stock: product.stock,
                sku: product.sku,
              }}
            />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-600">
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-pink-50/40">
                <Truck className="w-4 h-4 text-[#b55b6c]" />
                <span className="font-medium">Free Shipping</span>
                <span className="text-[10px] text-neutral-400">On orders over ₹999</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-pink-50/40">
                <RotateCcw className="w-4 h-4 text-[#b55b6c]" />
                <span className="font-medium">15-Day Return</span>
                <span className="text-[10px] text-neutral-400">Hassle-free policy</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-pink-50/40">
                <ShieldCheck className="w-4 h-4 text-[#b55b6c]" />
                <span className="font-medium">100% Authentic</span>
                <span className="text-[10px] text-neutral-400">Directly from Velvetique</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs / Accordions */}
        <div className="mt-16 border-t border-neutral-100 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="bg-[#faf7f6] p-6 rounded-xl space-y-2">
              <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-800 font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b55b6c]" />
                Key Ingredients
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {product.ingredients || "Aqua, Niacinamide, Botanical Extract, Hyaluronic Acid, Aloe Vera Juice, Tocopherol."}
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-[#faf7f6] p-6 rounded-xl space-y-2">
              <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-800 font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b55b6c]" />
                Clinical Benefits
              </h3>
              <ul className="text-xs text-neutral-600 space-y-1 list-disc list-inside font-light">
                {product.benefits && product.benefits.length > 0 ? (
                  product.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)
                ) : (
                  <>
                    <li>Enhances natural skin glow and radiance</li>
                    <li>Soothes and strengthens skin barrier</li>
                    <li>Non-comedogenic, lightweight absorption</li>
                  </>
                )}
              </ul>
            </div>

            {/* How to Use */}
            <div className="bg-[#faf7f6] p-6 rounded-xl space-y-2">
              <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-800 font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b55b6c]" />
                How to Use
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {product.howToUse ||
                  "Dispense 2-3 drops or a dime-sized amount onto cleansed face and neck. Gently massage in upward circular motions until fully absorbed. Follow with moisturizer."}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews productId={product._id} productName={product.name} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-neutral-100">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-800 uppercase tracking-wider text-center mb-8">
              YOU MAY ALSO LOVE
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
