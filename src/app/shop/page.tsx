"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard, ProductItem } from "@/components/products/ProductCard";
import { Filter, SlidersHorizontal, Loader2, Check } from "lucide-react";

const CATEGORIES = [
  { name: "All Products", slug: "all" },
  { name: "Skincare", slug: "skincare" },
  { name: "Makeup", slug: "makeup" },
  { name: "Haircare", slug: "haircare" },
  { name: "Bodycare", slug: "bodycare" },
  { name: "Sun Care", slug: "sun-care" },
  { name: "Gift Sets", slug: "gift-sets" },
];

const PRICE_RANGES = [
  { label: "All Prices", min: null, max: null },
  { label: "Under ₹500", min: 0, max: 499 },
  { label: "₹500 - ₹800", min: 500, max: 800 },
  { label: "₹800 - ₹1500", min: 800, max: 1500 },
  { label: "Over ₹1500", min: 1500, max: null },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "featured";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [sortBy, setSortBy] = useState(initialSort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "all") {
          params.append("category", selectedCategory);
        }
        if (initialSearch) {
          params.append("search", initialSearch);
        }
        if (PRICE_RANGES[selectedPrice].min !== null) {
          params.append("minPrice", PRICE_RANGES[selectedPrice].min!.toString());
        }
        if (PRICE_RANGES[selectedPrice].max !== null) {
          params.append("maxPrice", PRICE_RANGES[selectedPrice].max!.toString());
        }
        params.append("sort", sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Fetch shop products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedPrice, sortBy, initialSearch]);

  const activeCategoryName =
    CATEGORIES.find((c) => c.slug === selectedCategory)?.name || "All Products";

  return (
    <div className="bg-[#fdfafb] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center py-8 mb-8 bg-white rounded-xl shadow-xs border border-pink-100">
          <span className="text-xs uppercase tracking-[0.24em] font-semibold text-[#b55b6c]">
            VELVETIQUE BEAUTY
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-800 uppercase tracking-wide mt-1">
            {initialSearch ? `Results for "${initialSearch}"` : activeCategoryName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-lg mx-auto">
            Thoughtfully formulated with clean botanicals and proven dermatological science for radiant skin.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3 rounded-lg border border-neutral-200">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-800 uppercase"
            >
              <Filter className="w-4 h-4 text-[#b55b6c]" />
              <span>Filters &amp; Categories</span>
            </button>
            <span className="text-xs text-neutral-500">{products.length} products</span>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`w-full lg:w-64 flex-shrink-0 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-6 sticky top-28">
              {/* Categories Filter */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-neutral-800 font-serif mb-3">
                  CATEGORIES
                </h3>
                <ul className="space-y-1.5 text-xs">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.slug}>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                          selectedCategory === cat.slug
                            ? "bg-pink-50 text-[#b55b6c] font-bold"
                            : "text-neutral-600 hover:text-[#b55b6c] hover:bg-neutral-50"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5 text-[#b55b6c]" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-neutral-100 pt-5">
                <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-neutral-800 font-serif mb-3">
                  PRICE RANGE
                </h3>
                <div className="space-y-1.5 text-xs">
                  {PRICE_RANGES.map((rng, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2.5 cursor-pointer text-neutral-600 hover:text-neutral-900 py-1"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPrice === idx}
                        onChange={() => {
                          setSelectedPrice(idx);
                          setMobileFilterOpen(false);
                        }}
                        className="text-[#b55b6c] focus:ring-[#b55b6c]"
                      />
                      <span>{rng.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Product Catalog */}
          <main className="flex-1">
            {/* Top Bar with Sort Dropdown */}
            <div className="bg-white px-5 py-3 rounded-lg border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <span className="text-xs text-neutral-600 font-medium">
                Showing <strong className="text-neutral-800">{products.length}</strong> luxurious formulations
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs border border-neutral-200 rounded px-2.5 py-1.5 bg-white text-neutral-800 focus:outline-none focus:border-[#b55b6c]"
                >
                  <option value="featured">Featured</option>
                  <option value="best-selling">Best Sellers</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#b55b6c] mb-2" />
                <p className="text-xs">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center space-y-3">
                <p className="font-serif text-lg text-neutral-700">No products found</p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  We couldn&apos;t find any products matching your selected filters. Try choosing a different category or price range.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedPrice(0);
                    setSortBy("featured");
                  }}
                  className="btn-primary text-xs mt-3"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#b55b6c]" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
