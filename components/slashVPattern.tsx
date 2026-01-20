"use client";

import { useState, useEffect } from "react";

export default function SlashVPattern() {
  const [patternRows, setPatternRows] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Pattern: /\ x 28, then V x 34, repeated 8 times = 16 rows
  const cycles = 8; // Number of times to repeat the pattern
  const slashCount = 28; // Number of /\ per row
  const vCount = 34; // Number of V's per row
  const rowSpacing = 18; // Vertical spacing between rows (shorter)
  const charSpacing = 0; // No spacing between characters (much closer)

  useEffect(() => {
    setMounted(true);
    
    // Generate pattern only on client side
    const generatePattern = () => {
      const pattern: string[] = [];
      
      // Repeat the cycle 8 times
      for (let cycle = 0; cycle < cycles; cycle++) {
        // Row 1: /\ x 28
        let slashRow = "";
        for (let i = 0; i < slashCount; i++) {
          slashRow += "/\\";
          if (charSpacing > 0 && i < slashCount - 1) {
            slashRow += " ".repeat(charSpacing);
          }
        }
        pattern.push(slashRow);
        
        // Row 2: V x 34
        let vRow = "";
        for (let i = 0; i < vCount; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < vCount - 1) {
            vRow += " ".repeat(charSpacing);
          }
        }
        pattern.push(vRow);
      }
      
      return pattern;
    };

    setPatternRows(generatePattern());
  }, []);

  if (!mounted || patternRows.length === 0) {
    return null;
  }

  return (
    <div 
      className="absolute right-0 top-0 w-[50vw] h-full overflow-hidden pointer-events-none z-0"
      style={{
        paddingRight: "3rem",
        paddingTop: "1rem",
      }}
    >
      <div
        style={{
          color: "#fef4dc",
          opacity: 0.25,
          fontFamily: "Blur Light, sans-serif",
          fontSize: "14px",
          lineHeight: `${rowSpacing}px`,
          whiteSpace: "pre",
          letterSpacing: "-1.1px", // Minimally tighter spacing
        }}
      >
        {patternRows.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}
