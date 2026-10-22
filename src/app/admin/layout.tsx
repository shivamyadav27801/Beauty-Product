"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Mail,
  Users,
  Image as ImageIcon,
  Tag,
  Settings,
  Store,
  LogOut,
  Loader2,
  Shield,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, isAdmin } = useAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!user || (!isAdmin && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
        router.push("/admin/login");
      }
    }
  }, [user, loading, isAdmin, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#b55b6c]" />
      </div>
    );
  }

  if (!user || (!isAdmin && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Products", href: "/admin/products", icon: <Package className="w-4 h-4" /> },
    { label: "Categories", href: "/admin/categories", icon: <Layers className="w-4 h-4" /> },
    { label: "Orders", href: "/admin/orders", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Inquiries", href: "/admin/inquiries", icon: <Mail className="w-4 h-4" /> },
    { label: "Subscribers", href: "/admin/subscribers", icon: <Users className="w-4 h-4" /> },
    { label: "Hero Slides", href: "/admin/hero", icon: <ImageIcon className="w-4 h-4" /> },
    { label: "Promotions", href: "/admin/promotions", icon: <Tag className="w-4 h-4" /> },
    { label: "Site Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f6] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#3a1f2c] text-white flex-shrink-0 flex flex-col justify-between p-6">
        <div>
          {/* Brand Logo in sidebar */}
          <div className="pb-6 border-b border-[#4d2c3d] mb-6">
            <Logo variant="light" className="items-start" />
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-pink-100/10 text-pink-300">
              CONSOLE • {user.role}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors font-medium tracking-wide ${
                    active
                      ? "bg-[#b55b6c] text-white shadow-xs"
                      : "text-pink-100/70 hover:bg-[#4d2c3d] hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#4d2c3d] space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-pink-200/70 hover:bg-[#4d2c3d] hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Storefront</span>
          </Link>

          <button
            onClick={async () => {
              await logout();
              router.push("/admin/login");
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-red-300/80 hover:bg-red-950/40 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <header className="bg-white border-b border-neutral-200/80 px-6 sm:px-10 py-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#b55b6c]" />
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
              Admin Workspace
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-neutral-500">Logged in as:</span>
            <strong className="text-neutral-900">{user.name}</strong>
          </div>
        </header>

        <div className="p-6 sm:p-10">{children}</div>
      </main>
    </div>
  );
}
