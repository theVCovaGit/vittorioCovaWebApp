import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function HeaderAnimation() {
  const { category, finalX, finalY, textSize } = useTransition();
  const textRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [startSlideLeft, setStartSlideLeft] = useState(false);

  const categoryColors: Record<string, string> = {
    architecture: "#92a982",
    product: "#8494ac",
    film: "#d7c97c",
    art: "#bc76b1",
  };

  const color = category ? categoryColors[category] || "#000" : "#000";

  useLayoutEffect(() => {
    if (textRef.current) {
      const width = textRef.current.offsetWidth;
      setTextWidth(width);
    }
  }, [category]);

  useEffect(() => {
    if (category) {
      const timer = setTimeout(() => {
        setStartSlideLeft(true);
      }, 2100);
      return () => clearTimeout(timer);
    } else {
      setStartSlideLeft(false);
    }
  }, [category]);

  if (!category) return null;

  const targetRightEdgeX = -30;
  const computedX = startSlideLeft ? targetRightEdgeX - textWidth : 0;

  return (
    <motion.div
      initial={{ x: 0, y: 0 }}
      animate={{ x: computedX, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed z-[99999] pointer-events-none"
      style={{
        left: `${finalX}px`,
        top: `${finalY}px`,
        fontSize: textSize,
      }}
    >
      <span
        ref={textRef}
        className="font-normal tracking-[-0.02em] whitespace-nowrap"
        style={{ color }}
      >
        {category === "product" ? "PRODUCT DESIGN" : category.toUpperCase()}
      </span>
    </motion.div>
  );
}
