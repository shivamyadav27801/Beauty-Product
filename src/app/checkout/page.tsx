"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shippingFee, total, couponCode, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (items.length === 0) {
      setErrorMsg("Your cart is empty");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      setErrorMsg("Please fill in all required shipping and contact details");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.product._id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.salePrice ?? i.product.price,
        })),
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
        paymentMethod,
        couponCode: couponCode || undefined,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push(`/order-success/${data.orderNumber}`);
      } else {
        setErrorMsg(data.message || "Failed to process order. Please try again.");
      }
    } catch {
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4">
        <h2 className="text-xl font-serif font-bold text-neutral-800">Your shopping bag is empty</h2>
        <p className="text-xs text-neutral-500 mt-1 mb-4">Please add products to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="btn-primary text-xs">
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/cart" className="hover:text-[#b55b6c] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Bag
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 uppercase tracking-wide mb-8">
          CHECKOUT &amp; SHIPPING
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-xs space-y-4">
              <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-2">
                1. CONTACT INFORMATION
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your complete legal name"
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="order updates will be sent here"
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-xs space-y-4">
              <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-2">
                2. SHIPPING ADDRESS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Street Address, Apartment / Suite *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Royal Palms, MG Road"
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 560038"
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    disabled
                    value={formData.country}
                    className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-xs space-y-4">
              <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-2">
                3. PAYMENT METHOD
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#b55b6c] bg-pink-50/40"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="text-[#b55b6c] focus:ring-[#b55b6c]"
                    />
                    <div>
                      <p className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-[11px] text-neutral-500">Pay in cash or UPI when your parcel is delivered</p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "RAZORPAY"
                      ? "border-[#b55b6c] bg-pink-50/40"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "RAZORPAY"}
                      onChange={() => setPaymentMethod("RAZORPAY")}
                      className="text-[#b55b6c] focus:ring-[#b55b6c]"
                    />
                    <div>
                      <p className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#b55b6c]" />
                        Online Payment (Razorpay / Cards / UPI / NetBanking)
                      </p>
                      <p className="text-[11px] text-neutral-500">Fast, encrypted 256-bit secure checkout</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-medium">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-xs space-y-4 sticky top-28">
              <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3">
                ITEMS IN ORDER ({items.length})
              </h2>

              <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => {
                  const unitPrice = item.product.salePrice ?? item.product.price;
                  return (
                    <div key={item.product._id} className="py-3 flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
                        <Image
                          src={item.product.thumbnail || "/images/products/niacinamide-serum.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-800 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-neutral-500">Qty: {item.quantity} × ₹{unitPrice}</p>
                      </div>
                      <span className="text-xs font-bold text-neutral-900">
                        ₹{unitPrice * item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-800">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#b55b6c]">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-neutral-800">
                    {shippingFee === 0 ? <span className="text-green-600 uppercase">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="border-t border-neutral-100 pt-3 flex justify-between text-base font-bold text-neutral-900">
                  <span>Total Payable</span>
                  <span className="text-[#b55b6c] text-xl">₹{total}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>PROCESSING ORDER...</span>
                  </>
                ) : (
                  <span>PLACE ORDER NOW (₹{total})</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span>Encrypted checkout. Velvetique Beauty satisfaction guarantee.</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
