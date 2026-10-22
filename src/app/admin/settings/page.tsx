"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Site settings saved successfully!");
      } else {
        alert(data.message || "Failed to save settings");
      }
    } catch {
      alert("Error saving settings");
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
          STORE CONFIG
        </span>
        <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide mt-1">
          GLOBAL WEBSITE SETTINGS
        </h1>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Announcement Bar */}
          <div className="space-y-3">
            <h2 className="text-sm font-serif font-bold text-neutral-800 uppercase tracking-wide border-b pb-2">
              Announcement Bar
            </h2>
            <div>
              <label className="block font-semibold mb-1">Announcement Message *</label>
              <input
                type="text"
                value={settings?.announcementBar?.text || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementBar: { ...settings.announcementBar, text: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Discount Code</label>
                <input
                  type="text"
                  value={settings?.announcementBar?.code || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcementBar: { ...settings.announcementBar, code: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:border-[#b55b6c] uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Free Shipping Order Threshold (₹)</label>
                <input
                  type="number"
                  value={settings?.shipping?.freeShippingThreshold || 999}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping: {
                        ...settings.shipping,
                        freeShippingThreshold: parseInt(e.target.value) || 999,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-serif font-bold text-neutral-800 uppercase tracking-wide border-b pb-2">
              Concierge Contact Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Public Care Email</label>
                <input
                  type="email"
                  value={settings?.contactInfo?.email || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Client Hotline Phone</label>
                <input
                  type="text"
                  value={settings?.contactInfo?.phone || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Studio Address</label>
                <input
                  type="text"
                  value={settings?.contactInfo?.address || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:border-[#b55b6c]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 px-6 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "SAVING..." : "SAVE SITE SETTINGS"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
