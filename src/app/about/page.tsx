import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, HeartHandshake, Leaf, ShieldCheck, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#fae7e6] via-[#f7dedd] to-[#faeceb] py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <span className="text-xs uppercase tracking-[0.26em] font-semibold text-[#b55b6c]">
            OUR HERITAGE &amp; ETHOS
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            Thoughtful Beauty for Every Skin, Every Day.
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
            Velvetique Beauty was born from a singular belief: luxurious skincare should nourish deeply, empower naturally, and respect our living planet.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/images/hero/hero-slide-1.jpg"
              alt="Velvetique Botanical Formulations"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
              THE VELVETIQUE VISION
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 leading-snug">
              Harmonizing Pure Botanicals with Proven Dermatological Science
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              We design everyday skincare rituals that celebrate natural confidence. Each formula combines clinical-grade actives like multi-molecular Hyaluronic Acid, Niacinamide, and gentle Salicylic Acid with wild-harvested botanical extracts such as chamomile, argan, and jasmine.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              We never compromise on texture or efficacy. From the weightless cushion of our Velvet Matte lipsticks to the cooling surge of our Hydra Intense gel moisturizer, every touchpoint is designed to feel like bespoke self-care.
            </p>
            <div className="pt-2">
              <Link href="/shop" className="btn-primary text-xs uppercase tracking-wider">
                EXPLORE THE FORMULATIONS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Strip */}
      <section className="bg-[#faf5f6] py-16 border-t border-b border-pink-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-2xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
              OUR PILLARS OF INTEGRITY
            </h3>
            <div className="w-16 h-0.5 bg-[#b55b6c] mx-auto mt-2 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-xs border border-pink-100 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-pink-50 text-[#b55b6c] flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-neutral-800">Clean &amp; Toxin-Free</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Zero parabens, sulfates, phthalates, or harsh artificial dyes. Clean formulas tested for optimal skin biocompatibility.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xs border border-pink-100 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-pink-50 text-[#b55b6c] flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-neutral-800">100% Cruelty Free</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                We believe in beauty without harm. We strictly avoid animal testing at every stage of research and formulation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xs border border-pink-100 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-pink-50 text-[#b55b6c] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-neutral-800">Clinically Evaluated</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Dermatologically tested formulations rigorously evaluated on diverse skin types to guarantee visible, gentle results.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
