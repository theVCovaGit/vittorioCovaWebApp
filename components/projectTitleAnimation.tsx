"use client";
import { motion } from "framer-motion";

export default function ProjectTitleAnimation({
  title,
  animateIn,
}: {
  title: string;
  animateIn: boolean;
}) {
  return (
    <motion.div
      className="fixed top-16 right-12 lg:top-40 lg:right-[-20] z-[9999] text-right pointer-events-none"
      initial={{ x: 2000, opacity: 1 }} // 🔁 start way offscreen right
      animate={{ x: animateIn ? 0 : 2000, opacity: 1 }} // 🟡 always full opacity
      exit={{ x: 2000, opacity: 1 }}
      transition={{ duration: 3, ease: "easeOut" }}
    >
      <h1 className="text-black text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight">
        {title}
      </h1>
    </motion.div>
  );
}
