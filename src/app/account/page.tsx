"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Package, Heart, Shield, LogOut, Loader2, Mail, Phone } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#b55b6c]" />
      </div>
    );
  }

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xs border border-pink-100 p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-pink-100 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#faeceb] text-[#b55b6c] flex items-center justify-center font-bold text-xl font-serif">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-neutral-800">
                  Hello, {user.name}
                </h1>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="btn-primary text-xs flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <button
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
                className="btn-secondary text-xs text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1.5 uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/account/orders"
              className="p-6 rounded-xl border border-neutral-100 bg-[#fdfafb] hover:border-pink-200 transition-all flex flex-col items-center text-center space-y-2 group shadow-xs"
            >
              <div className="p-3 rounded-full bg-white text-[#b55b6c] group-hover:scale-110 transition-transform shadow-xs">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-serif font-bold text-neutral-800">My Orders</h2>
              <p className="text-[11px] text-neutral-500">Track shipments &amp; order history</p>
            </Link>

            <Link
              href="/wishlist"
              className="p-6 rounded-xl border border-neutral-100 bg-[#fdfafb] hover:border-pink-200 transition-all flex flex-col items-center text-center space-y-2 group shadow-xs"
            >
              <div className="p-3 rounded-full bg-white text-[#b55b6c] group-hover:scale-110 transition-transform shadow-xs">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-serif font-bold text-neutral-800">Wishlist</h2>
              <p className="text-[11px] text-neutral-500">Saved favorite beauty formulations</p>
            </Link>

            <Link
              href="/shop"
              className="p-6 rounded-xl border border-neutral-100 bg-[#fdfafb] hover:border-pink-200 transition-all flex flex-col items-center text-center space-y-2 group shadow-xs"
            >
              <div className="p-3 rounded-full bg-white text-[#b55b6c] group-hover:scale-110 transition-transform shadow-xs">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-serif font-bold text-neutral-800">Explore Catalog</h2>
              <p className="text-[11px] text-neutral-500">Discover new arrivals &amp; rituals</p>
            </Link>
          </div>

          {/* Account Profile Info */}
          <div className="bg-[#faf5f6] p-6 rounded-xl space-y-4 text-xs">
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-neutral-800">
              PROFILE DETAILS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-400">Full Name</span>
                <p className="font-semibold text-neutral-800 mt-0.5">{user.name}</p>
              </div>
              <div>
                <span className="text-neutral-400">Email Address</span>
                <p className="font-semibold text-neutral-800 mt-0.5">{user.email}</p>
              </div>
              <div>
                <span className="text-neutral-400">Phone</span>
                <p className="font-semibold text-neutral-800 mt-0.5">{user.phone || "Not set"}</p>
              </div>
              <div>
                <span className="text-neutral-400">Account Role</span>
                <p className="font-semibold text-[#b55b6c] mt-0.5">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
