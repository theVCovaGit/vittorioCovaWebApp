"use client";
import { motion } from "framer-motion";

export default function AnimatedHeroImage({
  children,
  animate,
}: {
  children: React.ReactNode;
  animate: boolean;
}) {
  return (
    <motion.div
      className="hidden md:block absolute z-30 pointer-events-auto"
      style={{
        top: animate ? "auto" : "clamp(18rem, 18vh, 18rem)",
        bottom: animate ? "5vh" : "auto",
        right: animate ? "5vw" : "auto",
        left: animate ? "auto" : "clamp(65vw, 72vw, 78vw)",
        width: animate ? "600px" : "clamp(400px, 49vw, 800px)",
        height: animate ? "400px" : "clamp(300px, 48vh, 600px)",
        transform: animate ? "scale(0.75)" : "translateX(-50%)",
      }}
      animate={{ opacity: animate ? 1 : 1 }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
}
