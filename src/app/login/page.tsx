"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.role === "ADMIN" || result.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
      } else {
        setErrorMsg(result.message || "Invalid email or password");
      }
    } catch {
      setErrorMsg("An error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcf8f9] min-h-[80vh] flex items-center justify-center py-14 px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xs border border-pink-100 p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <Logo className="mb-2" />
          <h1 className="text-2xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
            WELCOME BACK
          </h1>
          <p className="text-xs text-neutral-500 font-light">
            Sign in to access your saved wishlist, orders, and skincare rituals.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. you@example.com"
              className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-neutral-700">Password *</label>
              <Link href="/contact" className="text-[11px] text-[#b55b6c] hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SIGNING IN...</span>
              </>
            ) : (
              <span>SIGN IN</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-500">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/register" className="font-semibold text-[#b55b6c] hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
