"use client";

import React, { useEffect, useState, useRef } from "react";
import { useIconDisplay } from "@/context/IconDisplayContext";

export default function Hero() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { setIconUrl } = useIconDisplay();
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categoryIcons: Record<string, string> = {
    architecture: "/icons/architecture.png",
    product: "/icons/productdesign.png",
    film: "/icons/film.png",
    art: "/icons/art.png",
  };

  const handleHover = (category: string | null) => {
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
    }

    setHovered(category);

    if (category && categoryIcons[category]) {
      const icon = categoryIcons[category];
      console.log(`🖼️ Hovering: ${category} — Setting icon URL to: ${icon}`);
      setIconUrl(icon);
    } else {
      clearTimeoutRef.current = setTimeout(() => {
        console.log("🚫 Hover ended — Clearing icon URL");
        setIconUrl(null);
      }, 250); // small delay to reduce flicker
    }
  };

  useEffect(() => {
    return () => {
      console.log("🧹 Unmounting Hero — Resetting iconUrl");
      setIconUrl(null);
    };
  }, [setIconUrl]);

  return (
    <section className="flex-1 w-full bg-[#5c4b4a] text-black font-basica flex items-start justify-start px-10 md:px-24 lg:px-[409px] pt-[160px] sm:pt-[180px] md:pt-[200px]">
      <div className="flex flex-col space-y-6 absolute top-[10.375rem] left-10 sm:left-20 md:left-[26.25rem] z-[60]">
        {["architecture", "product", "film", "art"].map((category) => (
          <a
            key={category}
            href={`/${category === "product" ? "productdesign" : category}`}
            onMouseEnter={() => handleHover(category)}
            onMouseLeave={() => handleHover(null)}
            className={`text-[1.9rem] md:text-[2rem] font-normal w-fit tracking-[-0.02em] no-underline transition-opacity duration-200 z-[60] ${
              hovered === category
                ? category === "architecture"
                  ? "text-[#92a982]"
                  : category === "product"
                  ? "text-[#8494ac]"
                  : category === "film"
                  ? "text-[#d7c97c]"
                  : "text-[#bc76b1]"
                : "text-[#fef4dc]"
            }`}
          >
            {category === "product" ? "PRODUCT DESIGN" : category.toUpperCase()}
          </a>
        ))}
      </div>
    </section>
  );
}
