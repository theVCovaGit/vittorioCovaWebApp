"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VerticalCarouselController from "@/components/verticalCarouselController";

export default function VerticalCarouselAnimated({
  images,
}: {
  images: string[];
}) {
  const [index, setIndex] = useState(0);

  const handleUp = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleDown = () => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  return (
    <>
      {/* 🎯 Carousel controller */}
      <VerticalCarouselController onClickUp={handleUp} onClickDown={handleDown} />

      {/* 🖼 Container that centers the image */}
      <div className="fixed left-1/2 top-0 transform -translate-x-1/2 z-10 w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[index]}
            src={images[index]}
            alt={`project image ${index}`}
            initial={{ y: "-100vh" }}       // start far offscreen above
            animate={{ y: "clamp(20vh, 30vh, 40vh)" }} // slide down to around middle
            exit={{ y: "100vh" }}           // slide offscreen below on index change
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="object-cover absolute"
            style={{
              width: "clamp(300px, 48vw, 600px)",   // tweakable width
              height: "clamp(300px, 50vh, 600px)"   // tweakable height
            }}
          />
        </AnimatePresence>
      </div>
    </>
  );
}
