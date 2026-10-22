"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Package, ArrowLeft, Loader2, Truck, CheckCircle2 } from "lucide-react";

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            href="/account"
            className="text-xs text-neutral-500 hover:text-[#b55b6c] inline-flex items-center gap-1 font-medium uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Account
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-pink-100 p-8 space-y-6">
          <div className="border-b border-pink-100 pb-4">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
              ORDER HISTORY
            </span>
            <h1 className="text-2xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
              MY ORDERS ({orders.length})
            </h1>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#b55b6c]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Package className="w-12 h-12 text-neutral-300 mx-auto stroke-[1.2]" />
              <p className="text-base font-serif font-bold text-neutral-700">No orders placed yet</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Explore our clean skincare, makeup, and nourishing elixirs to place your first order.
              </p>
              <Link href="/shop" className="btn-primary text-xs inline-block mt-2">
                SHOP NOW
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-neutral-100 p-6 bg-[#fdfafb] space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-pink-100 pb-3 gap-2 text-xs">
                    <div>
                      <p className="font-bold text-neutral-900">Order #{order.orderNumber}</p>
                      <p className="text-neutral-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-pink-100 text-[#b55b6c] rounded font-bold uppercase text-[10px] tracking-wider">
                        {order.orderStatus}
                      </span>
                      <Link
                        href={`/order-success/${order.orderNumber}`}
                        className="text-[#b55b6c] hover:underline font-semibold"
                      >
                        View Receipt →
                      </Link>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-pink-100/60">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 relative rounded bg-white border border-neutral-100 overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/images/products/niacinamide-serum.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-800">{item.name}</p>
                            <p className="text-[11px] text-neutral-400">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-neutral-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-pink-100 pt-3 text-xs">
                    <span className="text-neutral-500">
                      Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      Total: <span className="text-[#b55b6c]">₹{order.total}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
