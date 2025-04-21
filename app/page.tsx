"use client";

import React from "react";

export default function Hero() {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const categoryIcons: Record<string, string> = {
    architecture: "/icons/architecture.png",
    product: "/icons/productdesign.png",
    film: "/icons/film.png",
    art: "/icons/art.png",
  };
  

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
      {hovered && (
  <div className="hidden md:block absolute top-[4.25rem] left-[26.25rem] w-[9rem] h-auto z-[61]">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 144 75"
      fill="none"
      className="w-full h-auto absolute top-0 left-0"
    >
      <g clipPath="url(#clip0_18_57)">
        <path d="M25.7093 0.705688H0.694824V26.1103" stroke="#FFF3DF" strokeMiterlimit="10" />
        <path d="M0.694824 48.8897V74.2943H25.7093" stroke="#FFF3DF" strokeMiterlimit="10" />
        <path d="M118.277 74.2943H143.305V48.8897" stroke="#FFF3DF" strokeMiterlimit="10" />
        <path d="M143.305 26.1103V0.705688H118.277" stroke="#FFF3DF" strokeMiterlimit="10" />
      </g>
      <defs>
        <clipPath id="clip0_18_57">
          <rect width="144" height="75" fill="white" />
        </clipPath>
      </defs>
    </svg>

    {/* 🖼️ Icon appears only while hovering a category */}
    <img
      src={categoryIcons[hovered]}
      alt={`${hovered} icon`}
      className="absolute top-1 left-1 w-[7.5rem] h-[4rem] object-contain z-10"
    />
  </div>
)}

    </section>
  );
}
