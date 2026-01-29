"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SponsoredByLifeAnimation() {
  // Animation timings for each of the 4 objects appearing sequentially
  const timings = [
    { delay: 0, duration: 0.4 },    // Object 1 (caterpillar)
    { delay: 0.6, duration: 0.4 },  // Object 2 (caterpillar climbing)
    { delay: 1.2, duration: 0.4 },  // Object 3 (chrysalis)
    { delay: 1.8, duration: 0.4 },  // Object 4 (butterfly)
  ];

  // Calculate cycle timing
  const lastAnimationEnds = timings[3].delay + timings[3].duration; // 2.2 seconds
  const holdDuration = 0.5; // How long to hold after all objects appear
  const fadeOutDuration = 0.3; // Fade out duration
  const cycleDuration = lastAnimationEnds + holdDuration + fadeOutDuration; // ~3 seconds total

  return (
    <div className="fixed inset-0 z-[60000] bg-[#554943] flex items-center justify-center p-4">
      <div
        className="relative max-h-[80vh] aspect-[600/110] shrink-0"
        style={{ width: "min(600px, 90vw)" }}
      >
        {[0, 1, 2, 3].map((i) => {
          const leftPct = i * 25;
          const rightPct = (3 - i) * 25;

          const fadeInStart = timings[i].delay;
          const fadeInEnd = timings[i].delay + timings[i].duration;
          const fadeOutStart = lastAnimationEnds + holdDuration;

          return (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                clipPath: `inset(0 ${rightPct}% 0 ${leftPct}%)`,
              }}
              animate={{
                opacity: [
                  0,
                  0,
                  1,
                  1,
                  0,
                ],
              }}
              transition={{
                duration: cycleDuration,
                times: [
                  0,
                  fadeInStart / cycleDuration,
                  fadeInEnd / cycleDuration,
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
                fill
                sizes="(max-width: 640px) 90vw, 600px"
                className="object-contain"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

