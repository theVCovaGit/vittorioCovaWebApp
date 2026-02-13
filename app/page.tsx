"use client";

import { useShowMobileLayout } from "@/hooks/useMediaQuery";
import HeroMobile from "@/components/heroMobile";
import { useEffect } from "react";
import SlashVPattern from "@/components/slashVPattern";

export default function Hero() {
  const showMobileLayout = useShowMobileLayout();

  // Prevent main from scrolling; do NOT set overflow hidden on html/body or the root clips the slash pattern at the viewport
  useEffect(() => {
    const main = document.querySelector("main");
    const prevMain = main ? main.style.overflow : "";
    if (main) main.style.overflow = "hidden";
    return () => {
      if (main) main.style.overflow = prevMain;
    };
  }, []);

  if (showMobileLayout) {
    return <HeroMobile />;
  }

  // Desktop version
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden">
      <SlashVPattern />
    </div>
  );
  }





