"use client";

import { motion } from "framer-motion";
import { useRef, useLayoutEffect, useState } from "react";

export default function ProjectTitleAnimation({
  title,
  animateIn,
  color = "black",
  finalX = 1280, // 👈 where the *last* letter should land
}: {
  title: string;
  animateIn: boolean;
  color?: string;
  finalX?: number;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [textLeft, setTextLeft] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (titleRef.current && finalX) {
      const width = titleRef.current.offsetWidth;
      const left = finalX - width;
      setTextLeft(left);
    }
  }, [title, finalX]);

  return (
    <motion.div
      className="fixed top-16 lg:top-[9.5rem] z-[9999] pointer-events-none"
      style={{
        left: textLeft !== null ? `${textLeft}px` : "0px",
      }}
      initial={{ x: 2000, opacity: 1 }}
      animate={{ x: animateIn ? 0 : 2000, opacity: 1 }}
      exit={{ x: 2000, opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <h1
        ref={titleRef}
        className="text-left text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight"
        style={{ color, letterSpacing: "2.565px" }}
      >
        {title}
      </h1>
    </motion.div>
  );
}
