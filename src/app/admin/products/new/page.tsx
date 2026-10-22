"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
    thumbnail: "/images/products/niacinamide-serum.jpg",
    tags: "skincare, serum, clean beauty",
    shortDescription: "",
    description: "",
    ingredients: "",
    howToUse: "",
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: true,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category: data.categories[0]._id,
              categoryName: data.categories[0].name,
            }));
          }
        }
      });
  }, []);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameVal = e.target.value;
    const generatedSlug = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: generatedSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

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

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin/products");
      } else {
        setErrorMsg(data.message || "Failed to create product");
      }
    } catch {
      setErrorMsg("A network error occurred");
    } finally {
      setLoading(false);
    }
  };

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
            CATALOG ENTRY
          </span>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide mt-1">
            ADD NEW PRODUCT
          </h1>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. 10% Niacinamide Face Serum"
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
                placeholder="10-niacinamide-face-serum"
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
                placeholder="VB-SK-005"
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

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Standard Price (₹) *</label>
              <input
                type="number"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="799"
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
                placeholder="699"
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
                placeholder="999"
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Inventory Stock *</label>
              <input
                type="number"
                required
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>
          </div>

          {/* Image & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Thumbnail Image Path *</label>
              <input
                type="text"
                required
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="/images/products/niacinamide-serum.jpg"
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="face wash, salicylic, acne"
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>
          </div>

          {/* Descriptions & Ingredients */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="High-strength Vitamin B3 serum to fade dark spots."
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
              placeholder="Detailed description of the formulation, texture, and active ingredients..."
              className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Ingredients List</label>
              <textarea
                rows={2}
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Aqua, Niacinamide, Zinc PCA..."
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">How To Use</label>
              <textarea
                rows={2}
                name="howToUse"
                value={formData.howToUse}
                onChange={handleChange}
                placeholder="Apply 3-4 drops to cleansed face morning and evening..."
                className="w-full px-3.5 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-[#b55b6c]"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-2 border-t border-neutral-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="text-[#b55b6c] focus:ring-[#b55b6c] rounded"
              />
              <span>Mark as Best Seller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="text-[#b55b6c] focus:ring-[#b55b6c] rounded"
              />
              <span>Mark as Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="text-[#b55b6c] focus:ring-[#b55b6c] rounded"
              />
              <span>Mark as New Arrival</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SAVING FORMULATION...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE &amp; PUBLISH PRODUCT</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
