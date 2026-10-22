import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fcf8f9] min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-pink-100 shadow-xs space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#b55b6c]">
              LEGAL NOTICE
            </span>
            <h1 className="text-3xl font-serif font-bold text-neutral-800 uppercase tracking-wide mt-1">
              PRIVACY POLICY
            </h1>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
            <p>
              Your privacy is of paramount importance to Velvetique Beauty. This policy clarifies how we collect, store, and safeguard your personal details when you browse or make purchases on our storefront.
            </p>
            <h2 className="text-base font-serif font-bold text-neutral-800 pt-2">Data We Collect</h2>
            <p>
              We collect your name, shipping address, contact phone number, and email address strictly to process orders, facilitate courier deliveries, and provide customer support.
            </p>
            <h2 className="text-base font-serif font-bold text-neutral-800 pt-2">Payment Security</h2>
            <p>
              We never store your credit/debit card numbers or bank account credentials on our servers. All digital payments are processed through PCI-DSS compliant payment gateways with 256-bit SSL encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
