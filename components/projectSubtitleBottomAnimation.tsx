"use client";
import { motion } from "framer-motion";

export default function ProjectSubtitleBottomAnimation({
  text,
}: {
  text: string;
}) {
  return (
    <motion.div
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      transition={{ duration: 2, delay: 1.2, ease: "easeOut" }} // slight stagger after top
      className="absolute left-24 top-[54vh] w-[145px] h-[37px] text-white"
      style={{
        fontFamily: '"Basica v.2012", sans-serif',
        fontSize: "30px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        pointerEvents: "none",
        zIndex: 9,
        opacity: 1, // full opacity always
      }}
    >
      {text}
    </motion.div>
  );
}
