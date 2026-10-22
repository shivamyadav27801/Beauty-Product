"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Plus, Minus, ShoppingBag, Zap } from "lucide-react";
import { useCart, CartProduct } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductActionsProps {
  product: CartProduct;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const isWished = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Quantity & Wishlist Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-neutral-300 rounded-md">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock}
            className="p-2.5 text-neutral-500 hover:text-neutral-900 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-4 py-2 text-sm font-semibold text-neutral-800 select-none">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
            disabled={isOutOfStock || quantity >= (product.stock || 99)}
            className="p-2.5 text-neutral-500 hover:text-neutral-900 disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
            isWished
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-neutral-300 hover:border-pink-300 text-neutral-700 bg-white"
          }`}
        >
          <Heart className="w-4 h-4" fill={isWished ? "currentColor" : "none"} />
          <span>{isWished ? "Saved" : "Save to Wishlist"}</span>
        </button>
      </div>

      {/* Action Buttons: Add to Cart and Buy Now */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="btn-primary py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ADD TO CART</span>
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="btn-dark py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>BUY IT NOW</span>
        </button>
      </div>
    </div>
  );
};
