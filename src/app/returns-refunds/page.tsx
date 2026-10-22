import React from "react";
import Link from "next/link";

export default function ReturnsRefundsPage() {
  return (
    <div className="bg-[#fcf8f9] min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-pink-100 shadow-xs space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#b55b6c]">
              CUSTOMER CARE
            </span>
            <h1 className="text-3xl font-serif font-bold text-neutral-800 uppercase tracking-wide mt-1">
              RETURNS &amp; REFUND POLICY
            </h1>
            <p className="text-xs text-neutral-400 mt-1">15-Day Satisfaction Commitment</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
            <section className="space-y-2">
              <h2 className="text-base font-serif font-bold text-neutral-800">
                1. 15-Day Return Policy
              </h2>
              <p>
                We stand wholeheartedly behind the purity and clinical performance of our formulations. If you receive a damaged, expired, or incorrect item, you may request a return or replacement within 15 days of parcel delivery.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-serif font-bold text-neutral-800">
                2. Conditions for Return
              </h2>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Products must be in their original packaging with unbroken seals (unless damaged in transit).</li>
                <li>Items marked as Final Sale or Gift Set bundles must be returned as a complete set.</li>
                <li>To initiate a claim, email <strong>care@velvetiquebeauty.com</strong> with photos of the damaged or incorrect item and your Order Number.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-serif font-bold text-neutral-800">
                3. Refund Process
              </h2>
              <p>
                Approved refunds are processed back to your original source of payment within 5 to 7 business days following reverse-pickup inspection.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
