"use client";

import React, { useEffect, useState, useRef } from "react";
import { useIconDisplay } from "@/context/IconDisplayContext";
import { motion, AnimatePresence } from "framer-motion";

import HorizontalDotOne from "@/components/horizontalDotOne";
import HorizontalDotTwo from "@/components/horizontalDotTwo";
import HorizontalDotThree from "@/components/horizontalDotThree";
import HorizontalDotFour from "@/components/horizontalDotFour";
import HorizontalDotFive from "@/components/horizontalDotFive";



export default function Hero() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { setIconUrl } = useIconDisplay();
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState<1 | 2>(1);


  const categoryOrder: Record<string, number> = {
    architecture: 0,
    product: 1,
    film: 2,
    art: 3,
  };

  const variants = {
    initial: { x: 0, y: 0, opacity: 1 },
    moveToTop: (distance: number) => ({
      y: -distance,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
    fastMoveUpFade: (distance: number) => ({
      y: -distance,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    }),
    exitLeft: (index: number) => ({
      x: "-300%",
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeInOut" },
    }),
  };
  
  
  const verticalSpacing = 50; // Adjust this to match your design's line spacing

  

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
      <AnimatePresence>
  {["architecture", "product", "film", "art"].map((category) => {
    const index = categoryOrder[category];

    // Determine if this should animate out
    const shouldExit = selectedCategory && selectedCategory !== category;

    return (
      <motion.div
  key={category} // Keep it stable
  className="flex items-center"
  custom={
    selectedCategory
      ? (categoryOrder[category] < categoryOrder[selectedCategory]
          ? (categoryOrder[category] + 1) * verticalSpacing // Above items
          : categoryOrder[selectedCategory] * verticalSpacing) // Clicked item moves to top
      : 0
  }
  initial="initial"
  animate={
    !selectedCategory
      ? "initial"
      : categoryOrder[category] < categoryOrder[selectedCategory!]
        ? "fastMoveUpFade"
        : categoryOrder[category] === categoryOrder[selectedCategory!]
          ? "moveToTop"
          : animationPhase === 2
            ? "exitLeft" // This now correctly activates only in Phase 2
            : "initial"
  }
  variants={variants}
      >


        {/* Dots */}
        <div className="flex items-center">
          <HorizontalDotOne className="w-[6px] h-[6px] mx-[1px]" />
          <HorizontalDotTwo className="w-[6px] h-[6px] mx-[1px]" />
          <HorizontalDotThree className="w-[6px] h-[6px] mx-[1px]" />
          <HorizontalDotFour className="w-[6px] h-[6px] mx-[1px]" />
          <HorizontalDotFive className="w-[6px] h-[6px] mx-[1px]" />
        </div>

        {/* Text */}
        <a
          href={`/${category === "product" ? "productdesign" : category}`}
          onMouseEnter={() => handleHover(category)}
          onMouseLeave={() => handleHover(null)}
          onClick={(e) => {
            e.preventDefault();
            setSelectedCategory(category);
            setAnimationPhase(1);
          
            // Start Phase 2 after moveUp finishes (~400ms)
            setTimeout(() => {
              setAnimationPhase(2);
            }, 400);
          
            // Navigate after both animations finish (~900ms total)
            setTimeout(() => {
              window.location.href = `/${category === "product" ? "productdesign" : category}`;
            }, 900);
          }}
          
          className={`ml-6 text-[1.9rem] md:text-[2rem] font-normal tracking-[-0.02em] no-underline transition-opacity duration-200 z-[60] ${
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
      </motion.div>
    );
  })}
</AnimatePresence>

</div>


      {/*
      <div className="absolute top-[desiredValue] left-[desiredValue] z-[50]">
      <HorizontalDots className="scale-[1.5] sm:scale-[2] md:scale-[2.5]" />
  ````</div>
  ````*/}
    </section>
  );
}
