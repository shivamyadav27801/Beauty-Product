"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useCart, CartProduct } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  compareAtPrice?: number;
  thumbnail: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  categoryName?: string;
  shortDescription?: string;
  sku?: string;
}

interface ProductCardProps {
  product: ProductItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const cartProduct: CartProduct = {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice,
    thumbnail: product.thumbnail,
    stock: product.stock ?? 50,
    sku: product.sku,
  };

  const isWished = isInWishlist(product._id);
  const rating = product.rating ?? 5.0;
  const reviewCount = product.reviewCount ?? 120;
  const displayPrice = product.salePrice || product.price;

  return (
    <div className="group bg-white rounded-lg border border-neutral-100 p-4 transition-all duration-300 hover:shadow-lg hover:border-pink-200 flex flex-col justify-between">
      <div>
        {/* Top bar with Wishlist heart */}
        <div className="flex justify-end mb-1">
          <button
            onClick={() => toggleWishlist(cartProduct)}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            className={`p-1.5 rounded-full transition-colors ${
              isWished
                ? "text-red-500 hover:text-red-600 bg-pink-50"
                : "text-neutral-400 hover:text-red-500 hover:bg-neutral-50"
            }`}
          >
            <Heart
              className="w-4 h-4 stroke-[1.8]"
              fill={isWished ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block w-full aspect-square overflow-hidden rounded-md bg-neutral-50/50 mb-4"
        >
          <Image
            src={product.thumbnail || "/images/products/niacinamide-serum.jpg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-2 group-hover:scale-106 transition-transform duration-500"
          />
        </Link>

        {/* Product Details */}
        <div className="text-center space-y-1.5">
          <Link
            href={`/products/${product.slug}`}
            className="block text-xs sm:text-sm font-semibold text-neutral-800 hover:text-[#b55b6c] transition-colors line-clamp-2 min-h-[38px] leading-snug"
          >
            {product.name}
          </Link>

          {/* Price */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm sm:text-base font-bold text-neutral-900">
              ₹{displayPrice}
            </span>
            {product.compareAtPrice && product.compareAtPrice > displayPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Star Rating with review count */}
          <div className="flex items-center justify-center gap-1 text-[#f59e0b] pt-0.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]"
                />
              ))}
            </div>
            <span className="text-[11px] text-neutral-500 font-medium ml-1">
              ({reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Add To Cart Button */}
      <div className="pt-4">
        <button
          onClick={() => addItem(cartProduct, 1)}
          className="w-full bg-[#b55b6c] hover:bg-[#9c3b4f] text-white text-xs font-semibold uppercase tracking-[0.14em] py-2.5 rounded transition-all duration-300 shadow-xs hover:shadow-md"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};
