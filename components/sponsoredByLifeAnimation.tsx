"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SponsoredByLifeAnimation() {
  // Animation timings for each of the 4 parts
  const timings = [
    { delay: 0, duration: 0.4 },
    { delay: 0.6, duration: 0.4 },
    { delay: 1.2, duration: 0.4 },
    { delay: 1.8, duration: 0.4 },
  ];

  // Calculate cycle timing
  const lastAnimationEnds = timings[3].delay + timings[3].duration; // 2.2 seconds
  const holdDuration = 0.5; // How long to hold after all parts appear
  const fadeOutDuration = 0.3; // Fade out duration
  const cycleDuration = lastAnimationEnds + holdDuration + fadeOutDuration; // ~3 seconds total

  const partWidth = 600 / 4; // Divide width by 4 for 4 parts

  return (
    <div className="fixed inset-0 z-[60000] bg-[#2b1d1d] flex flex-col items-center justify-center">
      <div className="relative" style={{ width: 600, height: 110 }}>
        {[0, 1, 2, 3].map((i) => {
          const leftOffset = i * partWidth;
          const rightOffset = 600 - (i + 1) * partWidth;
          
          // Calculate when this part should fade out (after all parts appear + hold time)
          const fadeOutStart = lastAnimationEnds + holdDuration;
          
          return (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                clipPath: `inset(0 ${rightOffset}px 0 ${leftOffset}px)`,
              }}
              animate={{
                opacity: [
                  0, // Start invisible
                  1, // Fade in at delay
                  1, // Stay visible until fade out
                  0, // Fade out
                ],
              }}
              transition={{
                duration: cycleDuration,
                times: [
                  0,
                  (timings[i].delay + timings[i].duration) / cycleDuration,
                  fadeOutStart / cycleDuration,
                  1,
                ],
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0,
              }}
            >
              <Image
                src="/assets/sponsoredByLifeAnimation.svg"
                alt="Sponsored By Life"
                width={600}
                height={110}
                style={{ width: 600, height: 110, objectFit: "contain" }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

