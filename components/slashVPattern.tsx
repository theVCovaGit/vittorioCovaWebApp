"use client";

import { useState, useEffect } from "react";

export default function SlashVPattern() {
  const [patternRows, setPatternRows] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Pattern: /\ x 28, then V x 34, repeated 8 times = 16 rows
  const cycles = 8; // Number of times to repeat the pattern
  const slashCount = 28; // Number of /\ per row
  const vCount = 34; // Number of V's per row
  const rowSpacing = 28; // Vertical spacing between rows (bigger, proportional)
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
        
        // Row 2: V row - special case for first V row (cycle 0)
        let vRow = "";
        if (cycle === 0) {
          // First V row: 13 V's + ARCHITECTURE . + 9 V's
          for (let i = 0; i < 13; i++) {
            vRow += "V";
            if (charSpacing > 0 && i < 12) {
              vRow += " ".repeat(charSpacing);
            }
          }
          vRow += "ARCHITECTURE .";
          for (let i = 0; i < 9; i++) {
            vRow += "V";
            if (charSpacing > 0 && i < 8) {
              vRow += " ".repeat(charSpacing);
            }
          }
        } else {
          // Other V rows: V x 34
          for (let i = 0; i < vCount; i++) {
            vRow += "V";
            if (charSpacing > 0 && i < vCount - 1) {
              vRow += " ".repeat(charSpacing);
            }
          }
        }
        pattern.push(vRow);
      }
      
      // Add one more /\ row at the bottom with only 13 /\s
      let finalSlashRow = "";
      for (let i = 0; i < 13; i++) {
        finalSlashRow += "/\\";
        if (charSpacing > 0 && i < 12) {
          finalSlashRow += " ".repeat(charSpacing);
        }
      }
      pattern.push(finalSlashRow);
      
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
          fontFamily: "Blur Light, sans-serif",
          fontSize: "22px",
          lineHeight: `${rowSpacing}px`,
          whiteSpace: "pre",
          letterSpacing: "-1.7px", // Proportional spacing (scaled up)
        }}
      >
        {patternRows.map((row, rowIndex) => {
          // Check if row contains ARCHITECTURE text
          if (row.includes("ARCHITECTURE")) {
            const parts = row.split("ARCHITECTURE .");
            return (
              <div key={rowIndex}>
                <span style={{ color: "rgba(254, 244, 220, 0.25)" }}>{parts[0]}</span>
                <span 
                  style={{ 
                    color: "#000000",
                  }}
                >
                  ARCHITECTURE .
                </span>
                <span style={{ color: "rgba(254, 244, 220, 0.25)" }}>{parts[1]}</span>
              </div>
            );
          }
          return (
            <div key={rowIndex} style={{ color: "rgba(254, 244, 220, 0.25)" }}>
              {row}
            </div>
          );
        })}
      </div>
    </div>
  );
}
