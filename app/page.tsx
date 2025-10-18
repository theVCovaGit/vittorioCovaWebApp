"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HeroAnimation from "@/components/heroAnimation";
import SignatureAnimation from "@/components/signatureAnimation";

export default function Hero() {
  const [showMainContent, setShowMainContent] = useState(false);

  // Automatically transition after signature completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMainContent(true);
    }, 7000); // adjust to match total signature animation time

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#5c4b4a] relative">
      {/* Logo - positioned absolutely so it doesn't affect text flow */}
      <div className="absolute top-32 left-[12vw] px-8">
        <img 
          src="/logos/logoYellow.png" 
          alt="Vittorio Cova Studio Logo" 
          className="h-16 w-auto"
        />
      </div>
      {/* Main Content */}
      <div className="pt-64 left-30 px-8 relative">
        <div className="flex items-start">
          <div className="flex items-center">
            <span className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide">
              VITTORIO COVA
            </span>
            <span className="text-[#FACC15] font-microextend text-xl font-bold uppercase tracking-wide mx-2">
              <svg width="80" height="4" viewBox="0 0 80 4" className="inline-block">
                <rect x="0" y="0" width="80" height="2" fill="#FACC15"/>
              </svg>
            </span>
            <span className="text-[#FACC15] font-microextend text-xl font-bold uppercase tracking-wide">
              STUDIO
            </span>
          </div>
          
          {/* Routes */}
          <div className="-ml-24 mt-10">
            <div className="mb-2">
              <Link 
                href="/architecture" 
                className="text-[#fef4dc] font-microextend text-sm font-bold uppercase tracking-wide hover:opacity-80 transition-opacity duration-200 no-underline"
              >
                ARCHITECTURE
              </Link>
            </div>
            <div className="mb-2">
              <Link 
                href="/productdesign" 
                className="text-[#fef4dc] font-microextend text-sm font-bold uppercase tracking-wide hover:opacity-80 transition-opacity duration-200 no-underline"
              >
                PRODUCT DESIGN
              </Link>
            </div>
            <div className="mb-2">
              <Link 
                href="/film" 
                className="text-[#fef4dc] font-microextend text-sm font-bold uppercase tracking-wide hover:opacity-80 transition-opacity duration-200 no-underline"
              >
                FILM
              </Link>
            </div>
            <div>
              <Link 
                href="/art" 
                className="text-[#fef4dc] font-microextend text-sm font-bold uppercase tracking-wide hover:opacity-80 transition-opacity duration-200 no-underline"
              >
                ART
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }





