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
      
      {/* Image */}
      {heroImage && (
        <div className="absolute top-[18rem] left-[50vw] w-[47vw] h-[48vh] z-0">
          {heroImage}
        </div>
      )}

      {/* Downwars dots */}
      <div
        className="hidden md:block absolute z-10"
        style={{
          top: "calc(30% + 5px)", // fine-tune as needed
          left: "clamp(420px, 12vw, 220px)", // responsive offset
        }}
      >
        <DownwardDots />
      </div>

      {/* Dots frame */}
      <div
        className="hidden md:block absolute z-10"
        style={{
          top: "calc(35% + 5px)", // fine-tune as needed
          left: "clamp(610px, 12vw, 220px)", // responsive offset
        }}
      >
        <DotFrame />
      </div>

      {/* ⬇️ Page content */}
      <div className="relative z-20">{children}</div>
    </section>
  );
}
