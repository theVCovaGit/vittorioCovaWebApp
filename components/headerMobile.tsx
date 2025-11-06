"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function HeaderMobile() {
  const pathname = usePathname();
  
  // Hide header on home page
  if (pathname === "/") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#5c4b4a] flex items-center justify-center px-4" style={{ height: 'var(--mobile-header-height)' }}>
      {/* Logo/Brand - Centered */}
      <Link href="/" className="flex flex-col items-center justify-center no-underline leading-none">
        <span className="text-[#fef4dc] font-microextend text-2xl font-bold uppercase tracking-wide">
          VITTORIO COVA
        </span>
        <span className="text-[#fdf053] font-microextend text-2xl font-bold uppercase tracking-wide">
          STUDIO
        </span>
      </Link>
    </header>
  );
}

