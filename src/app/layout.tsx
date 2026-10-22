import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Velvetique Beauty — Radiant Skin. Real Confidence.",
  description:
    "Velvetique Beauty delivers clean, dermatologist-tested, and cruelty-free luxury skincare, makeup, haircare, and bodycare essentials for an effortless natural glow.",
  keywords: [
    "Velvetique Beauty",
    "clean skincare",
    "luxury beauty",
    "niacinamide serum",
    "face wash",
    "gel moisturizer",
    "matte lipstick",
    "cruelty free beauty",
  ],
  openGraph: {
    title: "Velvetique Beauty — Radiant Skin. Real Confidence.",
    description: "Clean beauty that nourishes, enhances and empowers you.",
    url: "https://velvetiquebeauty.com",
    siteName: "Velvetique Beauty",
    images: [
      {
        url: "/images/hero/hero-slide-1.jpg",
        width: 1200,
        height: 630,
        alt: "Velvetique Beauty Luxury Skincare",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className="font-sans text-neutral-800 antialiased selection:bg-[#f2b5c0] selection:text-[#3a1f2c]">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <StorefrontShell>{children}</StorefrontShell>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
