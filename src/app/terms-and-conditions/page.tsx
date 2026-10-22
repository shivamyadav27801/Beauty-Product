import React from "react";

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#fcf8f9] min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-pink-100 shadow-xs space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#b55b6c]">
              LEGAL NOTICE
            </span>
            <h1 className="text-3xl font-serif font-bold text-neutral-800 uppercase tracking-wide mt-1">
              TERMS &amp; CONDITIONS
            </h1>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
            <p>
              Welcome to Velvetique Beauty. By accessing or purchasing from our platform, you agree to comply with our terms of service, acceptable use, and sales policies.
            </p>
            <h2 className="text-base font-serif font-bold text-neutral-800 pt-2">Product Usage &amp; Patch Testing</h2>
            <p>
              All products are designed for external topical cosmetic use only. Although our formulations are dermatologically tested, individual allergic reactions can occur. We always recommend performing a small patch test behind the ear or inner wrist before full application.
            </p>
            <h2 className="text-base font-serif font-bold text-neutral-800 pt-2">Pricing &amp; Promotions</h2>
            <p>
              Prices, promo codes, and special promotional offers are subject to change without prior notice. Promotional codes cannot be combined unless explicitly stated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
