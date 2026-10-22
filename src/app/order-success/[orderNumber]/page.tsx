import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/models/Order";
import { CheckCircle2, PackageCheck, Truck, Home, ArrowRight } from "lucide-react";

interface OrderSuccessProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderNumber } = await params;
  await connectDB();

  const order = await Order.findOne({ orderNumber }).lean();
  if (!order) {
    notFound();
  }

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 sm:p-12 text-center space-y-6">
          {/* Success Checkmark */}
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
              ORDER CONFIRMED
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Your order <strong className="text-neutral-900">#{order.orderNumber}</strong> has been received and is being prepared with utmost care.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-[#fdfafb] rounded-xl border border-pink-100 p-6 text-left space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row justify-between border-b border-pink-100 pb-3 gap-2">
              <div>
                <span className="text-neutral-400">Order Number:</span>
                <p className="font-bold text-neutral-900">{order.orderNumber}</p>
              </div>
              <div>
                <span className="text-neutral-400">Payment Method:</span>
                <p className="font-bold text-neutral-900">{order.paymentMethod}</p>
              </div>
              <div>
                <span className="text-neutral-400">Order Status:</span>
                <p className="font-bold text-[#b55b6c]">{order.orderStatus}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border-b border-pink-100 pb-3">
              <span className="text-neutral-400">Shipping To:</span>
              <p className="font-semibold text-neutral-900 mt-0.5">{order.shippingAddress.fullName}</p>
              <p className="text-neutral-600">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-neutral-500">Phone: {order.shippingAddress.phone}</p>
            </div>

            {/* Items */}
            <div className="space-y-3 pt-1">
              <span className="text-neutral-400">Purchased Formulations:</span>
              <div className="divide-y divide-pink-100/60">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded bg-white border border-neutral-100 overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/images/products/niacinamide-serum.jpg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-pink-200/80 pt-3 flex justify-between text-sm font-bold text-neutral-900">
              <span>Total Paid:</span>
              <span className="text-[#b55b6c] text-base">₹{order.total}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/track-order"
              className="btn-secondary text-xs uppercase tracking-wider py-3 flex items-center justify-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-[#b55b6c]" />
              <span>TRACK ORDER</span>
            </Link>
            <Link
              href="/shop"
              className="btn-primary text-xs uppercase tracking-wider py-3 flex items-center justify-center gap-1.5"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
