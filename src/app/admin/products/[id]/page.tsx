"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    category: "",
    categoryName: "",
    brand: "Velvetique Beauty",
    price: "",
    salePrice: "",
    compareAtPrice: "",
    stock: "50",
    thumbnail: "",
    tags: "",
    shortDescription: "",
    description: "",
    ingredients: "",
    howToUse: "",
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch(`/api/products/${id}`).then((r) => r.json()),
    ])
      .then(([catData, prodData]) => {
        if (catData.categories) setCategories(catData.categories);
        if (prodData.product) {
          const p = prodData.product;
          setFormData({
            name: p.name || "",
            slug: p.slug || "",
            sku: p.sku || "",
            category: p.category || "",
            categoryName: p.categoryName || "",
            brand: p.brand || "Velvetique Beauty",
            price: p.price?.toString() || "",
            salePrice: p.salePrice?.toString() || "",
            compareAtPrice: p.compareAtPrice?.toString() || "",
            stock: p.stock?.toString() || "0",
            thumbnail: p.thumbnail || "",
            tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
            shortDescription: p.shortDescription || "",
            description: p.description || "",
            ingredients: p.ingredients || "",
            howToUse: p.howToUse || "",
            isBestSeller: !!p.isBestSeller,
            isFeatured: !!p.isFeatured,
            isNewArrival: !!p.isNewArrival,
            isActive: p.isActive !== false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSaving(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        stock: parseInt(formData.stock),
        tags: formData.tags.split(",").map((t) => t.trim()),
        images: [formData.thumbnail],
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin/products");
      } else {
        setErrorMsg(data.message || "Failed to update product");
      }
    } catch {
      setErrorMsg("A network error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#b55b6c]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="text-xs text-neutral-500 hover:text-[#b55b6c] flex items-center gap-1 font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
            CATALOG UPDATE
          </span>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide mt-1">
            EDIT FORMULATION: {formData.name}
          </h1>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={handleChange}
                name="slug"
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">SKU Code *</label>
              <input
                type="text"
                required
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c] uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  const selectedCat = categories.find((c) => c._id === e.target.value);
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    categoryName: selectedCat?.name || "",
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#b55b6c]"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Sale Price (₹)</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Compare At (₹)</label>
              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Stock Units *</label>
              <input
                type="number"
                required
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Thumbnail Path *</label>
            <input
              type="text"
              required
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Full Description *</label>
            <textarea
              required
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-2 border-t border-neutral-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="text-[#b55b6c] focus:ring-[#b55b6c] rounded"
              />
              <span>Best Seller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="text-[#b55b6c] focus:ring-[#b55b6c] rounded"
              />
              <span>Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="text-[#b55b6c] focus:ring-[#b55b6c] rounded"
              />
              <span>Active on Storefront</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full py-3.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>UPDATING PRODUCT...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>UPDATE PRODUCT</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
