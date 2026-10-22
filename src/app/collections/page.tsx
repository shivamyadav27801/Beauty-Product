import React from "react";
import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { ProductCard } from "@/components/products/ProductCard";

export const revalidate = 60;

export default async function CollectionsPage() {
  await connectDB();

  const [bestSellers, newArrivals, allFeatured] = await Promise.all([
    Product.find({ isActive: true, isBestSeller: true }).lean(),
    Product.find({ isActive: true, isNewArrival: true }).lean(),
    Product.find({ isActive: true, isFeatured: true }).lean(),
  ]);

  const mapProducts = (list: any[]) =>
    list.map((p) => ({
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

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#b55b6c]">
            CURATED RITUALS
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
            THE VELVETIQUE COLLECTIONS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light">
            Discover curated edits designed to simplify your everyday beauty rituals with sublime sensory delight.
          </p>
        </div>

        {/* Collection 1: Best Sellers */}
        <section id="best-sellers" className="bg-white p-6 sm:p-8 rounded-2xl border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
                Best Sellers Edit
              </h2>
              <p className="text-xs text-neutral-500">Our most celebrated, customer-cherished formulations</p>
            </div>
            <Link href="/shop?sort=best-selling" className="text-xs font-semibold text-[#b55b6c] hover:underline uppercase">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mapProducts(bestSellers).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>

        {/* Collection 2: New Arrivals */}
        <section id="new-arrivals" className="bg-white p-6 sm:p-8 rounded-2xl border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
                New Arrivals
              </h2>
              <p className="text-xs text-neutral-500">Freshly launched seasonal additions to elevate your vanity</p>
            </div>
            <Link href="/shop?sort=newest" className="text-xs font-semibold text-[#b55b6c] hover:underline uppercase">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mapProducts(newArrivals).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>

        {/* Collection 3: Featured Sets & Gifts */}
        <section id="limited-edition" className="bg-white p-6 sm:p-8 rounded-2xl border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
                Limited Edition &amp; Featured
              </h2>
              <p className="text-xs text-neutral-500">Exclusive sets and curated beauty essentials</p>
            </div>
            <Link href="/shop?featured=true" className="text-xs font-semibold text-[#b55b6c] hover:underline uppercase">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mapProducts(allFeatured).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
