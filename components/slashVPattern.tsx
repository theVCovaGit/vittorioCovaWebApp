"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const PATTERN_FONT = { fontFamily: "Blur Light, sans-serif", fontSize: "32px", letterSpacing: "-2.4px" };

export default function SlashVPattern() {
  const [patternRows, setPatternRows] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const patternRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLSpanElement>(null);

  // Pattern: /\ x 28, then V x 34, repeated 8 times = 16 rows
  const cycles = 8; // Number of times to repeat the pattern
  const slashCount = 28; // Number of /\ per row
  const vCount = 34; // Number of V's per row
  const rowSpacing = 23; // Vertical spacing between rows (minimal)
  const charSpacing = 0; // No spacing between characters (much closer)

  // Use "V" as flag: measure 15 V widths (→ 16th V) and pattern rect; set CSS vars for footer alignment
  useEffect(() => {
    const update = () => {
      if (!rulerRef.current || !patternRef.current) return;
      const r = rulerRef.current.getBoundingClientRect();
      const p = patternRef.current.getBoundingClientRect();
      if (r.width > 0 && p.width > 0) {
        document.documentElement.style.setProperty("--barcode-v-offset", `${r.width}px`);
        document.documentElement.style.setProperty("--pattern-left", `${p.left}px`);
        document.documentElement.style.setProperty("--pattern-width", `${p.width}px`);
      }
    };
    const t = setTimeout(update, 0);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
      document.documentElement.style.removeProperty("--barcode-v-offset");
      document.documentElement.style.removeProperty("--pattern-left");
      document.documentElement.style.removeProperty("--pattern-width");
    };
  }, [mounted, patternRows.length]);

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
        
        // Row 2: V row - special cases for first V row (cycle 0), 8th row (cycle 3), and 12th row (cycle 5)
        let vRow = "";
        if (cycle === 0) {
          // First V row (row 2): 13 V's + ARCHITECTURE . + 9 V's
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
        } else if (cycle === 3) {
          // 8th row (cycle 3, second row): 26 V's + FILM . + 4 V's
          for (let i = 0; i < 26; i++) {
            vRow += "V";
            if (charSpacing > 0 && i < 25) {
              vRow += " ".repeat(charSpacing);
            }
          }
          vRow += "FILM .";
          for (let i = 0; i < 4; i++) {
            vRow += "V";
            if (charSpacing > 0 && i < 3) {
              vRow += " ".repeat(charSpacing);
            }
          }
        } else if (cycle === 5) {
          // 12th row (cycle 5, second row): 6 V's + ART . + 24 V's
          for (let i = 0; i < 6; i++) {
            vRow += "V";
            if (charSpacing > 0 && i < 5) {
              vRow += " ".repeat(charSpacing);
            }
          }
          vRow += "ART .";
          for (let i = 0; i < 24; i++) {
            vRow += "V";
            if (charSpacing > 0 && i < 23) {
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
      className="absolute top-0 left-0 right-[6rem] h-full overflow-hidden z-0 flex flex-col pt-40"
    >
      {/* Hidden "VVV…" ruler: same font as pattern; 15 V's → 16th V. Used as alignment flag for barcode + footer text. */}
      <span
        ref={rulerRef}
        aria-hidden
        className="absolute opacity-0 pointer-events-none overflow-hidden"
        style={{ ...PATTERN_FONT, whiteSpace: "pre", top: 0, left: 0 }}
      >
        {"V".repeat(15)}
      </span>
      <Link
        href="/"
        className="flex flex-row flex-shrink-0 mb-0 no-underline items-center w-full"
      >
        <div className="flex items-center justify-end flex-shrink-0 pr-6 w-[calc(50vw-6rem)]">
          <span className="text-[#fec776] font-blurlight text-3xl font-bold uppercase tracking-wide">
            VITTORIO
          </span>
          <span className="text-[#fec776] font-blurlight text-3xl font-bold uppercase tracking-wide ml-24">
            COVA
          </span>
        </div>
        <div className="flex items-center flex-shrink-0 w-[50vw]">
          <span className="text-[#fec776] font-blurlight text-3xl font-bold uppercase tracking-wide">
            STUDIO
          </span>
          <span className="text-[#fec776] font-blurlight text-sm font-bold uppercase tracking-wide ml-1 relative top-1">
            ©
          </span>
        </div>
      </Link>
      <div
        ref={patternRef}
        className="ml-auto w-[50vw]"
        style={{
          ...PATTERN_FONT,
          lineHeight: `${rowSpacing}px`,
          whiteSpace: "pre",
        }}
      >
        {patternRows.map((row, rowIndex) => {
          // Check if row contains ARCHITECTURE text
          if (row.includes("ARCHITECTURE")) {
            const parts = row.split("ARCHITECTURE .");
            return (
              <div key={rowIndex} className="pointer-events-auto relative" style={{ zIndex: 20 }}>
                <span style={{ color: "rgba(254, 244, 220, 0.25)" }}>{parts[0]}</span>
                <Link 
                  href="/architecture"
                  style={{ 
                    color: "#000000",
                    textDecoration: "none",
                    position: "relative",
                    zIndex: 2000,
                  }}
                  className="architecture-link hover:!text-white transition-colors cursor-pointer"
                  onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#000000"}
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
              <div key={rowIndex} className="pointer-events-auto">
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
              <div key={rowIndex} className="pointer-events-auto">
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
            <div key={rowIndex} style={{ color: "rgba(254, 244, 220, 0.25)" }}>
              {row}
            </div>
          );
        })}
      </div>
    </div>
  );
}
