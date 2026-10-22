"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const threshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const diffToFree = Math.max(0, threshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    if (!inputCode.trim()) return;

    setIsApplying(true);
    const result = await applyCoupon(inputCode);
    setIsApplying(false);

    if (result.success) {
      setCouponSuccess(result.message);
      setInputCode("");
    } else {
      setCouponError(result.message);
    }
  };

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#b55b6c]">Home</Link>
          <span>/</span>
          <span className="text-neutral-800 font-medium">Shopping Bag</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-800 uppercase tracking-wide mb-8">
          YOUR SHOPPING BAG ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xs border border-pink-100 p-12 text-center max-w-lg mx-auto space-y-4">
            <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto stroke-[1.2]" />
            <h2 className="text-xl font-serif font-bold text-neutral-800">Your bag is currently empty</h2>
            <p className="text-xs text-neutral-500">
              Discover our botanical skincare, weightless makeup, and restorative hair formulations.
            </p>
            <Link href="/shop" className="btn-primary text-xs inline-block mt-2">
              EXPLORE OUR SHOP
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Items Table (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Alert Bar */}
              <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs text-xs">
                <div className="flex items-center gap-2 text-neutral-700 font-medium mb-1.5">
                  <Truck className="w-4 h-4 text-[#b55b6c]" />
                  {diffToFree === 0 ? (
                    <span className="text-[#b55b6c] font-semibold">
                      You qualify for FREE Standard Delivery on this order!
                    </span>
                  ) : (
                    <span>
                      Add items worth <strong className="text-[#b55b6c]">₹{diffToFree}</strong> more to get <strong>FREE SHIPPING</strong>.
                    </span>
                  )}
                </div>
                <div className="w-full bg-pink-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#b55b6c] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Table Card */}
              <div className="bg-white rounded-xl border border-neutral-100 shadow-xs divide-y divide-neutral-100 overflow-hidden">
                {items.map((item) => {
                  const unitPrice = item.product.salePrice ?? item.product.price;
                  return (
                    <div key={item.product._id} className="p-4 sm:p-6 flex items-center gap-4 sm:gap-6">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-neutral-50 flex-shrink-0 border border-neutral-100">
                        <Image
                          src={item.product.thumbnail || "/images/products/niacinamide-serum.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-[#b55b6c] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Unit Price: <span className="font-semibold text-neutral-800">₹{unitPrice}</span>
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center border border-neutral-200 rounded">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="px-2.5 py-1 text-neutral-500 hover:text-neutral-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="px-2.5 py-1 text-neutral-500 hover:text-neutral-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product._id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            title="Remove product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm sm:text-base font-bold text-neutral-900">
                          ₹{unitPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart Button */}
              <div className="flex justify-between items-center pt-2">
                <Link href="/shop" className="text-xs text-[#b55b6c] hover:underline font-semibold uppercase tracking-wider">
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-neutral-500 hover:text-red-600 underline"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-xl border border-neutral-100 shadow-xs p-6 space-y-5">
                <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3">
                  ORDER SUMMARY
                </h2>

                {/* Promo Code Form */}
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-pink-50 border border-pink-200 rounded-md text-xs">
                    <div className="flex items-center gap-2 text-[#b55b6c] font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{couponCode}</strong> applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-500 hover:text-red-500 text-xs underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon Code (e.g. GLOW15)"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:border-[#b55b6c] uppercase"
                      />
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="px-4 py-2 bg-neutral-800 hover:bg-[#b55b6c] text-white text-xs font-semibold rounded-md uppercase tracking-wider transition-colors disabled:opacity-50"
                      >
                        {isApplying ? "..." : "APPLY"}
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                    {couponSuccess && <p className="text-[11px] text-green-600">{couponSuccess}</p>}
                  </form>
                )}

                {/* Subtotals & Fees */}
                <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#b55b6c]">
                      <span>Discount</span>
                      <span className="font-semibold">-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-neutral-900">
                      {shippingFee === 0 ? (
                        <span className="text-green-600 uppercase">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Estimated Taxes</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t border-neutral-100 pt-3 flex justify-between text-base font-bold text-neutral-900">
                    <span>Total Amount</span>
                    <span className="text-[#b55b6c] text-lg">₹{total}</span>
                  </div>
                </div>

                {/* Proceed to Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full btn-primary py-3.5 rounded-md flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[11px] text-neutral-400 text-center leading-normal">
                  100% Secure Checkout with Razorpay, UPI &amp; Cash on Delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
