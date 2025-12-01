"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SignatureAnimation from "./signatureAnimation";

export default function IntroWrapper({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Last component delay (4.5) + duration (0.8) = 5.3s
    // Wait 1.5 seconds after last animation completes
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 5400); // 5.3s + 1.5s = 6.8 seconds total

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showIntro && (
        <div className="fixed inset-0 z-[60000] bg-[#2b1d1d] flex items-center justify-center">
          <div className="relative w-full h-full">
            <SignatureAnimation />
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5, delay: showIntro ? 0 : 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}

