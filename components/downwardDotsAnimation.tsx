"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DownwardDots from "@/components/downwardDots";

export default function AnimatedDownwardDots({
  animate,
  onComplete,
  xOffset = "-100vw",
}: {
  animate: boolean;
  onComplete: () => void;
  xOffset?: string | number;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setHidden(true), 1000); // matches animation duration
      return () => clearTimeout(timeout);
    }
  }, [animate]);

  if (hidden) return null;

  return (
    <motion.div
      style={{
        top: "clamp(6rem, 30vh, 14rem)",
        left: "clamp(25vw, 32vw, 38vw)"
      }}
      className="absolute z-10"
      animate={animate ? { x: xOffset, opacity: 0 } : { x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (animate) onComplete?.();
      }}
    >
      <DownwardDots />
    </motion.div>
  );
}
