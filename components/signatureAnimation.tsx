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
    { delay: 0, duration: 0.4 },  // Component 1
    { delay: 0.75, duration: 1.4 },  // Component 2
    { delay: 3.0, duration: 1.8 },  // Component 3
    { delay: 5.0, duration: 0.8 },  // Component 4
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
  
  // Mobile positions: same relative layout as desktop, scaled proportionally (400/700 ≈ 0.571)
  const mobilePositions = [
    { left: "calc(50% + 1px)", top: "50%" },    // Component 1: 2px * 0.571 ≈ 1px
    { left: "50%", top: "50%" },                // Component 2: centered
    { left: "calc(50% + 34px)", top: "55%" },   // Component 3: 60px * 0.571 ≈ 34px
    { left: "calc(50% + 143px)", top: "55%" },  // Component 4: 250px * 0.571 ≈ 143px
  ];
  
  const getComponentPosition = (i: number) => {
    return isMobile ? mobilePositions[i] : componentPositions[i];
  };
  
  const svgWidth = isMobile ? 400 : 700;
  const svgHeight = isMobile ? 59 : 104;
  
  return (
    <>
      {signatureComponents.map((Component, i) => {
        // Component 3 (index 2) uses pathLength animation, so skip clipPath
        const useClipPath = i !== 2;
        const position = getComponentPosition(i);
        
        return (
          <motion.svg
            key={i}
            viewBox={viewBoxes[i]}
            width={svgWidth}
            height={svgHeight}
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
                      animate={{ height: svgHeight }}
                      transition={{
                        duration: animationTimings[i].duration,
                        delay: animationTimings[i].delay,
                        ease: "easeInOut",
                      }}
                      x="0"
                      y="0"
                      width="300"
                      height={svgHeight}
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
    </>
  );
}
