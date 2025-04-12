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
      
      {/* Hero image */}
      <div
        className="hidden md:block absolute z-0"
        style={{
          top: "18rem",
          left: "70vw",
          width: "47vw",
          height: "48vh",
          maxWidth: "800px",
          maxHeight: "600px",
          transform: "translateX(-50%)",
        }}
      >
        {heroImage}
      </div>

      {/* ⬇Downward dots */}
      <div
        className="hidden md:block absolute z-10"
        style={{
          top: "calc(30% + 5px)",
          left: "clamp(200px, 26vw, 420px)", // stable across resolutions
        }}
      >
        <DownwardDots />
      </div>

    {/* 🟡 Dot frame — responsive but rendered correctly */}
    <div
    className="hidden md:block absolute z-10"
    style={{
        top: "calc(32% + 5px)",
        right: "0",
        width: "clamp(480px, 24vw, 490px)", // ⬅️ Responsive width
        height: "clamp(240px, 12vw, 240px)", // ⬅️ Responsive height
        minWidth: "300px", // ⛑️ Guardrails
        minHeight: "150px",
        transform: "scale(1.5)",
        transformOrigin: "top right",
    }}
    >
    <DotFrame />
    </div>


      {/* 📦 Page content */}
      <div className="relative z-20">{children}</div>
    </section>
  );
}
