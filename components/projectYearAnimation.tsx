"use client";
import { motion } from "framer-motion";

export default function ProjectYearAnimation({
  year,
}: {
  year: string;
}) {
  return (
    <motion.div
      initial={{ x: -200, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 2, delay: 1.4, ease: "easeOut" }}
      className="absolute left-16 top-[58vh] text-white"
      style={{
        fontFamily: "Electrolize, sans-serif",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        zIndex: 9,
        pointerEvents: "none",
      }}
    >
      {year}
    </motion.div>
  );
}
