"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function HeaderAnimation() {
  const { category, finalX, finalY, textSize, color } = useTransition();
  const [startSlideLeft, setStartSlideLeft] = useState(false);

  // ✅ Start slide when category is set, reset when it clears (e.g., route change)
  useEffect(() => {
    if (category) {
      console.log("📦 Using Transition Context:", { category, finalX, finalY, textSize });

      const timer = setTimeout(() => {
        console.log("🎬 Starting Slide Animation...");
        setStartSlideLeft(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      console.log("🧹 Category cleared, resetting slide state.");
      setStartSlideLeft(false);
    }
  }, [category]); // Only listen for category changes!

  if (!category) return null;

  return (
    <motion.div
      initial={{ x: finalX, y: finalY }}
      animate={{ x: startSlideLeft ? finalX - 340 : finalX, y: finalY }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed z-[99999] left-0 top-0 pointer-events-none"
      style={{
        fontSize: textSize,
        transform: `translate(${startSlideLeft ? finalX - 340 : finalX}px, ${finalY}px)`,
      }}
    >
    <span
    className="font-normal tracking-[-0.02em] whitespace-nowrap"
    style={{ color }} // Directly apply the color
    >
    {category === "product" ? "PRODUCT DESIGN" : category.toUpperCase()}
    </span>
    </motion.div>
  );
}
