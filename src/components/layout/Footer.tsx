"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Logo } from "../ui/Logo";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Thank you for subscribing to Velvetique Beauty!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Unable to submit. Please check your connection.");
    }
  };

  return (
    <footer className="bg-[#3a1f2c] text-neutral-300 pt-16 pb-8 border-t border-[#4a293a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[#4d2c3d]">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4">
            <Logo variant="light" className="items-start" />
            <p className="text-sm text-pink-100/80 leading-relaxed font-light pt-2 max-w-xs">
              Thoughtful beauty for every skin, every day.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-pink-200">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#4d2c3d] flex items-center justify-center hover:bg-[#b55b6c] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 6.46 11.82 5 14.54 5c1.3 0 2.66.23 2.66.23v2.92h-1.5c-1.5 0-1.97.94-1.97 1.9V12h3.29l-.53 3H13.7v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#4d2c3d] flex items-center justify-center hover:bg-[#b55b6c] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#4d2c3d] flex items-center justify-center hover:bg-[#b55b6c] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
              <Link
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="w-8 h-8 rounded-full bg-[#4d2c3d] flex items-center justify-center hover:bg-[#b55b6c] hover:text-white transition-colors font-bold text-xs"
              >
                P
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.16em] uppercase text-white font-serif">
              QUICK LINKS
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <Link href="/" className="hover:text-pink-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-pink-300 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-pink-300 transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-pink-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-pink-300 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-300 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.16em] uppercase text-white font-serif">
              CUSTOMER CARE
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <Link href="/track-order" className="hover:text-pink-300 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-pink-300 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns-refunds" className="hover:text-pink-300 transition-colors">
                  Return &amp; Refund
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-pink-300 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-pink-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-pink-300 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.16em] uppercase text-white font-serif">
              NEWSLETTER
            </h3>
            <p className="text-xs text-pink-100/80 leading-relaxed font-light">
              Subscribe to get special offers, beauty tips and more.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex rounded-md overflow-hidden shadow-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-[#b55b6c] hover:bg-[#a84f60] text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors flex-shrink-0 disabled:opacity-60"
                >
                  {status === "loading" ? "..." : "SUBSCRIBE"}
                </button>
              </div>
              {status === "success" && (
                <div className="flex items-center gap-1.5 text-xs text-green-300 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{message}</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-1.5 text-xs text-rose-300 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{message}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Supported Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-pink-200/70">
          <p>© 2025 Velvetique Beauty. All Rights Reserved.</p>
          <div className="flex items-center space-x-3">
            <span className="px-2 py-1 bg-white text-[#1a1f71] rounded font-bold text-[10px] tracking-wider shadow-xs">
              VISA
            </span>
            <span className="px-2 py-1 bg-[#222] text-[#eb001b] rounded font-bold text-[10px] tracking-wider flex items-center gap-0.5 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eb001b] inline-block -mr-1" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f79e1b] inline-block opacity-90" />
            </span>
            <span className="px-2 py-1 bg-white text-[#0066b2] rounded font-bold text-[10px] tracking-wider shadow-xs">
              RuPay
            </span>
            <span className="px-2 py-1 bg-[#4b286d] text-white rounded font-bold text-[10px] tracking-wider shadow-xs">
              UPI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
