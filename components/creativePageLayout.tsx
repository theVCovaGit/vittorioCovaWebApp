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
    <section className="relative w-full min-h-screen bg-black font-basica text-[#fef4dc] pt-[10rem] sm:pt-[13.25rem] md:pt-[14.5rem] px-6 md:px-12 lg:px-24">
      
      {/* 📸 Hero image */}
      {heroImage && (
        <div className="absolute top-[18rem] left-[50vw] w-[47vw] h-[48vh] max-w-[800px] max-h-[600px] z-0 -translate-x-1/2">
          {heroImage}
        </div>
      )}

      {/* ⬇️ Downward dots */}
      <div
        className="hidden md:block absolute z-10"
        style={{
          top: "calc(30% + 5px)",
          left: "clamp(200px, 26vw, 420px)", // stable across resolutions
        }}
      >
        <DownwardDots />
      </div>

      {/* 🟡 Dot frame */}
      <div
        className="hidden md:block absolute z-10"
        style={{
          top: "calc(35% + 5px)",
          left: "clamp(400px, 43vw, 610px)", // matches design visually
        }}
      >
        <DotFrame />
      </div>

      {/* 📦 Page content */}
      <div className="relative z-20">{children}</div>
    </section>
  );
}
