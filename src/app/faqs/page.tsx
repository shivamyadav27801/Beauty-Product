"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQsPage() {
  const faqs = [
    {
      q: "Are Velvetique Beauty products suitable for sensitive or acne-prone skin?",
      a: "Yes. All our products are dermatologically evaluated and formulated with gentle, non-comedogenic ingredients. Formulations like our Oil Control Face Wash with Salicylic Acid and 10% Niacinamide Serum are specifically calibrated for sensitive and blemish-prone skin.",
    },
    {
      q: "Are your formulations 100% cruelty-free?",
      a: "Absolutely. We are passionately committed to cruelty-free beauty. We do not test any raw materials or finished products on animals, nor do we commission third parties to do so.",
    },
    {
      q: "How can I apply discount codes like GLOW15?",
      a: "You can enter your promotional code in your shopping bag or during checkout. Type GLOW15 into the Promo Code input and click APPLY to receive 15% off orders exceeding ₹999.",
    },
    {
      q: "How do I track my order once placed?",
      a: "As soon as your package is dispatched, we send you an SMS and email with your Air Waybill number. You can also visit our Track Your Order page anytime to view real-time delivery status.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Visa, Mastercard, RuPay, and major NetBanking portals.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-pink-100 shadow-xs space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#b55b6c]">
              HELP CENTER
            </span>
            <h1 className="text-3xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
              FREQUENTLY ASKED QUESTIONS
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Quick answers regarding our clean ingredients, orders, shipping, and skincare rituals.
            </p>
          </div>

          <div className="divide-y divide-pink-100/60">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full text-left flex justify-between items-center text-sm font-semibold text-neutral-800 hover:text-[#b55b6c] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      openIdx === idx ? "rotate-180 text-[#b55b6c]" : ""
                    }`}
                  />
                </button>
                {openIdx === idx && (
                  <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
