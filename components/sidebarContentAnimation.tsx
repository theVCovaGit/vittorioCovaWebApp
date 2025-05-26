"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedSidebarContent({
  animate,
  children,
}: {
  animate: boolean;
  children: React.ReactNode;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setHidden(true), 1000); // matches animation duration
      return () => clearTimeout(timeout);
    }
  }, [animate]);

  if (hidden) return null;

  return (
    <motion.div
      className="relative z-20 w-full max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row gap-12"
      animate={animate ? { x: "-100vw", opacity: 0 } : { x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
