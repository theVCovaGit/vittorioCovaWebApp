"use client";

import { useShowMobileLayout } from "@/hooks/useMediaQuery";
import HeroMobile from "@/components/heroMobile";
import { useEffect } from "react";
import SlashVPattern from "@/components/slashVPattern";
import CactusBackdrop from "@/components/cactusBackdrop";

export default function Hero() {
  const showMobileLayout = useShowMobileLayout();

  // Disable all scrolling (horizontal + vertical) on main page
  useEffect(() => {
    const main = document.querySelector("main");
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    const prevMain = main ? main.style.overflow : "";

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (main) main.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      if (main) main.style.overflow = prevMain;
    };
  }, []);

  if (showMobileLayout) {
    return <HeroMobile />;
  }

  // Desktop version
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden">
      {/* Backdrop first: it and SlashVPattern are both z-0, so source order keeps it behind */}
      <CactusBackdrop />
      <SlashVPattern />
    </div>
  );
  }





