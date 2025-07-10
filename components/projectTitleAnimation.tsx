"use client";

import { motion } from "framer-motion";
import { useRef, useLayoutEffect, useState } from "react";

export default function ProjectTitleAnimation({
  title,
  animateIn,
  color = "black",
  finalX = 1280, // 👈 where the right edge of the last letter should land
}: {
  title: string;
  animateIn: boolean;
  color?: string;
  finalX?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastLetterRef = useRef<HTMLSpanElement>(null);
  const [leftOffset, setLeftOffset] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current && lastLetterRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const lastLetterRect = lastLetterRef.current.getBoundingClientRect();
      const distanceFromLeftEdge = lastLetterRect.right - containerRect.left;
      const left = finalX - distanceFromLeftEdge;
      setLeftOffset(left);
    }
  }, [title, finalX]);

  const lastIndex = title.length - 1;

  return (
    <motion.div
      className="fixed top-16 lg:top-[9.5rem] z-[9999] pointer-events-none"
      ref={containerRef}
      style={{
        left: leftOffset !== null ? `${leftOffset}px` : "0px",
      }}
      initial={{ x: 2000, opacity: 1 }}
      animate={{ x: animateIn ? 0 : 2000, opacity: 1 }}
      exit={{ x: 2000, opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <h1
        className="text-left text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight"
        style={{ color, letterSpacing: "2.565px" }}
      >
        {title.split("").map((char, i) =>
          i === lastIndex ? (
            <span key={i} ref={lastLetterRef}>
              {char}
            </span>
          ) : (
            <span key={i}>{char}</span>
          )
        )}
      </h1>
    </motion.div>
  );
}
