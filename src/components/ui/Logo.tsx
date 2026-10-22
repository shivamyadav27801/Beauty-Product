import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = "dark", className = "" }) => {
  const isLight = variant === "light";
  const textColor = isLight ? "text-white" : "text-[#2b1520]";
  const subColor = isLight ? "text-pink-200" : "text-[#7a4855]";
  const iconColor = isLight ? "#fbcfe8" : "#b55b6c";

  return (
    <Link href="/" className={`inline-flex flex-col items-center group select-none ${className}`}>
      {/* Botanical floral emblem */}
      <div className="flex items-center justify-center mb-0.5">
        <svg
          width="32"
          height="22"
          viewBox="0 0 40 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Central delicate bud */}
          <path
            d="M20 5C20 5 18 10 18 14C18 17 19 18 20 18C21 18 22 17 22 14C22 10 20 5 20 5Z"
            fill={iconColor}
          />
          {/* Left petals & leaves */}
          <path
            d="M17 14C14 11 8 10 6 12C4 14 7 18 12 17C14 16.5 16 15 17 14Z"
            fill={iconColor}
            opacity="0.85"
          />
          <path
            d="M18 18C14 18 9 20 8 23C7 25 11 26 15 22C16.5 20.5 17.5 19 18 18Z"
            fill={iconColor}
            opacity="0.75"
          />
          {/* Right petals & leaves */}
          <path
            d="M23 14C26 11 32 10 34 12C36 14 33 18 28 17C26 16.5 24 15 23 14Z"
            fill={iconColor}
            opacity="0.85"
          />
          <path
            d="M22 18C26 18 31 20 32 23C33 25 29 26 25 22C23.5 20.5 22.5 19 22 18Z"
            fill={iconColor}
            opacity="0.75"
          />
          {/* Stem base */}
          <circle cx="20" cy="20" r="1.5" fill={iconColor} />
        </svg>
      </div>

      {/* Brand Name */}
      <span
        className={`font-serif text-lg md:text-[22px] tracking-[0.22em] font-medium leading-tight uppercase ${textColor}`}
      >
        VELVETIQUE
      </span>
      <span
        className={`text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-light -mt-0.5 ${subColor}`}
      >
        BEAUTY
      </span>
    </Link>
  );
};
