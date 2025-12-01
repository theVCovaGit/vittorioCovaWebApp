"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface SponsoredByLifeAnimationProps {
  onComplete?: () => void;
}

export default function SponsoredByLifeAnimation({ onComplete }: SponsoredByLifeAnimationProps) {
  // Animation timings for each of the 4 parts
  const timings = [
    { delay: 0, duration: 0.4 },
    { delay: 0.6, duration: 0.4 },
    { delay: 1.2, duration: 0.4 },
    { delay: 1.8, duration: 0.4 },
  ];

  // Calculate when all animations complete
  const lastAnimationEnds = timings[3].delay + timings[3].duration; // 2.2 seconds

  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, lastAnimationEnds * 1000);
      return () => clearTimeout(timer);
    }
  }, [onComplete, lastAnimationEnds]);

  const partWidth = 600 / 4; // Divide width by 4 for 4 parts

  return (
    <div className="fixed inset-0 z-[60000] bg-[#2b1d1d] flex flex-col items-center justify-center">
      <div className="relative" style={{ width: 600, height: 110 }}>
        {[0, 1, 2, 3].map((i) => {
          const leftOffset = i * partWidth;
          const rightOffset = 600 - (i + 1) * partWidth;
          
          return (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                clipPath: `inset(0 ${rightOffset}px 0 ${leftOffset}px)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: timings[i].duration,
                delay: timings[i].delay,
                ease: "easeInOut",
              }}
            >
              <img
                src="/assets/sponsoredByLifeAnimation.svg"
                alt="Sponsored By Life"
                style={{ width: 600, height: 110, objectFit: "contain" }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

