"use client";
import { motion } from "framer-motion";

export default function ProjectTitleAnimation({
  title,
  animateIn,
  color = "black", // default fallback
}: {
  title: string;
  animateIn: boolean;
  color?: string;
}) {
  return (
    <motion.div
      className="fixed top-16 right-12 lg:top-[9.5rem] lg:right-[-20] z-[9999] text-right pointer-events-none"
      initial={{ x: 2000, opacity: 1 }}
      animate={{ x: animateIn ? 0 : 2000, opacity: 1 }}
      exit={{ x: 2000, opacity: 1 }}
      transition={{ duration: 3, ease: "easeOut" }}
    >
      <h1
        className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight"
        style={{ color, letterSpacing: "2.565px" }} 
        
      >
        {title}
      </h1>
    </motion.div>
  );
}
