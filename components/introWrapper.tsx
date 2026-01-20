"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SignatureAnimation from "./signatureAnimation";

export default function IntroWrapper({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // COMMENTED OUT: Check if intro has already been shown in this session
    // This was preventing the animation from showing on every refresh
    // const hasBeenShown = sessionStorage.getItem("signature-animation-shown");
    // if (hasBeenShown) {
    //   setShowIntro(false);
    //   return;
    // }
  }, []);

  useEffect(() => {
    // If intro was already shown, don't show it again
    if (!showIntro || !mounted) return;

    // Last component delay (2.5) + duration (0.4) = 2.9s
    // Wait 0.5 seconds after last animation completes
    const timer = setTimeout(() => {
      setShowIntro(false);
      // COMMENTED OUT: Mark that intro has been shown in this session
      // This was preventing the animation from showing on every refresh
      // sessionStorage.setItem("signature-animation-shown", "true");
    }, 3400); // 2.9s + 0.5s = 3.4 seconds total

    return () => clearTimeout(timer);
  }, [showIntro, mounted]);

  return (
    <>
      {showIntro && (
        <div className="fixed inset-0 z-[60000] bg-[#554943] flex items-center justify-center" data-intro-animation="true">
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

