"use client";

import React from "react";
import DownwardDots from "@/components/downwardDots";
import DotFrame from "@/components/dotFrame";

type CreativePageLayoutProps = {
  heroImage?: React.ReactNode;
  children?: React.ReactNode;
};

export default function CreativePageLayout({
  heroImage,
  children,
}: CreativePageLayoutProps) {
  return (
    <section className="relative w-full max-w-[1600px] mx-auto min-h-screen bg-black font-basica text-[#fef4dc] pt-[10rem] sm:pt-[13.25rem] md:pt-[14.5rem] px-6 md:px-12 lg:px-24">
      
      {/* 🖼️ Hero image */}
      <div
        className="hidden md:block absolute z-0"
        style={{
          top: "clamp(18rem, 18vh, 18rem)",
          left: "clamp(65vw, 72vw, 78vw)",
          width: "clamp(400px, 49vw, 800px)",
          height: "clamp(300px, 48vh, 600px)",
          transform: "translateX(-50%)",
        }}
      >
        {heroImage}
      </div>

      {/* ⬇️ Downward dots */}
      <div
        className="hidden md:block absolute z-10"
        style={{
          top: "calc(30% + 5px)",
          left: "clamp(280px, 34vw, 420px)",
        }}
      >
        <DownwardDots />
      </div>

      {/* 🟡 Dot frame — responsive and anchored */}
      <div
        className="hidden md:block absolute z-10"
        style={{
          top: "calc(21% + 5px)",
          right: "0",
          width: "clamp(420px, 24vw, 490px)", 
          height: "clamp(300px, 12vw, 240px)",
          transform: "scale(1.7)",
          transformOrigin: "top right",
        }}
      >
        <DotFrame />
      </div>

      {/* 📦 Page content */}
      <div className="relative z-20 w-full max-w-screen-xl mx-auto">
        {children}
      </div>
    </section>
  );
}
