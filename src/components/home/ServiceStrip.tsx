"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

export const ServiceStrip: React.FC = () => {
  const services = [
    {
      icon: <Truck className="w-6 h-6 text-[#b55b6c]" strokeWidth={1.75} />,
      title: "FREE SHIPPING",
      description: "On orders over ₹999",
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-[#b55b6c]" strokeWidth={1.75} />,
      title: "EASY RETURNS",
      description: "15 days return policy",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#b55b6c]" strokeWidth={1.75} />,
      title: "SECURE PAYMENT",
      description: "100% secure checkout",
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#b55b6c]" strokeWidth={1.75} />,
      title: "24/7 SUPPORT",
      description: "We're here to help",
    },
  ];

  return (
    <section className="bg-[#fcf5f6] border-t border-b border-[#f4dee2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((srv, idx) => (
            <div key={idx} className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="flex-shrink-0 p-2.5 bg-white rounded-full shadow-xs border border-pink-100">
                {srv.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-800 tracking-wider uppercase font-sans">
                  {srv.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-light mt-0.5">
                  {srv.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
