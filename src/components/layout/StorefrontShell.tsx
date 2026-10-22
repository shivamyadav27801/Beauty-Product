"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";
import { SearchModal } from "./SearchModal";
import { WhatsAppButton } from "../ui/WhatsAppButton";
import { SmoothScroll } from "../ui/SmoothScroll";

export const StorefrontShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [searchOpen, setSearchOpen] = useState(false);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-white relative">
        <AnnouncementBar />
        <Header onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <WhatsAppButton />
      </div>
    </SmoothScroll>
  );
};
