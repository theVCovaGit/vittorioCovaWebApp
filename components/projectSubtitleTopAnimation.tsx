"use client";
import { motion } from "framer-motion";

export default function ProjectSubtitleTopAnimation({
  text,
}: {
  text: string;
}) {
  return (
    <motion.div
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      transition={{ duration: 2, delay: 1, ease: "easeOut" }}
      className="absolute left-24 top-[45vh] w-[108px] h-[19px] text-white"
      style={{
        fontFamily: "Electrolize, sans-serif",
        fontSize: "17px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        pointerEvents: "none",
        zIndex: 9,
        opacity: 1, // force static full opacity
      }}
    >
      {text}
    </motion.div>
  );
}
