"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Mobile: wavy /\ and V pattern with ARCHITECTURE, FILM, ART embedded
// Row 4: after 7th V -> "ARCHITECTURE ." -> 4 V's
// Row 10: after 18th V -> "FILM ." -> 2 V's
// Row 18: after 4th V -> "ART ." -> 16 V's
export default function SlashVPatternMobile() {
  const [patternRows, setPatternRows] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const cycles = 12; // 12 cycles = 24 rows total (12 /\ + 12 V)
  const slashCount = 20;
  const vCount = 24;
  const charSpacing = 0;

  useEffect(() => {
    setMounted(true);
    const pattern: string[] = [];
    for (let cycle = 0; cycle < cycles; cycle++) {
      // Slash row
      let slashRow = "";
      for (let i = 0; i < slashCount; i++) {
        slashRow += "/\\";
        if (charSpacing > 0 && i < slashCount - 1) slashRow += " ".repeat(charSpacing);
      }
      pattern.push(slashRow);
      
      // V row with special cases for rows 4, 10, and 18
      let vRow = "";
      if (cycle === 1) {
        // Row 4: 7 V's + ARCHITECTURE . + 5 V's
        for (let i = 0; i < 7; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 6) vRow += " ".repeat(charSpacing);
        }
        vRow += "ARCHITECTURE .";
        for (let i = 0; i < 5; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 4) vRow += " ".repeat(charSpacing);
        }
      } else if (cycle === 4) {
        // Row 10: 18 V's + FILM . + 2 V's
        for (let i = 0; i < 18; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 17) vRow += " ".repeat(charSpacing);
        }
        vRow += "FILM .";
        for (let i = 0; i < 2; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 1) vRow += " ".repeat(charSpacing);
        }
      } else if (cycle === 8) {
        // Row 18: 4 V's + ART . + 16 V's
        for (let i = 0; i < 4; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 3) vRow += " ".repeat(charSpacing);
        }
        vRow += "ART .";
        for (let i = 0; i < 16; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 15) vRow += " ".repeat(charSpacing);
        }
      } else {
        // Regular V row: 24 V's
        for (let i = 0; i < vCount; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < vCount - 1) vRow += " ".repeat(charSpacing);
        }
      }
      pattern.push(vRow);
    }
    setPatternRows(pattern);
  }, []);

  if (!mounted || patternRows.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .pattern-mobile-container {
          font-family: "Blur Light", sans-serif;
          white-space: pre;
          color: rgba(254, 244, 220, 0.25);
          width: fit-content;
          display: block;
          font-size: clamp(14px, 5.25vw, 28px);
          line-height: 0.9em;
          letter-spacing: -0.06em;
        }
      `}} />
      <div className="relative w-fit h-full overflow-hidden z-0">
        <div
          className="w-fit pattern-mobile-container"
          style={{ width: 'fit-content', maxWidth: '100%' }}
        >
        {patternRows.map((row, i) => {
          // Check if row contains ARCHITECTURE text
          if (row.includes("ARCHITECTURE")) {
            const parts = row.split("ARCHITECTURE .");
            return (
              <div key={i} className="pointer-events-auto relative" style={{ zIndex: 20 }}>
                <span style={{ color: "rgba(254, 244, 220, 0.25)" }}>{parts[0]}</span>
                <Link 
                  href="/architecture"
                  style={{ 
                    color: "#000000",
                    textDecoration: "none",
                    position: "relative",
                    zIndex: 2000,
                  }}
                  className="hover:!text-white transition-colors cursor-pointer"
                >
                  ARCHITECTURE .
                </Link>
                <span style={{ color: "rgba(254, 244, 220, 0.25)" }}>{parts[1]}</span>
              </div>
            );
          }
          // Check if row contains FILM text
          if (row.includes("FILM")) {
            const parts = row.split("FILM .");
            return (
              <div key={i} className="pointer-events-auto relative" style={{ zIndex: 20 }}>
                <span style={{ color: "rgba(254, 244, 220, 0.25)" }}>{parts[0]}</span>
                <Link 
                  href="/film"
                  style={{ 
                    color: "#000000",
                    textDecoration: "none",
                  }}
                  className="hover:!text-white transition-colors cursor-pointer"
                >
                  FILM .
                </Link>
                <span style={{ color: "rgba(254, 244, 220, 0.25)" }}>{parts[1]}</span>
              </div>
            );
          }
          // Check if row contains ART text
          if (row.includes("ART")) {
            const parts = row.split("ART .");
            return (
              <div key={i} className="pointer-events-auto relative" style={{ zIndex: 20 }}>
                <span style={{ color: "rgba(254, 244, 220, 0.25)" }}>{parts[0]}</span>
                <Link 
                  href="/art"
                  style={{ 
                    color: "#000000",
                    textDecoration: "none",
                  }}
                  className="hover:!text-white transition-colors cursor-pointer"
                >
                  ART .
                </Link>
                <span style={{ color: "rgba(254, 244, 220, 0.25)" }}>{parts[1]}</span>
              </div>
            );
          }
          return (
            <div key={i} style={{ color: "rgba(254, 244, 220, 0.25)" }}>
              {row}
            </div>
          );
        })}
        </div>
      </div>
    </>
  );
}
