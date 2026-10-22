"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Loader2, Save } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({
    name: "",
    slug: "",
    description: "",
    image: "/images/categories/skincare.jpg",
    order: 1,
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddModal(false);
        setNewCat({
          name: "",
          slug: "",
          description: "",
          image: "/images/categories/skincare.jpg",
          order: categories.length + 1,
          isActive: true,
        });
        fetchCategories();
      } else {
        alert(data.message || "Failed to create category");
      }
    } catch {
      alert("Error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
            TAXONOMY
          </span>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide mt-1">
            CATEGORY MANAGEMENT
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs flex items-center gap-1.5 uppercase tracking-wider py-2.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-7 h-7 animate-spin text-[#b55b6c]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-[#faf5f6] text-[11px] uppercase font-bold text-neutral-700 tracking-wider">
                <tr>
                  <th className="py-3 px-6">Image</th>
                  <th className="py-3 px-6">Category Name</th>
                  <th className="py-3 px-6">Slug</th>
                  <th className="py-3 px-6">Display Order</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-6">
                      <div className="w-12 h-12 relative rounded-full overflow-hidden bg-neutral-100 border border-pink-100">
                        <Image
                          src={cat.image || "/images/categories/skincare.jpg"}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-6 font-bold text-neutral-900 uppercase tracking-wide">
                      {cat.name}
                    </td>
                    <td className="py-3 px-6 font-mono text-neutral-500">{cat.slug}</td>
                    <td className="py-3 px-6 font-semibold text-neutral-700">{cat.order}</td>
                    <td className="py-3 px-6">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-serif font-bold text-neutral-900 uppercase">
                Add Category
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BATH & BODY"
                  value={newCat.name}
                  onChange={(e) =>
                    setNewCat({
                      ...newCat,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:border-[#b55b6c] uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={newCat.slug}
                  onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Image Path *</label>
                <input
                  type="text"
                  required
                  value={newCat.image}
                  onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Sort Order</label>
                <input
                  type="number"
                  value={newCat.order}
                  onChange={(e) => setNewCat({ ...newCat, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                />
              </div>
              <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold uppercase mt-2">
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
