"use client";

import Link from "next/link";
import { useIsMobile } from "@/hooks/useMediaQuery";
import HeroMobile from "@/components/heroMobile";
import { useEffect } from "react";

export default function Hero() {
  const isMobile = useIsMobile();

  // Disable scrolling on mobile main page
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    }
  }, [isMobile]);

  // Mobile version
  if (isMobile) {
    return <HeroMobile />;
  }

  // Desktop version (original)
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden">
      {/* Main Content */}
      <div className="pt-36 left-30 pl-0 -ml-6 relative">
        <div className="flex items-start">
          <div className="flex items-center">
            <span className="text-[#fef4dc] font-blurlight text-xl font-bold uppercase tracking-wide">
              VITTORIO COVA
            </span>
            <span className="text-[#fec776] font-blurlight text-xl font-bold uppercase tracking-wide mx-2">
              <svg width="80" height="4" viewBox="0 0 80 4" className="inline-block">
                <rect x="0" y="0" width="80" height="2" fill="#fec776"/>
              </svg>
            </span>
            <span className="text-[#fec776] font-blurlight text-xl font-bold uppercase tracking-wide">
              STUDIO
            </span>
          </div>
          
          {/* Routes */}
          <div className="-ml-24 mt-10">
            <div className="mb-2 group">
              <Link 
                href="/architecture" 
                className="relative inline-block text-[#fef4dc] font-blurlight text-sm font-bold uppercase tracking-wide no-underline"
              >
                ARCHITECTURE
                <img 
                  src="/assets/onHover.png" 
                  alt="Hover indicator" 
                  className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 h-7 w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </Link>
            </div>
            <div className="mb-2 group">
              <Link 
                href="/film" 
                className="relative inline-block text-[#fef4dc] font-blurlight text-sm font-bold uppercase tracking-wide no-underline"
              >
                FILM
                <img 
                  src="/assets/onHover.png" 
                  alt="Hover indicator" 
                  className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 h-7 w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </Link>
            </div>
            <div className="group">
              <Link 
                href="/art" 
                className="relative inline-block text-[#fef4dc] font-blurlight text-sm font-bold uppercase tracking-wide no-underline"
              >
                ART
                <img 
                  src="/assets/onHover.png" 
                  alt="Hover indicator" 
                  className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 h-7 w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }





