"use client";

import { useState } from "react";
import HeroAnimation from "@/components/heroAnimation";
import LoadingIntro from "@/components/loadingIntro";

export default function Hero() {
  const [showMainContent, setShowMainContent] = useState(false);

  return (
    <>
      {!showMainContent && <LoadingIntro onFinish={() => setShowMainContent(true)} />}

      {showMainContent && (
        <section className="flex-1 w-full bg-[#5c4b4a] text-black font-basica flex items-start justify-start px-10 md:px-24 lg:px-[409px] pt-[160px] sm:pt-[180px] md:pt-[200px]">
          <div className="absolute inset-0 bg-[#5c4b4a] z-0" />
          <HeroAnimation />
        </section>
      )}
    </>
  );
}
