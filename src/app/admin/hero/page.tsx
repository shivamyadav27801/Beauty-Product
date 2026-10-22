"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Save, Plus } from "lucide-react";

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/admin/hero");
      const data = await res.json();
      if (data.slides) setSlides(data.slides);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleUpdate = async (slide: any) => {
    setSavingId(slide._id);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slide),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Hero slide updated successfully!");
      } else {
        alert(data.message || "Failed to update slide");
      }
    } catch {
      alert("Error saving slide");
    } finally {
      setSavingId(null);
    }
  };

  const handleChange = (id: string, field: string, val: any) => {
    setSlides((prev) =>
      prev.map((s) => (s._id === id ? { ...s, [field]: val } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
          HOME HERO
        </span>
        <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide mt-1">
          HERO CAROUSEL MANAGEMENT
        </h1>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#b55b6c]" />
        </div>
      ) : (
        <div className="space-y-6">
          {slides.map((slide, idx) => (
            <div
              key={slide._id}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-sm font-serif font-bold text-neutral-800 uppercase">
                  Hero Slide #{idx + 1}
                </h2>
                <button
                  onClick={() => handleUpdate(slide)}
                  disabled={savingId === slide._id}
                  className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 uppercase font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingId === slide._id ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={slide.badge || ""}
                    onChange={(e) => handleChange(slide._id, "badge", e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Button Text</label>
                  <input
                    type="text"
                    value={slide.buttonText || ""}
                    onChange={(e) => handleChange(slide._id, "buttonText", e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Slide Title</label>
                  <input
                    type="text"
                    value={slide.title || ""}
                    onChange={(e) => handleChange(slide._id, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={slide.description || ""}
                    onChange={(e) => handleChange(slide._id, "description", e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={slide.image || ""}
                    onChange={(e) => handleChange(slide._id, "image", e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Target Link URL</label>
                  <input
                    type="text"
                    value={slide.buttonUrl || ""}
                    onChange={(e) => handleChange(slide._id, "buttonUrl", e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
