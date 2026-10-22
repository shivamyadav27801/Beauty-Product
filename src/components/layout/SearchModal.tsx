"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, ArrowRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductResult {
  _id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  thumbnail: string;
  categoryName?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fade-in border border-neutral-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-neutral-100 gap-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search serums, face washes, lipsticks, moisturizers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base focus:outline-none placeholder:text-neutral-400 text-neutral-800"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-[#b55b6c] animate-spin" />
          ) : query ? (
            <button onClick={() => setQuery("")} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="ml-2 text-sm text-neutral-500 hover:text-neutral-800 font-medium px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim().length === 0 ? (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Niacinamide Serum", "Salicylic Face Wash", "Matte Lipstick", "Gel Moisturizer", "Sunscreen SPF 50"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-full text-xs bg-pink-50 text-[#b55b6c] hover:bg-pink-100 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Products ({results.length})
              </p>
              <div className="divide-y divide-neutral-100">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 group hover:bg-pink-50/50 px-2 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 relative rounded-md overflow-hidden bg-pink-50 flex-shrink-0">
                      <Image
                        src={product.thumbnail || "/images/products/niacinamide-serum.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 group-hover:text-[#b55b6c] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-500">{product.categoryName || "Beauty"}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[#b55b6c]">
                        ₹{product.salePrice || product.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-3 border-t border-neutral-100 text-center">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b55b6c] hover:underline uppercase tracking-wider"
                >
                  <span>View all results for &ldquo;{query}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : !loading ? (
            <div className="text-center py-8 text-neutral-500">
              <p className="text-sm">No products found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-neutral-400 mt-1">Try checking for typos or searching for a broader term.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
