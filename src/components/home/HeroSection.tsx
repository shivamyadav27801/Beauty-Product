"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlideData {
  _id?: string;
  badge?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
}

interface HeroSectionProps {
  slides?: HeroSlideData[];
}

const DEFAULT_SLIDES: HeroSlideData[] = [
  {
    badge: "NEW IN",
    title: "Radiant Skin.\nReal Confidence.",
    description: "Clean beauty that nourishes,\nenhances and empowers you.",
    buttonText: "SHOP NOW",
    buttonUrl: "/shop",
    image: "/images/hero/hero-slide-1.jpg",
  },
  {
    badge: "SUMMER ESSENTIALS",
    title: "Pure Botanical\nNourishment.",
    description: "Gentle elixirs crafted with pure botanical extracts for an effortless natural glow.",
    buttonText: "SHOP NOW",
    buttonUrl: "/shop",
    image: "/images/hero/hero-slide-2.jpg",
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
  };

  const slide = activeSlides[currentIdx] || DEFAULT_SLIDES[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#fae7e6] via-[#f7dedd] to-[#faeceb] min-h-[520px] lg:min-h-[600px] flex items-center">
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#f3cdd4]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left pl-2 md:pl-6">
            {slide.badge && (
              <span className="inline-block text-xs uppercase tracking-[0.25em] font-semibold text-neutral-600">
                {slide.badge}
              </span>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-bold text-neutral-900 leading-[1.12] tracking-tight whitespace-pre-line">
              {slide.title}
            </h1>

            <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-light max-w-sm whitespace-pre-line">
              {slide.description}
            </p>

            <div className="pt-2">
              <Link
                href={slide.buttonUrl || "/shop"}
                className="inline-block bg-[#b55b6c] hover:bg-[#9c3b4f] text-white text-xs md:text-sm font-semibold uppercase tracking-[0.16em] px-8 py-3.5 rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {slide.buttonText || "SHOP NOW"}
              </Link>
            </div>
          </div>

          {/* Right Image Composition Column (7 cols) */}
          <div className="lg:col-span-7 relative flex justify-center items-center">
            <div className="relative w-full aspect-[4/3] max-w-[620px] rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={slide.image || "/images/hero/hero-slide-1.jpg"}
                alt={slide.title.replace(/\n/g, " ")}
                fill
                priority
                className="object-cover object-center transition-all duration-700 hover:scale-102"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows on sides */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-neutral-700 shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-neutral-700 shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </section>
  );
};
