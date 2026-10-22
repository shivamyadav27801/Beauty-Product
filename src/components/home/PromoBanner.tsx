"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface PromoBannerData {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  image?: string;
  discountPercentage?: number;
}

interface PromoBannerProps {
  data?: PromoBannerData;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ data }) => {
  const title = data?.title || "Up to 30% Off\non Best Sellers";
  const subtitle = data?.subtitle || "LIMITED TIME OFFER";
  const description =
    data?.description || "Glow more, spend less.\nTreat your skin today!";
  const buttonText = data?.buttonText || "SHOP THE SALE";
  const buttonUrl = data?.buttonUrl || "/shop?sort=best-selling";
  const image = data?.image || "/images/promo/promo-banner.jpg";

  return (
    <section className="py-6 md:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[380px] md:min-h-[420px]">
          {/* Left Column: Dusty Rose with Typography */}
          <div className="lg:col-span-5 bg-[#ba6a78] p-8 sm:p-12 lg:p-14 flex flex-col justify-center text-white space-y-4">
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-pink-100">
              {subtitle}
            </span>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-[1.15] tracking-tight whitespace-pre-line text-white">
              {title}
            </h3>

            <p className="text-sm sm:text-base text-pink-100/90 font-light leading-relaxed whitespace-pre-line">
              {description}
            </p>

            <div className="pt-3">
              <Link
                href={buttonUrl}
                className="inline-block bg-white hover:bg-pink-50 text-[#ba6a78] font-bold text-xs sm:text-sm uppercase tracking-[0.16em] px-8 py-3.5 rounded-md shadow-xs hover:shadow-md transition-all duration-300"
              >
                {buttonText}
              </Link>
            </div>
          </div>

          {/* Right Column: Luxury Product Lifestyle Visual */}
          <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[420px] bg-[#f8ebed]">
            <Image
              src={image}
              alt="Velvetique Beauty Promotional Banner"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
