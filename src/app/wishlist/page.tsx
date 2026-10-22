"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="bg-[#fcf8f9] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#b55b6c]">Home</Link>
          <span>/</span>
          <span className="text-neutral-800 font-medium">Wishlist</span>
        </nav>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-pink-100">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#b55b6c]">
              FAVORITE FORMULATIONS
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
              MY WISHLIST ({items.length})
            </h1>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#b55b6c] hover:underline uppercase tracking-wider">
            Explore All Products →
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xs border border-pink-100 p-12 text-center max-w-md mx-auto space-y-4">
            <Heart className="w-16 h-16 text-neutral-300 mx-auto stroke-[1.2]" />
            <h2 className="text-xl font-serif font-bold text-neutral-800">Your wishlist is empty</h2>
            <p className="text-xs text-neutral-500">
              Save your favorite luxury skincare and beauty rituals here to purchase anytime.
            </p>
            <Link href="/shop" className="btn-primary text-xs inline-block mt-2">
              BROWSE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((prod) => {
              const displayPrice = prod.salePrice || prod.price;
              return (
                <div
                  key={prod._id}
                  className="bg-white rounded-xl border border-neutral-100 shadow-xs p-4 flex flex-col justify-between group hover:shadow-md hover:border-pink-200 transition-all"
                >
                  <div>
                    {/* Remove Wishlist Button */}
                    <div className="flex justify-end mb-1">
                      <button
                        onClick={() => toggleWishlist(prod)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image */}
                    <Link
                      href={`/products/${prod.slug}`}
                      className="relative block aspect-square rounded-md overflow-hidden bg-neutral-50 mb-3"
                    >
                      <Image
                        src={prod.thumbnail || "/images/products/niacinamide-serum.jpg"}
                        alt={prod.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Name & Price */}
                    <div className="text-center space-y-1">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="text-xs font-semibold text-neutral-800 hover:text-[#b55b6c] line-clamp-2 min-h-[34px]"
                      >
                        {prod.name}
                      </Link>
                      <p className="text-sm font-bold text-neutral-900">₹{displayPrice}</p>
                    </div>
                  </div>

                  {/* Move to Cart */}
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        addItem(prod, 1);
                        toggleWishlist(prod);
                      }}
                      className="w-full btn-primary text-xs py-2.5 rounded flex items-center justify-center gap-1.5 uppercase tracking-wider"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>MOVE TO BAG</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
