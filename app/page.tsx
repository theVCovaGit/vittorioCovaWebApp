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
      <div className="pt-40 left-30 pl-0 ml-8 relative">
        <div className="flex items-start">
          <div className="flex items-center">
            <span className="text-[#fec776] font-blurlight text-3xl font-bold uppercase tracking-wide">
              VITTORIO
            </span>
            <span className="text-[#fec776] font-blurlight text-3xl font-bold uppercase tracking-wide ml-24">
              COVA
            </span>
            <span className="text-[#fec776] font-blurlight text-3xl font-bold uppercase tracking-wide ml-24">
              STUDIO
            </span>
            <span className="text-[#fec776] font-blurlight text-sm font-bold uppercase tracking-wide ml-1 relative top-1">
              ©
            </span>
          </div>
        </div>
      </div>
    </div>
  );
  }





