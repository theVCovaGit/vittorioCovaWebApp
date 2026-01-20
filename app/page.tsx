"use client";

import Link from "next/link";
import { useIsMobile } from "@/hooks/useMediaQuery";
import HeroMobile from "@/components/heroMobile";
import { useEffect } from "react";
import SlashVPattern from "@/components/slashVPattern";

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
      {/* Slash and V Pattern Background */}
      <SlashVPattern />
      
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
        </div>
      </div>
    </div>
  );
  }





