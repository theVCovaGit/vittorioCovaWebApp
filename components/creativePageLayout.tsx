"use client";

import React from "react";
import DownwardDots from "@/components/downwardDots";

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
      
      {/* ⬇️ Hero image positioning from your Figma-based layout */}
      {heroImage && (
        <div className="absolute top-[18rem] left-[50vw] w-[47vw] h-[48vh] z-0">
          {heroImage}
        </div>
      )}

      {/* ⬇️ Dots positioned precisely from Figma */}
      <div
        className="hidden md:block absolute z-10"
        style={{
          top: "calc(30% + 5px)", // fine-tune as needed
          left: "clamp(420px, 12vw, 220px)", // responsive offset
        }}
      >
        <DownwardDots />
      </div>

      {/* ⬇️ Page content */}
      <div className="relative z-20">{children}</div>
    </section>
  );
}
