"use client";
import { motion } from "framer-motion";


export default function VerticalCarouselController({
  onClickUp,
  onClickDown,
}: {
  onClickUp: () => void;
  onClickDown: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 200, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 2, delay: 1.6, ease: "easeOut" }}
      className="fixed right-8 top-[45vh] z-[999] cursor-pointer"
      style={{
        width: "26px",
        height: "108px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        pointerEvents: "auto",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="108"
        viewBox="0 0 26 108"
        fill="none"
      >
        <path
          d="M13 0 L0 13 H26 L13 0 Z M13 108 L0 95 H26 L13 108 Z"
          fill="white"
        />
      </svg>
      {/* Optional invisible hit zones for click interactions */}
      <div
        className="absolute top-0 left-0 w-full h-1/2"
        onClick={onClickUp}
        style={{ cursor: "pointer" }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-1/2"
        onClick={onClickDown}
        style={{ cursor: "pointer" }}
      />
    </motion.div>
  );
}
