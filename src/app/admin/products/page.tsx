"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Loader2, Star, CheckCircle, XCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch {
      alert("Network error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
            INVENTORY
          </span>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide">
            PRODUCT MANAGEMENT
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="btn-primary text-xs flex items-center gap-1.5 uppercase tracking-wider py-2.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by name, SKU, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
        />
        <span className="text-xs text-neutral-400 flex-shrink-0">
          {filteredProducts.length} items
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
            <Loader2 className="w-7 h-7 animate-spin text-[#b55b6c] mb-2" />
            <p className="text-xs">Loading product inventory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-[#faf5f6] text-[11px] uppercase font-bold text-neutral-700 tracking-wider">
                <tr>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">SKU</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Stock</th>
                  <th className="py-3 px-6">Badges</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-neutral-50/50">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                          <Image
                            src={prod.thumbnail || "/images/products/niacinamide-serum.jpg"}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            className="font-bold text-neutral-900 hover:text-[#b55b6c] line-clamp-1"
                          >
                            {prod.name}
                          </Link>
                          <span className="text-[11px] text-neutral-400">{prod.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-mono font-medium text-neutral-700">
                      {prod.sku}
                    </td>
                    <td className="py-3.5 px-6 uppercase font-medium text-neutral-600">
                      {prod.categoryName || "Beauty"}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-neutral-900">
                      ₹{prod.salePrice || prod.price}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`font-semibold ${
                          prod.stock <= 10 ? "text-amber-600" : "text-emerald-700"
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {prod.isBestSeller && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-pink-100 text-[#b55b6c]">
                            Best Seller
                          </span>
                        )}
                        {prod.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                            Featured
                          </span>
                        )}
                        {prod.isNewArrival && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                            New In
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${prod._id}`}
                          className="p-1.5 rounded text-neutral-500 hover:text-[#b55b6c] hover:bg-pink-50"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prod._id, prod.name)}
                          disabled={deletingId === prod._id}
                          className="p-1.5 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
