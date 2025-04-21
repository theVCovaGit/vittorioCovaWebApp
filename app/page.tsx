"use client";

import React from "react";

export default function Hero() {
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <section className="flex-1 w-full bg-[#5c4b4a] text-black font-basica flex items-start justify-start px-10 md:px-24 lg:px-[409px] pt-[160px] sm:pt-[180px] md:pt-[200px]">
      <div className="flex flex-col space-y-6 absolute top-[10.375rem] left-10 sm:left-20 md:left-[26.25rem] z-[60]">
        {/* ARCHITECTURE */}
        <a
          href="/architecture"
          onMouseEnter={() => setHovered("architecture")}
          onMouseLeave={() => setHovered(null)}
          className={`text-[1.9rem] md:text-[2rem] tracking-[-0.02em] font-normal w-fit no-underline transition-opacity duration-200 z-[60] ${
            hovered === "architecture" ? "text-[#92a982]" : "text-[#fef4dc]"
          }`}
        >
          ARCHITECTURE
        </a>

        {/* PRODUCT DESIGN */}
        <h2
          onMouseEnter={() => setHovered("product")}
          onMouseLeave={() => setHovered(null)}
          className={`text-[1.9rem] md:text-[2rem] tracking-[-0.02em] font-normal w-fit z-[60] ${
            hovered === "product" ? "text-[#8494ac]" : "text-[#fef4dc]"
          }`}
        >
          PRODUCT DESIGN
        </h2>

        {/* FILM */}
        <h2
          onMouseEnter={() => setHovered("film")}
          onMouseLeave={() => setHovered(null)}
          className={`text-[1.9rem] md:text-[2rem] tracking-[-0.02em] font-normal w-fit z-[60] ${
            hovered === "film" ? "text-[#d7c97c]" : "text-[#fef4dc]"
          }`}
        >
          FILM
        </h2>

        {/* ART */}
        <h2
          onMouseEnter={() => setHovered("art")}
          onMouseLeave={() => setHovered(null)}
          className={`text-[1.9rem] md:text-[2rem] tracking-[-0.02em] font-normal w-fit z-[60] ${
            hovered === "art" ? "text-[#bc76b1]" : "text-[#fef4dc]"
          }`}
        >
          ART
        </h2>
      </div>
    </section>
  );
}
