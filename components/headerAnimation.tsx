"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function HeaderAnimation() {
  const { category, finalX, finalY, textSize, color } = useTransition();
  const [startSlideLeft, setStartSlideLeft] = useState(false);

  // ✅ Start slide when category is set, reset when it clears (e.g., route change)
  useEffect(() => {
    console.log("🌍 HEADER Viewport:", { width: window.innerWidth, height: window.innerHeight });
    console.log("📥 HEADER Received Transition Data:", { category, finalX, finalY, textSize, color });
    
    if (category) {
      console.log("📦 Using Transition Context:", { category, finalX, finalY, textSize });

      const timer = setTimeout(() => {
        console.log("🎬 Starting Slide Animation...");
        setStartSlideLeft(true);
      }, 2100);

      return () => clearTimeout(timer);
    } else {
      console.log("🧹 Category cleared, resetting slide state.");
      setStartSlideLeft(false);
    }
  }, [category]); // Only listen for category changes!

  if (!category) return null;

  return (
    <motion.div
    initial={{ x: 0, y: 0 }} // Reset to 0, handled by CSS instead
    animate={{ x: startSlideLeft ? -326 : 0, y: 0 }} // Only animate the slide left
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="fixed z-[99999] pointer-events-none"
    style={{
      left: `${finalX}px`,
      top: `${finalY}px`,
      fontSize: textSize,
      transform: `translateX(${startSlideLeft ? -326 : 0}px)`,
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
