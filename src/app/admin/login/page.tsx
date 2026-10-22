"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { Shield, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
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
          setErrorMsg("Access Denied: You do not possess administrative permissions.");
        }
      } else {
        setErrorMsg(result.message || "Invalid administrative credentials");
      }
    } catch {
      setErrorMsg("Failed to authenticate. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#2b1520] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-pink-50 text-[#b55b6c] rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <Logo className="mb-2" />
          <h1 className="text-xl font-serif font-bold text-neutral-800 uppercase tracking-wider">
            ADMINISTRATIVE PORTAL
          </h1>
          <p className="text-xs text-neutral-500 font-light">
            Authorized personnel only. Secure 2FA role-verified login.
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
            <label className="block font-semibold text-neutral-700 mb-1">Admin Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@velvetiquebeauty.com"
              className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <span>ENTER ADMIN CONSOLE</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-400">
          <Link href="/" className="hover:text-[#b55b6c] transition-colors">
            ← Return to Velvetique Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
