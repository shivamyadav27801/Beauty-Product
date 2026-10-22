"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface CategoryItem {
  _id?: string;
  name: string;
  slug: string;
  image: string;
}

interface CategorySectionProps {
  categories?: CategoryItem[];
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { name: "SKINCARE", slug: "skincare", image: "/images/categories/skincare.jpg" },
  { name: "MAKEUP", slug: "makeup", image: "/images/categories/makeup.jpg" },
  { name: "HAIRCARE", slug: "haircare", image: "/images/categories/haircare.jpg" },
  { name: "BODYCARE", slug: "bodycare", image: "/images/categories/bodycare.jpg" },
  { name: "SUN CARE", slug: "sun-care", image: "/images/categories/suncare.jpg" },
  { name: "GIFT SETS", slug: "gift-sets", image: "/images/categories/giftsets.jpg" },
];

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const items = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Heading with decorative rose underline */}
        <div className="inline-block mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-800 tracking-[0.12em] uppercase">
            SHOP BY CATEGORY
          </h2>
          <div className="w-16 h-[2.5px] bg-[#b55b6c] mx-auto mt-2.5 rounded-full" />
        </div>

        {/* 6 Circular Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
          {items.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center cursor-pointer select-none"
            >
              {/* Circular image container with blush pink ring */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full p-1.5 bg-gradient-to-tr from-[#f8d7dc] via-[#fbebee] to-[#faeceb] group-hover:from-[#b55b6c] group-hover:to-[#d35e76] transition-all duration-300 shadow-sm group-hover:shadow-md">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                  <Image
                    src={cat.image || "/images/categories/skincare.jpg"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 150px, 200px"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Category Name */}
              <span className="mt-3.5 text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-neutral-800 group-hover:text-[#b55b6c] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
