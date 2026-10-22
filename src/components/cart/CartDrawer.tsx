"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-fade-in">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-pink-50/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#b55b6c]" />
              <h2 className="text-base font-serif font-bold text-neutral-800 tracking-wide">
                YOUR SHOPPING BAG ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-pink-50 px-5 py-3 border-b border-pink-100/60 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-700 mb-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-[#b55b6c]" />
              {diffToFree === 0 ? (
                <span className="text-[#b55b6c] font-semibold">
                  Congratulations! You unlocked FREE Standard Shipping.
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#b55b6c]">₹{diffToFree}</strong> more to qualify for{" "}
                  <strong>FREE SHIPPING</strong>!
                </span>
              )}
            </div>
            <div className="w-full bg-pink-200/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#b55b6c] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-500 space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-[1.2]" />
                <p className="font-serif text-lg text-neutral-700">Your bag is empty</p>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Explore our luxury skincare, makeup, and botanicals to get started.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 btn-primary text-xs"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                return (
                  <div key={item.product._id} className="py-4 flex gap-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image
                        src={item.product.thumbnail || "/images/products/niacinamide-serum.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-semibold text-neutral-800 hover:text-[#b55b6c] line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.product._id)}
                            className="text-neutral-400 hover:text-red-500 ml-2"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          ₹{price} {item.product.salePrice && item.product.price > item.product.salePrice && (
                            <span className="line-through text-neutral-400 text-[11px] ml-1">
                              ₹{item.product.price}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-200 rounded">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="px-2 py-1 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-neutral-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="px-2 py-1 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-neutral-800">
                          ₹{price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Totals and Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-white space-y-3">
              {/* Promo code input */}
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 bg-pink-50 border border-pink-200 rounded-md text-xs">
                  <div className="flex items-center gap-2 text-[#b55b6c] font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{couponCode}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-500 hover:text-red-500 text-xs font-medium underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. GLOW15)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:border-[#b55b6c] uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 bg-neutral-800 hover:bg-[#b55b6c] text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    {isApplying ? "..." : "APPLY"}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-green-600">{couponSuccess}</p>}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-800 font-medium">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#b55b6c]">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-neutral-800 font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-semibold uppercase">Free</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="border-t border-neutral-100 pt-2 flex justify-between text-sm font-bold text-neutral-900">
                  <span>Estimated Total</span>
                  <span className="text-[#b55b6c] text-base">₹{total}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full btn-primary text-xs py-3 rounded-md flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full btn-secondary text-xs py-2 rounded-md flex items-center justify-center uppercase tracking-wider"
                >
                  VIEW FULL BAG
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
