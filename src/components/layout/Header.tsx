"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, ChevronDown, Menu, X, Heart, Shield, LogOut } from "lucide-react";
import { Logo } from "../ui/Logo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const pathname = usePathname();
  const { itemCount, setIsOpen: setCartOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, logout, isAdmin } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const collRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
      if (collRef.current && !collRef.current.contains(e.target as Node)) {
        setCollectionsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Logo />
        </div>

        {/* Center: Main Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-[13px] tracking-[0.14em] font-medium text-neutral-800 uppercase">
          {/* HOME */}
          <Link
            href="/"
            className={`relative py-2 transition-colors hover:text-[#b55b6c] ${
              isActive("/") ? "text-[#b55b6c]" : "text-neutral-700"
            }`}
          >
            HOME
            {isActive("/") && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b55b6c] rounded-full" />
            )}
          </Link>

          {/* SHOP with dropdown */}
          <div
            ref={shopRef}
            className="relative py-2"
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <Link
              href="/shop"
              className={`flex items-center gap-1 transition-colors hover:text-[#b55b6c] ${
                pathname.startsWith("/shop") ? "text-[#b55b6c]" : "text-neutral-700"
              }`}
            >
              <span>SHOP</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </Link>

            {shopDropdownOpen && (
              <div className="absolute left-0 top-full w-52 bg-white rounded-md shadow-lg border border-neutral-100 py-2.5 z-50 animate-fade-in normal-case tracking-normal">
                <Link
                  href="/shop"
                  className="block px-4 py-2 text-sm text-neutral-800 hover:bg-pink-50 hover:text-[#b55b6c] font-medium"
                >
                  All Products
                </Link>
                <div className="h-[1px] bg-neutral-100 my-1" />
                <Link
                  href="/shop?category=skincare"
                  className="block px-4 py-2 text-sm text-neutral-600 hover:bg-pink-50 hover:text-[#b55b6c]"
                >
                  Skincare
                </Link>
                <Link
                  href="/shop?category=makeup"
                  className="block px-4 py-2 text-sm text-neutral-600 hover:bg-pink-50 hover:text-[#b55b6c]"
                >
                  Makeup
                </Link>
                <Link
                  href="/shop?category=haircare"
                  className="block px-4 py-2 text-sm text-neutral-600 hover:bg-pink-50 hover:text-[#b55b6c]"
                >
                  Haircare
                </Link>
                <Link
                  href="/shop?category=bodycare"
                  className="block px-4 py-2 text-sm text-neutral-600 hover:bg-pink-50 hover:text-[#b55b6c]"
                >
                  Bodycare
                </Link>
                <Link
                  href="/shop?category=sun-care"
                  className="block px-4 py-2 text-sm text-neutral-600 hover:bg-pink-50 hover:text-[#b55b6c]"
                >
                  Sun Care
                </Link>
                <Link
                  href="/shop?category=gift-sets"
                  className="block px-4 py-2 text-sm text-neutral-600 hover:bg-pink-50 hover:text-[#b55b6c]"
                >
                  Gift Sets
                </Link>
              </div>
            )}
          </div>

          {/* COLLECTIONS with dropdown */}
          <div
            ref={collRef}
            className="relative py-2"
            onMouseEnter={() => setCollectionsDropdownOpen(true)}
            onMouseLeave={() => setCollectionsDropdownOpen(false)}
          >
            <Link
              href="/collections"
              className={`flex items-center gap-1 transition-colors hover:text-[#b55b6c] ${
                pathname.startsWith("/collections") ? "text-[#b55b6c]" : "text-neutral-700"
              }`}
            >
              <span>COLLECTIONS</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </Link>

            {collectionsDropdownOpen && (
              <div className="absolute left-0 top-full w-48 bg-white rounded-md shadow-lg border border-neutral-100 py-2 z-50 animate-fade-in normal-case tracking-normal">
                <Link
                  href="/collections#best-sellers"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-pink-50 hover:text-[#b55b6c]"
                >
                  Best Sellers
                </Link>
                <Link
                  href="/collections#new-arrivals"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-pink-50 hover:text-[#b55b6c]"
                >
                  New Arrivals
                </Link>
                <Link
                  href="/collections#limited-edition"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-pink-50 hover:text-[#b55b6c]"
                >
                  Limited Edition
                </Link>
              </div>
            )}
          </div>

          {/* ABOUT US */}
          <Link
            href="/about"
            className={`py-2 transition-colors hover:text-[#b55b6c] ${
              isActive("/about") ? "text-[#b55b6c]" : "text-neutral-700"
            }`}
          >
            ABOUT US
          </Link>

          {/* BLOG */}
          <Link
            href="/blog"
            className={`py-2 transition-colors hover:text-[#b55b6c] ${
              isActive("/blog") ? "text-[#b55b6c]" : "text-neutral-700"
            }`}
          >
            BLOG
          </Link>

          {/* CONTACT */}
          <Link
            href="/contact"
            className={`py-2 transition-colors hover:text-[#b55b6c] ${
              isActive("/contact") ? "text-[#b55b6c]" : "text-neutral-700"
            }`}
          >
            CONTACT
          </Link>
        </nav>

        {/* Right: Actions (Search, Account, Cart) */}
        <div className="flex items-center space-x-5 text-neutral-700">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-1 hover:text-[#b55b6c] transition-colors"
            aria-label="Search products"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="hidden sm:inline-block relative p-1 hover:text-[#b55b6c] transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ba6a78] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account Dropdown */}
          <div ref={accountRef} className="relative">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="p-1 hover:text-[#b55b6c] transition-colors flex items-center gap-1"
              aria-label="Account"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </button>

            {accountDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg border border-neutral-100 py-2 z-50 text-left animate-fade-in text-sm">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="font-semibold text-neutral-800 truncate">{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-pink-100 text-[#b55b6c] rounded">
                          {user.role}
                        </span>
                      )}
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-neutral-700 hover:bg-pink-50 hover:text-[#b55b6c]"
                    >
                      My Account & Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-neutral-700 hover:bg-pink-50 hover:text-[#b55b6c]"
                    >
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#b55b6c] font-medium hover:bg-pink-50"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-neutral-100 my-1" />
                    <button
                      onClick={async () => {
                        await logout();
                        setAccountDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="font-medium text-neutral-800">Welcome to Velvetique</p>
                      <p className="text-xs text-neutral-500">Sign in to manage your orders</p>
                    </div>
                    <Link
                      href="/login"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-neutral-700 hover:bg-pink-50 hover:text-[#b55b6c] font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-neutral-700 hover:bg-pink-50 hover:text-[#b55b6c]"
                    >
                      Create Account
                    </Link>
                    <div className="border-t border-neutral-100 my-1" />
                    <Link
                      href="/admin/login"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs text-neutral-500 hover:text-[#b55b6c]"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Staff / Admin Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon with Live Badge */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-1 hover:text-[#b55b6c] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute -top-1 -right-1 bg-[#ba6a78] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {itemCount}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 text-neutral-700 hover:text-[#b55b6c]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-5 space-y-4 animate-fade-in shadow-md">
          <nav className="flex flex-col space-y-3 text-sm font-medium uppercase tracking-wider text-neutral-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#b55b6c]"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#b55b6c]"
            >
              Shop All
            </Link>
            <div className="pl-4 space-y-2 text-xs normal-case text-neutral-600">
              <Link
                href="/shop?category=skincare"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#b55b6c]"
              >
                Skincare
              </Link>
              <Link
                href="/shop?category=makeup"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#b55b6c]"
              >
                Makeup
              </Link>
              <Link
                href="/shop?category=haircare"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#b55b6c]"
              >
                Haircare
              </Link>
              <Link
                href="/shop?category=bodycare"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#b55b6c]"
              >
                Bodycare
              </Link>
              <Link
                href="/shop?category=sun-care"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#b55b6c]"
              >
                Sun Care
              </Link>
              <Link
                href="/shop?category=gift-sets"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#b55b6c]"
              >
                Gift Sets
              </Link>
            </div>
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#b55b6c]"
            >
              Collections
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#b55b6c]"
            >
              About Us
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#b55b6c]"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#b55b6c]"
            >
              Contact
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#b55b6c] flex items-center justify-between"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-[#b55b6c] text-white text-xs px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
