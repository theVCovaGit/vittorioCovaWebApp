"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";


export default function HeaderAnimation() {
    const { category, finalX, finalY, textSize } = useTransition();
    const [startSlideLeft, setStartSlideLeft] = useState(false);
  
    useEffect(() => {
      if (category) {
        console.log("📦 Using Transition Context:", { category, finalX, finalY, textSize });
        setTimeout(() => setStartSlideLeft(true), 300);
      }
    }, [category]);
  
    if (!category) return null;
  
    return (
      <motion.div
        initial={{ x: finalX, y: finalY }}
        animate={{ x: startSlideLeft ? finalX - 340 : finalX, y: finalY }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed z-[99999] left-0 top-0 pointer-events-none"
        style={{ fontSize: textSize }}
      >
        <span className="text-[#fef4dc] font-normal tracking-[-0.02em] whitespace-nowrap">
          {category === "product" ? "PRODUCT DESIGN" : category.toUpperCase()}
        </span>
      </motion.div>
    );
  }
