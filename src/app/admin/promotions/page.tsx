"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";

export default function AdminPromotionsPage() {
  const [promo, setPromo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/promotions")
      .then((r) => r.json())
      .then((data) => {
        if (data.promotion) setPromo(data.promotion);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promo),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Promotional banner saved successfully!");
      } else {
        alert(data.message || "Failed to save");
      }
    } catch {
      alert("Error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#b55b6c]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
          CAMPAIGNS
        </span>
        <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide mt-1">
          PROMOTIONAL BANNER CONFIGURATION
        </h1>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-xs">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Badge Text</label>
            <input
              type="text"
              value={promo?.badge || ""}
              onChange={(e) => setPromo({ ...promo, badge: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Promotion Title</label>
            <textarea
              rows={2}
              value={promo?.title || ""}
              onChange={(e) => setPromo({ ...promo, title: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={promo?.description || ""}
              onChange={(e) => setPromo({ ...promo, description: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Button Text</label>
              <input
                type="text"
                value={promo?.buttonText || ""}
                onChange={(e) => setPromo({ ...promo, buttonText: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Button Target Link</label>
              <input
                type="text"
                value={promo?.buttonUrl || ""}
                onChange={(e) => setPromo({ ...promo, buttonUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Image URL</label>
            <input
              type="text"
              value={promo?.image || ""}
              onChange={(e) => setPromo({ ...promo, image: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 px-6 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "SAVING..." : "SAVE PROMOTIONAL BANNER"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
