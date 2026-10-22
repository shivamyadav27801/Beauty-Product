"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Clock,
  Mail,
  Send,
  Loader2,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Fetch admin stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#b55b6c] mb-2" />
        <p className="text-xs">Aggregating live MongoDB metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
            OVERVIEW
          </span>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide">
            STORE ANALYTICS &amp; OPERATIONS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="btn-primary text-xs flex items-center gap-1.5 uppercase tracking-wider py-2.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="btn-secondary text-xs flex items-center gap-1.5 uppercase tracking-wider py-2.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">
              ₹{stats?.totalRevenue?.toLocaleString("en-IN") || 0}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">Live verified sales</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats?.totalOrders || 0}</p>
            <span className="text-[11px] text-[#b55b6c] font-medium">
              {stats?.pendingOrders || 0} pending processing
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-pink-50 text-[#b55b6c] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Catalog Items
            </p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats?.totalProducts || 0}</p>
            {stats?.lowStockProducts > 0 ? (
              <span className="text-[11px] text-amber-600 font-medium">
                {stats.lowStockProducts} low stock warning
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400 font-medium">Inventory healthy</span>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Customers & Subscribers */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Subscribers &amp; Leads
            </p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">
              {stats?.subscribersCount || 0}
            </p>
            <span className="text-[11px] text-neutral-500">
              {stats?.inquiriesCount || 0} client inquiries
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-neutral-900 uppercase tracking-wide">
              RECENT ORDERS
            </h2>
            <p className="text-xs text-neutral-500">Latest customer purchases across India</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#b55b6c] hover:underline uppercase flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#faf5f6] text-[11px] uppercase font-bold text-neutral-700 tracking-wider">
              <tr>
                <th className="py-3 px-6">Order #</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Items</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((ord: any) => (
                  <tr key={ord._id} className="hover:bg-neutral-50/50">
                    <td className="py-3.5 px-6 font-semibold text-neutral-900 font-mono">
                      <Link href="/admin/orders" className="hover:text-[#b55b6c]">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-neutral-800">{ord.customer.fullName}</p>
                      <p className="text-[11px] text-neutral-400">{ord.customer.email}</p>
                    </td>
                    <td className="py-3.5 px-6">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6">{ord.items.length} item(s)</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-pink-100 text-[#b55b6c]">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-neutral-900">
                      ₹{ord.total}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-400">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
