"use client";

import React, { useEffect, useState, useRef } from "react";
import { useIconDisplay } from "@/context/IconDisplayContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import HorizontalDotOne from "@/components/horizontalDotOne";
import HorizontalDotTwo from "@/components/horizontalDotTwo";
import HorizontalDotThree from "@/components/horizontalDotThree";
import HorizontalDotFour from "@/components/horizontalDotFour";
import HorizontalDotFive from "@/components/horizontalDotFive";
import { useTransition } from "@/context/TransitionContext";


export default function Hero() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { setIconUrl } = useIconDisplay();
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState<1 | 2>(1);
  const { setTransition } = useTransition();

  const pathname = usePathname();
  const isCreativePage = ["/architecture", "/film", "/art", "/productdesign"].includes(pathname);
  const router = useRouter();

  const verticalSpacing = 80;
  const TEXT_SIZE = "1.9rem";

  const categoryColors: Record<string, string> = {
    architecture: "#92a982",
    product: "#8494ac",
    film: "#d7c97c",
    art: "#bc76b1",
  };
  

  const categoryOrder: Record<string, number> = {
    architecture: 0,
    product: 1,
    film: 2,
    art: 3,
  };

  const FIXED_FINAL_Y = categoryOrder["film"] * verticalSpacing; // Use FILM's position for all


  const categoryIcons: Record<string, string> = {
    architecture: "/icons/architecture.png",
    product: "/icons/productdesign.png",
    film: "/icons/film.png",
    art: "/icons/art.png",
  };

  const variants = {
    initial: { x: 0, y: 0, opacity: 1 },
    moveToTop: (distance: number) => ({
      y: -distance,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    }),
    fastMoveUpFade: (distance: number) => ({
      y: -distance,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    }),
    exitRight: {
      x: "1000%",
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  const handleHover = (category: string | null) => {
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    setHovered(category);

    if (category && categoryIcons[category]) {
      setIconUrl(categoryIcons[category]);
    } else {
      clearTimeoutRef.current = setTimeout(() => setIconUrl(null), 250);
    }
  };

  useEffect(() => () => setIconUrl(null), [setIconUrl]);

  const handleCategorySelect = (category: string) => {
    const yOffset = categoryOrder[category] * verticalSpacing;
    
    // Calculate the true initial X position (this accounts for your layout's left padding/margins)
    const baseLeft = window.innerWidth >= 1024 ? 409 : window.innerWidth >= 768 ? 96 : 40; 
    const originalX = baseLeft; // Matches your `left-[26.25rem]` (409px) or responsive values.
  
    console.log("📤 Preparing to Store Navigation Data:");
    console.log("📌 Category:", category);
    console.log("📏 Y Offset:", yOffset);
    console.log("📐 X Offset (Original):", originalX);
    console.log("🔠 Text Size:", TEXT_SIZE);
  
    setTransition({
        category,
        finalY: FIXED_FINAL_Y, 
        finalX: originalX,
        textSize: TEXT_SIZE,
        color: categoryColors[category],
      });
      console.log("🌍 HERO Viewport:", { width: window.innerWidth, height: window.innerHeight });
      console.log("📤 HERO Sending Transition Data:", {
        category,
        finalX: originalX,
        finalY: FIXED_FINAL_Y,
        textSize: TEXT_SIZE,
        color: categoryColors[category],
      });
    setSelectedCategory(category);
    setAnimationPhase(1);
  
    setTimeout(() => setAnimationPhase(2), 1200);
  
    setTimeout(() => {
      console.log("🚀 Navigating to:", `/${category === "product" ? "productdesign" : category}`);
      router.push(`/${category === "product" ? "productdesign" : category}`);
    }, 200);
  };
  

  return (
    <section className="flex-1 w-full bg-[#554943] text-black font-basica flex items-start justify-start px-10 md:px-24 lg:px-[409px] pt-[160px] sm:pt-[180px] md:pt-[200px]">
      <div className="flex flex-col space-y-6 absolute top-[10.375rem] left-10 sm:left-20 md:left-[21.65rem] z-[60]">
        <AnimatePresence>
          {["architecture", "product", "film", "art"].map((category) => {
            if (
              categoryOrder[category] === categoryOrder[selectedCategory!] &&
              !isCreativePage &&
              animationPhase === 2
            ) return null;

            return (
              <motion.div
                key={category}
                className="flex items-center"
                custom={
                  selectedCategory
                    ? categoryOrder[category] < categoryOrder[selectedCategory]
                      ? (categoryOrder[category] + 1) * verticalSpacing
                      : categoryOrder[selectedCategory] * verticalSpacing
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
                    : "exitRight"
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
                  data-category={category}
                  href={`/${category === "product" ? "productdesign" : category}`}
                  onMouseEnter={() => handleHover(category)}
                  onMouseLeave={() => handleHover(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategorySelect(category);
                  }}
                  className={`ml-6 text-[${TEXT_SIZE}] md:text-[2rem] font-normal tracking-[-0.02em] no-underline transition-opacity duration-200 z-[60] ${
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
    </section>
  );
}
