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
    <header className="fixed top-0 left-0 w-full z-50 bg-[#5c4b4a] h-16 flex items-center px-4">
      {/* Logo/Brand */}
      <Link href="/" className="flex items-center no-underline">
        <span className="text-[#fef4dc] font-microextend text-sm font-bold uppercase tracking-wide">
          VITTORIO COVA
        </span>
        <span className="text-[#fdf053] font-microextend text-sm font-bold uppercase tracking-wide ml-2">
          STUDIO
        </span>
      </Link>
    </header>
  );
}

