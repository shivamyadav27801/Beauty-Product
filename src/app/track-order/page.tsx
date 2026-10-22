"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, PackageCheck, Truck, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setOrder(null);

    if (!orderNumber.trim() || !email.trim()) {
      setErrorMsg("Please enter both your Order Number and Email Address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrder(data.order);
      } else {
        setErrorMsg(data.message || "Order not found. Please verify details.");
      }
    } catch {
      setErrorMsg("Failed to track order. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const getStepIndex = (currentStatus: string) => {
    switch (currentStatus) {
      case "PENDING":
      case "CONFIRMED":
        return 0;
      case "PROCESSING":
        return 1;
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
            VELVETIQUE LOGISTICS
          </span>
          <h1 className="text-3xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
            TRACK YOUR ORDER
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Enter your order number (e.g. VB-123456-7890) and the email address used during checkout.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-xs border border-pink-100 p-6 sm:p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Order Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VB-625148-3921"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c] uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>LOOKING UP PARCEL...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>TRACK PARCEL STATUS</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details Output */}
        {order && (
          <div className="bg-white rounded-xl shadow-xs border border-neutral-100 p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-100 pb-4 gap-2">
              <div>
                <p className="text-xs text-neutral-400">Order Reference</p>
                <p className="text-base font-bold text-neutral-900">#{order.orderNumber}</p>
              </div>
              <div>
                <span className="text-xs text-neutral-400">Current Status: </span>
                <span className="text-xs font-bold uppercase px-2.5 py-1 bg-pink-50 text-[#b55b6c] rounded">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="py-4">
              <div className="relative flex justify-between">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-[#b55b6c] -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${(getStepIndex(order.orderStatus) / (statusSteps.length - 1)) * 100}%`,
                  }}
                />

                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.orderStatus);
                  const isDone = idx <= currentIdx;
                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isDone
                            ? "bg-[#b55b6c] text-white"
                            : "bg-white border-2 border-neutral-300 text-neutral-400"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-700 mt-2 uppercase">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking Number if dispatched */}
            {order.trackingNumber && (
              <div className="p-3 bg-pink-50/50 rounded-lg border border-pink-100 flex items-center justify-between text-xs">
                <span className="text-neutral-600">Air Waybill / Tracking ID:</span>
                <strong className="text-[#b55b6c] font-mono">{order.trackingNumber}</strong>
              </div>
            )}

            {/* Address */}
            <div className="text-xs text-neutral-600 border-t border-neutral-100 pt-4">
              <p className="font-semibold text-neutral-800 mb-1">Destination Address:</p>
              <p>
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
