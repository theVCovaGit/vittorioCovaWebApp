"use client";

import { motion } from "framer-motion";
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
    { delay: 0, duration: 0.6 },  // Component 1
    { delay: 1.0, duration: 1.8 },  // Component 2
    { delay: 3.0, duration: 2.0 },  // Component 3
    { delay: 4.9, duration: 0.8 },  // Component 4
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
  return (
    <>
      {signatureComponents.map((Component, i) => (
        <motion.svg
          key={i}
          viewBox={viewBoxes[i]}
          width={700}
          height={104}
          className="absolute"
          style={{
            top: componentPositions[i].top,
            left: componentPositions[i].left,
            transform: "translate(-50%, -50%)",
          }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
                height="104"
              />
            </clipPath>
          </defs>

          <g clipPath={`url(#clip-signature-${i})`}>
            <Component />
          </g>
        </motion.svg>
      ))}
    </>
  );
}
