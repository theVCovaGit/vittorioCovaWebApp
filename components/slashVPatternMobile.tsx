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
  const slashCount = 24;
  const vCount = 30; // +1 at end
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
        // Row 4: 9 V's + ARCHITECTURE . + 7 V's
        for (let i = 0; i < 9; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 8) vRow += " ".repeat(charSpacing);
        }
        vRow += "ARCHITECTURE .";
        for (let i = 0; i < 9; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 8) vRow += " ".repeat(charSpacing);
        }
      } else if (cycle === 4) {
        // Row 10: 20 V's + FILM . + 4 V's
        for (let i = 0; i < 20; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 19) vRow += " ".repeat(charSpacing);
        }
        vRow += "FILM .";
        for (let i = 0; i < 6; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 5) vRow += " ".repeat(charSpacing);
        }
      } else if (cycle === 8) {
        // Row 18: 6 V's + ART . + 18 V's
        for (let i = 0; i < 6; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 5) vRow += " ".repeat(charSpacing);
        }
        vRow += "ART .";
        for (let i = 0; i < 20; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < 19) vRow += " ".repeat(charSpacing);
        }
      } else {
        // Regular V row: 30 V's
        for (let i = 0; i < vCount; i++) {
          vRow += "V";
          if (charSpacing > 0 && i < vCount - 1) vRow += " ".repeat(charSpacing);
        }
      }
      pattern.push(vRow);
    }

    // Add one more /\ row and one more V row (mobile-only request)
    let extraSlashRow = "";
    for (let i = 0; i < slashCount; i++) {
      extraSlashRow += "/\\";
      if (charSpacing > 0 && i < slashCount - 1) extraSlashRow += " ".repeat(charSpacing);
    }
    pattern.push(extraSlashRow);

    let extraVRow = "";
    for (let i = 0; i < vCount; i++) {
      extraVRow += "V";
      if (charSpacing > 0 && i < vCount - 1) extraVRow += " ".repeat(charSpacing);
    }
    pattern.push(extraVRow);

    setPatternRows(pattern);
  }, []);

  if (!mounted || patternRows.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .pattern-mobile-container {
          font-family: "Blur Light", sans-serif;
          white-space: pre;
          color: #a08e80;
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
                <span style={{ color: "#a08e80" }}>{parts[0]}</span>
                <Link 
                  href="/architecture"
                  style={{ 
                    color: "#000000",
                    textDecoration: "none",
                    position: "relative",
                    zIndex: 2000,
                  }}
                  className="hover:!text-[#fff3df] active:!text-[#fff3df] transition-colors cursor-pointer"
                >
                  ARCHITECTURE .
                </Link>
                <span style={{ color: "#a08e80" }}>{parts[1]}</span>
              </div>
            );
          }
          // Check if row contains FILM text
          if (row.includes("FILM")) {
            const parts = row.split("FILM .");
            return (
              <div key={i} className="pointer-events-auto relative" style={{ zIndex: 20 }}>
                <span style={{ color: "#a08e80" }}>{parts[0]}</span>
                <Link 
                  href="/film"
                  style={{ 
                    color: "#000000",
                    textDecoration: "none",
                  }}
                  className="hover:!text-[#fff3df] active:!text-[#fff3df] transition-colors cursor-pointer"
                >
                  FILM .
                </Link>
                <span style={{ color: "#a08e80" }}>{parts[1]}</span>
              </div>
            );
          }
          // Check if row contains ART text
          if (row.includes("ART")) {
            const parts = row.split("ART .");
            return (
              <div key={i} className="pointer-events-auto relative" style={{ zIndex: 20 }}>
                <span style={{ color: "#a08e80" }}>{parts[0]}</span>
                <Link 
                  href="/art"
                  style={{ 
                    color: "#000000",
                    textDecoration: "none",
                  }}
                  className="hover:!text-[#fff3df] active:!text-[#fff3df] transition-colors cursor-pointer"
                >
                  ART .
                </Link>
                <span style={{ color: "#a08e80" }}>{parts[1]}</span>
              </div>
            );
          }
          return (
            <div key={i} style={{ color: "#a08e80" }}>
              {row}
            </div>
          );
        })}
        </div>
      </div>
    </>
  );
}
