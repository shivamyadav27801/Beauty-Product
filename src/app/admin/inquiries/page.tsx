"use client";

import React, { useState, useEffect } from "react";
import { Mail, Calendar, Phone, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inquiries")
      .then((res) => res.json())
      .then((data) => {
        if (data.inquiries) setInquiries(data.inquiries);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
          CRM &amp; SUPPORT
        </span>
        <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide mt-1">
          CONTACT INQUIRIES ({inquiries.length})
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-7 h-7 animate-spin text-[#b55b6c]" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-xs">
            No contact inquiries received yet.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {inquiries.map((inq) => (
              <div key={inq._id} className="p-6 space-y-3 hover:bg-neutral-50/50">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900">{inq.subject}</h2>
                    <div className="flex items-center gap-3 text-neutral-500 mt-0.5">
                      <span>From: <strong>{inq.name}</strong></span>
                      <span>•</span>
                      <a href={`mailto:${inq.email}`} className="text-[#b55b6c] underline">
                        {inq.email}
                      </a>
                      {inq.phone && (
                        <>
                          <span>•</span>
                          <span>{inq.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {new Date(inq.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="p-4 bg-[#faf5f6] rounded-lg border border-pink-100/60 text-xs text-neutral-700 leading-relaxed">
                  {inq.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
