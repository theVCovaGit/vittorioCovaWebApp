"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function HeaderMobile() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Hide header on home page
  if (pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#5c4b4a] h-16 flex items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center no-underline">
          <span className="text-[#fef4dc] font-microextend text-sm font-bold uppercase tracking-wide">
            VITTORIO COVA
          </span>
          <span className="text-[#fdf053] font-microextend text-sm font-bold uppercase tracking-wide ml-2">
            STUDIO
          </span>
        </Link>
        
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-50"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-[#fef4dc] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[#fef4dc] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[#fef4dc] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#5c4b4a] z-40 transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-8">
          <Link
            href="/architecture"
            onClick={() => setMenuOpen(false)}
            className="text-[#fef4dc] font-microextend text-2xl font-bold uppercase tracking-wide no-underline"
          >
            ARCHITECTURE
          </Link>
          <Link
            href="/productdesign"
            onClick={() => setMenuOpen(false)}
            className="text-[#fef4dc] font-microextend text-2xl font-bold uppercase tracking-wide no-underline"
          >
            PRODUCT DESIGN
          </Link>
          <Link
            href="/film"
            onClick={() => setMenuOpen(false)}
            className="text-[#fef4dc] font-microextend text-2xl font-bold uppercase tracking-wide no-underline"
          >
            FILM
          </Link>
          <Link
            href="/art"
            onClick={() => setMenuOpen(false)}
            className="text-[#fef4dc] font-microextend text-2xl font-bold uppercase tracking-wide no-underline"
          >
            ART
          </Link>
          
          {/* Divider */}
          <div className="w-20 h-0.5 bg-[#FACC15]"></div>
          
          <Link
            href="/store"
            onClick={() => setMenuOpen(false)}
            className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide no-underline"
          >
            STORE
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide no-underline"
          >
            ABOUT
          </Link>
        </nav>
      </div>
    </>
  );
}

