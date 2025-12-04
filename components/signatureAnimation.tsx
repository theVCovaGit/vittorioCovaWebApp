"use client";

import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMediaQuery";
import SignatureComponent1 from "./signatureComponent1";
import SignatureComponent2 from "./signatureComponent2";
import SignatureComponent3 from "./signatureComponent3";
import SignatureComponent4 from "./signatureComponent4";

const signatureComponents = [
  SignatureComponent1,
  SignatureComponent2,
  SignatureComponent3,
  SignatureComponent4,
];

const animationTimings = [
    { delay: 0, duration: 0.2 },  // Component 1
    { delay: 0.375, duration: 0.7 },  // Component 2
    { delay: 1.5, duration: 0.9 },  // Component 3
    { delay: 2.5, duration: 0.4 },  // Component 4
  ];  

const componentPositions = [
  { left: "calc(50% + 2px)", top: "50%" },   // Component 1
  { left: "50%", top: "50%" },               // Component 2
  { left: "calc(50% + 60px)", top: "55%" },  // Component 3
  { left: "calc(50% + 250px)", top: "55%" }, // Component 4
];

const viewBoxes = [
  "0 0 300 100",
  "0 0 300 100",
  "0 0 300 100",
  "0 0 300 100",
];

export default function SignatureAnimation() {
  const isMobile = useIsMobile();
  
  // Scale factor for mobile - scale entire signature uniformly
  const mobileScale = isMobile ? 0.571 : 1; // 400/700 ≈ 0.571
  
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        transform: isMobile ? `scale(${mobileScale})` : 'none',
        transformOrigin: 'center center',
      }}
    >
      {signatureComponents.map((Component, i) => {
        // Component 3 (index 2) uses pathLength animation, so skip clipPath
        const useClipPath = i !== 2;
        const position = componentPositions[i];
        
        return (
          <motion.svg
            key={i}
            viewBox={viewBoxes[i]}
            width={700}
            height={104}
            className="absolute"
            style={{
              top: position.top,
              left: position.left,
              transform: "translate(-50%, -50%)",
            }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {useClipPath ? (
              <>
                <defs>
                  <clipPath id={`clip-signature-${i}`}>
                    <motion.rect
                      initial={{ height: 0 }}
                      animate={{ height: 104 }}
                      transition={{
                        duration: animationTimings[i].duration,
                        delay: animationTimings[i].delay,
                        ease: "easeInOut",
                      }}
                      x="0"
                      y="0"
                      width="300"
                      height={104}
                    />
                  </clipPath>
                </defs>
                <g clipPath={`url(#clip-signature-${i})`}>
                  <Component />
                </g>
              </>
            ) : (
              <Component />
            )}
          </motion.svg>
        );
      })}
    </div>
  );
}
