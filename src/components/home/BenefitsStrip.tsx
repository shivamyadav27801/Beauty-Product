"use client";

import React from "react";
import { Sparkles, FlaskConical, HeartHandshake, Globe } from "lucide-react";

export const BenefitsStrip: React.FC = () => {
  const benefits = [
    {
      icon: (
        <svg
          className="w-7 h-7 text-[#b55b6c]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Elegant botanical leaf */}
          <path d="M12 22C12 22 20 18 20 10C20 4.5 15.5 2 12 2C8.5 2 4 4.5 4 10C4 18 12 22 12 22Z" />
          <path d="M12 2V22" />
          <path d="M12 9C15 9 17 7 17 7" />
          <path d="M12 14C9 14 7 12 7 12" />
        </svg>
      ),
      title: "Clean Ingredients",
      subtitle: "Safe & toxin-free",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 text-[#b55b6c]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Flask / Lab beaker */}
          <path d="M10 2v5.5a1.5 1.5 0 0 1-.3 1L3.3 18.2A2 2 0 0 0 5 21.5h14a2 2 0 0 0 1.7-3.3L14.3 8.5a1.5 1.5 0 0 1-.3-1V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
        </svg>
      ),
      title: "Clinically Proven",
      subtitle: "Dermatologically tested",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 text-[#b55b6c]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized Bunny / Cruelty-free mark */}
          <path d="M10 5C9 3 7 2 5.5 3C4 4 4.5 6 6 8.5L7 10" />
          <path d="M14 5C15 3 17 2 18.5 3C20 4 19.5 6 18 8.5L17 10" />
          <path d="M7 10C5 12 5 16 8 18C11 20 15 20 18 18C21 16 21 12 17 10C15 9 9 9 7 10Z" />
          <circle cx="10" cy="13" r="1" fill="currentColor" />
          <circle cx="14" cy="13" r="1" fill="currentColor" />
        </svg>
      ),
      title: "Cruelty Free",
      subtitle: "We never test on animals",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 text-[#b55b6c]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Earth / Sustainable */}
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
      title: "Sustainable Beauty",
      subtitle: "Good for you & the planet",
    },
  ];

  return (
    <div className="relative z-20 -mt-6 sm:-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-md border border-neutral-100 py-6 px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3.5 ${
                idx > 0 ? "pt-4 md:pt-0 md:pl-6" : ""
              } ${idx === 1 ? "pt-0" : ""}`}
            >
              <div className="flex-shrink-0 p-2 bg-[#fdf5f6] rounded-full">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 tracking-wide font-sans">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-light mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
