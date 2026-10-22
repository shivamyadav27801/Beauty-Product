"use client";

import React, { useState, useEffect } from "react";
import { Users, Mail, Loader2 } from "lucide-react";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((res) => res.json())
      .then((data) => {
        if (data.subscribers) setSubscribers(data.subscribers);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
          AUDIENCE
        </span>
        <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide mt-1">
          NEWSLETTER SUBSCRIBERS ({subscribers.length})
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-7 h-7 animate-spin text-[#b55b6c]" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-xs">
            No newsletter subscribers yet.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#faf5f6] text-[11px] uppercase font-bold text-neutral-700 tracking-wider">
              <tr>
                <th className="py-3 px-6">Subscriber Email</th>
                <th className="py-3 px-6">Subscription Date</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {subscribers.map((sub) => (
                <tr key={sub._id} className="hover:bg-neutral-50/50">
                  <td className="py-3.5 px-6 font-semibold text-neutral-900">{sub.email}</td>
                  <td className="py-3.5 px-6 text-neutral-500">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-800">
                      Subscribed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
