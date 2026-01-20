"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingIntro({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => prev + 1);
    }, 600);

    if (step === 5) {
      clearInterval(interval);

      setTimeout(() => {
        setStep(6); // Show text
      }, 400);
    }

    if (step === 6) {
      setTimeout(onFinish, 400); // Finish loading after text
    }

    return () => clearInterval(interval);
  }, [step, onFinish]);

  return (
    <div className="fixed inset-0 z-[50000] bg-[#554943] flex flex-col items-center justify-center">
      <div className="flex gap-6 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <AnimatePresence key={i}>
            {step > i && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={`/icons/step${i + 1}.png`}
                  alt={`Step ${i + 1}`}
                  width={60}
                  height={60}
                />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
      {step >= 5 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="font-blurlight text-[#fef4dc] text-sm tracking-wide"
        >
          SPONSORED BY LIFE.
        </motion.p>
      )}
    </div>
  );
}
