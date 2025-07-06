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
        top: "clamp(18rem, 18vh, 18rem)",
        left: "clamp(40vw, 48vw, 56vw)",
        width: "clamp(400px, 49vw, 800px)",
        height: "clamp(300px, 48vh, 600px)",
      }}
      initial={{ x: 0 }}
      animate={{
        x: animate ? "-20vw" : 0,
        scale: animate ? 1.3 : 0.9, // 👈 grows from 85% to 100%
      }}      transition={{ duration: 1.8, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
