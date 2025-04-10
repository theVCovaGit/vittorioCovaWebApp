"use client";

import React from "react";

export default function Hero() {
  return (
    <section className="flex-1 w-full bg-[#5c4b4a] text-black font-basica flex items-start justify-start px-10 md:px-24 lg:px-[409px] pt-[160px] sm:pt-[180px] md:pt-[200px]">
      <div className="flex flex-col space-y-6">
        <h2 className="text-[1.9rem] md:text-[2rem] tracking-[-0.02em] font-normal w-fit">
          ARCHITECTURE
        </h2>

        <h2 className="text-[1.9rem] md:text-[2rem] tracking-[-0.02em] font-normal w-fit">
          PRODUCT DESIGN
        </h2>

        <h2 className="text-[1.9rem] md:text-[2rem] tracking-[-0.02em] font-normal w-fit">
          FILM
        </h2>

        <h2 className="text-[1.9rem] md:text-[2rem] tracking-[-0.02em] font-normal w-fit">
          ART
        </h2>
      </div>
    </section>
  );
}
