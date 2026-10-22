"use client";

import React from "react";
import Link from "next/link";
import { ProductCard, ProductItem } from "../products/ProductCard";

interface BestSellersSectionProps {
  products?: ProductItem[];
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ products }) => {
  const displayProducts = products || [];

  return (
    <section className="py-14 md:py-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-100">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-800 tracking-[0.14em] uppercase">
            BEST SELLERS
          </h2>
          <Link
            href="/shop?sort=best-selling"
            className="text-xs sm:text-sm font-semibold tracking-[0.1em] text-[#b55b6c] hover:text-[#9c3b4f] uppercase hover:underline transition-colors"
          >
            VIEW ALL
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};
