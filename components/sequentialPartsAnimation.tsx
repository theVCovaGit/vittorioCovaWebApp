"use client";

import { motion } from "framer-motion";

interface SequentialPartsAnimationProps {
  // If using SVG, pass the SVG content as children
  children?: React.ReactNode;
  // If using an image, pass the image source
  imageSrc?: string;
  // Width and height of the object
  width?: number;
  height?: number;
  // Animation timings for each part (4 parts total)
  timings?: Array<{ delay: number; duration: number }>;
  // If using SVG, you can specify viewBox
  viewBox?: string;
}

export default function SequentialPartsAnimation({
  children,
  imageSrc,
  width = 400,
  height = 200,
  timings = [
    { delay: 0, duration: 0.4 },
    { delay: 0.6, duration: 0.4 },
    { delay: 1.2, duration: 0.4 },
    { delay: 1.8, duration: 0.4 },
  ],
  viewBox,
}: SequentialPartsAnimationProps) {
  // Calculate the width of each part (assuming 4 equal parts horizontally)
  const partWidth = width / 4;

  return (
    <div className="relative" style={{ width, height }}>
      {imageSrc ? (
        // For images, use CSS clip-path
        <>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                clipPath: `inset(0 ${width - (i + 1) * partWidth}px 0 ${i * partWidth}px)`,
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
                src={imageSrc}
                alt={`Part ${i + 1}`}
                style={{ width, height, objectFit: "contain" }}
              />
            </motion.div>
          ))}
        </>
      ) : (
        // For SVG, use clipPath
        <svg
          width={width}
          height={height}
          viewBox={viewBox || `0 0 ${width} ${height}`}
          className="absolute inset-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <defs>
                <clipPath id={`clip-part-${i}`}>
                  <motion.rect
                    initial={{ width: 0 }}
                    animate={{ width: partWidth }}
                    transition={{
                      duration: timings[i].duration,
                      delay: timings[i].delay,
                      ease: "easeInOut",
                    }}
                    x={i * partWidth}
                    y={0}
                    height={height}
                  />
                </clipPath>
              </defs>
              <g clipPath={`url(#clip-part-${i})`}>
                {children}
              </g>
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

