import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, Clock } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#fcf8f9] min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-pink-100 shadow-xs space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#b55b6c]">
              CUSTOMER CARE
            </span>
            <h1 className="text-3xl font-serif font-bold text-neutral-800 uppercase tracking-wide mt-1">
              SHIPPING &amp; DELIVERY POLICY
            </h1>
            <p className="text-xs text-neutral-400 mt-1">Last updated: October 2025</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
            <section className="space-y-2">
              <h2 className="text-base font-serif font-bold text-neutral-800">
                1. Order Dispatch &amp; Delivery Timelines
              </h2>
              <p>
                All Velvetique Beauty orders are hand-inspected and dispatched within 24 to 48 hours of order confirmation from our climate-controlled fulfillment center in Bengaluru.
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Metro Cities:</strong> Delivered within 2 to 4 business days.</li>
                <li><strong>Rest of India:</strong> Delivered within 4 to 6 business days.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-serif font-bold text-neutral-800">
                2. Shipping Rates &amp; Free Shipping
              </h2>
              <p>
                We offer <strong>FREE Standard Shipping</strong> on all domestic prepaid and COD orders totaling ₹999 or more after any applied discounts. For orders below ₹999, a nominal standard delivery charge of ₹99 applies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-serif font-bold text-neutral-800">
                3. Tracking Your Parcel
              </h2>
              <p>
                Upon parcel dispatch, you will automatically receive an SMS and email notification containing your unique Air Waybill tracking link. You may also track your order at any time on our{" "}
                <Link href="/track-order" className="text-[#b55b6c] underline font-medium">
                  Order Tracking Page
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
