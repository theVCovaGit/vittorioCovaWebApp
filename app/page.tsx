"use client";

import React from "react";
import HeroAnimation from "@/components/heroAnimation"; // Adjust the path as needed

export default function Hero() {
  return (
    <section className="flex-1 w-full bg-[#5c4b4a] text-black font-basica flex items-start justify-start px-10 md:px-24 lg:px-[409px] pt-[160px] sm:pt-[180px] md:pt-[200px]">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[#5c4b4a] z-0" />
      
      {/* Animated Categories */}
      <HeroAnimation />
    </section>
  );
}
