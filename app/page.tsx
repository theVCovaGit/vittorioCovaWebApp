"use client";

import { useState, useEffect } from "react";
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
    <>
      {!showMainContent && (
        <div className="fixed inset-0 z-[50000] bg-[#2b1d1d] flex items-center justify-center">
          <SignatureAnimation />
        </div>
      )}

      {showMainContent && (
        <section className="flex-1 w-full bg-[#5c4b4a] text-black font-basica flex items-start justify-start px-10 md:px-24 lg:px-[409px] pt-[160px] sm:pt-[180px] md:pt-[200px]">
          <div className="absolute inset-0 bg-[#5c4b4a] z-0" />
          <HeroAnimation />
        </section>
      )}
    </>
  );
}
