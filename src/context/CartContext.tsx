"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  thumbnail: string;
  stock: number;
  sku?: string;
  brand?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  couponCode: string;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("velvetique_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem("velvetique_coupon");
      if (savedCoupon) {
        const { code, percent } = JSON.parse(savedCoupon);
        setCouponCode(code);
        setDiscountPercent(percent);
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("velvetique_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Save coupon to localStorage
  useEffect(() => {
    if (isLoaded) {
      if (couponCode) {
        localStorage.setItem("velvetique_coupon", JSON.stringify({ code: couponCode, percent: discountPercent }));
      } else {
        localStorage.removeItem("velvetique_coupon");
      }
    }
  }, [couponCode, discountPercent, isLoaded]);

  const addItem = (product: CartProduct, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock || 99);
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock || 99) }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock || 99) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode("");
    setDiscountPercent(0);
  };

  const applyCoupon = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: "Please enter a coupon code" };
    }

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed, cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponCode(data.coupon.code);
        setDiscountPercent(data.coupon.discountPercent || 15);
        return {
          success: true,
          message: `Coupon ${data.coupon.code} applied successfully!`,
          discount: data.discount,
        };
      } else {
        return { success: false, message: data.message || "Invalid coupon code" };
      }
    } catch {
      // Fallback for demo coupon GLOW15 if offline/dev
      if (trimmed === "GLOW15") {
        setCouponCode("GLOW15");
        setDiscountPercent(15);
        return { success: true, message: "Coupon GLOW15 applied! (15% OFF)" };
      }
      return { success: false, message: "Failed to validate coupon" };
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscountPercent(0);
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const discount = Math.round((subtotal * discountPercent) / 100);
  const afterDiscount = Math.max(0, subtotal - discount);
  const shippingFee = subtotal > 0 && afterDiscount < 999 ? 99 : 0;
  const total = afterDiscount > 0 ? afterDiscount + shippingFee : 0;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        shippingFee,
        total,
        itemCount,
        couponCode,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
