"use client";

import React from "react";
import DownwardDots from "@/components/downwardDots";

type CreativePageLayoutProps = {
  children?: React.ReactNode;
};

export default function CreativePageLayout({ children }: CreativePageLayoutProps) {
  return (
    <section className="relative w-full min-h-screen bg-black font-basica text-[#fef4dc] pt-[10rem] sm:pt-[13.25rem] md:pt-[14.5rem] px-6 md:px-12 lg:px-24">
        {/* Dots positioned precisely from Figma */}
        <div
        className="hidden md:block absolute z-10"
        style={{
            top: "calc(30% + 5px)",  // adjust vertical shift here
            left: "clamp(360px, 12vw, 220px)",  // responsive left offset
        }}
        >
        <DownwardDots />
        </div>
        {/* Page content */}
        <div className="relative z-20">{children}</div>
        </section>
  );
}
