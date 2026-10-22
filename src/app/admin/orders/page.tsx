"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Loader2, CheckCircle2, Truck, Eye, RefreshCw } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (search) params.append("search", search);

      const res = await fetch(`/api/orders?${params.toString()}`);
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

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
        );
      } else {
        alert(data.message || "Failed to update order status");
      }
    } catch {
      alert("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateTracking = async (orderId: string, trackingNumber: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, trackingNumber } : ord))
        );
        alert("Tracking number saved successfully!");
      }
    } catch {
      alert("Failed to save tracking number");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
          FULFILLMENT
        </span>
        <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide mt-1">
          CUSTOMER ORDER MANAGEMENT
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrders();
          }}
          className="flex items-center gap-2 w-full sm:w-80"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order # or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-neutral-800 text-white rounded-md text-xs font-semibold uppercase tracking-wider"
          >
            Find
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-neutral-500 flex-shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-neutral-200 rounded-md px-3 py-2 bg-white text-neutral-800 focus:outline-none focus:border-[#b55b6c]"
          >
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
            <Loader2 className="w-7 h-7 animate-spin text-[#b55b6c] mb-2" />
            <p className="text-xs">Loading orders from MongoDB...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-[#faf5f6] text-[11px] uppercase font-bold text-neutral-700 tracking-wider">
                <tr>
                  <th className="py-3 px-6">Order #</th>
                  <th className="py-3 px-6">Customer &amp; Phone</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Payment</th>
                  <th className="py-3 px-6">Status Update</th>
                  <th className="py-3 px-6">Total</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-neutral-400">
                      No orders found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-neutral-50/50">
                      <td className="py-3.5 px-6 font-mono font-bold text-neutral-900">
                        #{ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-6">
                        <p className="font-semibold text-neutral-800">{ord.customer.fullName}</p>
                        <p className="text-[11px] text-neutral-500">{ord.customer.email}</p>
                        <p className="text-[11px] text-neutral-400">{ord.customer.phone}</p>
                      </td>
                      <td className="py-3.5 px-6 text-neutral-500">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="font-semibold text-neutral-800">{ord.paymentMethod}</span>
                        <span className="block text-[10px] text-neutral-400">({ord.paymentStatus})</span>
                      </td>
                      <td className="py-3.5 px-6">
                        <select
                          value={ord.orderStatus}
                          disabled={updatingId === ord._id}
                          onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                          className="text-xs border border-neutral-200 rounded px-2.5 py-1.5 bg-white text-neutral-800 font-semibold uppercase focus:outline-none focus:border-[#b55b6c]"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-neutral-900 text-sm">
                        ₹{ord.total}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded text-neutral-500 hover:text-[#b55b6c] hover:bg-pink-50 transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#b55b6c]">Order Details</span>
                <h2 className="text-base font-serif font-bold text-neutral-900">
                  #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-neutral-700 font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#faf5f6] p-4 rounded-xl space-y-1">
              <p className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Shipping Address
              </p>
              <p className="font-semibold text-neutral-900">{selectedOrder.shippingAddress.fullName}</p>
              <p className="text-neutral-600">
                {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
              </p>
              <p className="text-neutral-500">Phone: {selectedOrder.shippingAddress.phone}</p>
            </div>

            {/* Tracking Number Input */}
            <div className="p-4 border border-neutral-200 rounded-xl space-y-2">
              <label className="block font-bold text-neutral-800">
                Air Waybill / Tracking Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  defaultValue={selectedOrder.trackingNumber || ""}
                  id={`tracking-input-${selectedOrder._id}`}
                  placeholder="e.g. BLUEDART-849204821"
                  className="w-full px-3 py-2 rounded border border-neutral-200 focus:outline-none focus:border-[#b55b6c] font-mono text-xs"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById(
                      `tracking-input-${selectedOrder._id}`
                    ) as HTMLInputElement;
                    if (el) handleUpdateTracking(selectedOrder._id, el.value);
                  }}
                  className="btn-primary text-xs flex-shrink-0"
                >
                  Save Tracking
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <p className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Ordered Formulations
              </p>
              <div className="divide-y divide-neutral-100 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-800">{item.name}</p>
                      <p className="text-[11px] text-neutral-400">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <span className="font-bold text-neutral-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-3 flex justify-between font-bold text-sm text-neutral-900">
              <span>Total:</span>
              <span className="text-[#b55b6c]">₹{selectedOrder.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
