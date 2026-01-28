"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const PATTERN_FONT = { fontFamily: "Blur Light, sans-serif", fontSize: "32px", letterSpacing: "-2.4px" };
const V_FLAG_COUNT = 17; // 17 V's → 18th character (C of CONTACT aligned with 18th V of second‑last row)

const BARCODE_PATH = "M5.14062 41.6719H0.328125V0.296875H5.14062V41.6719ZM9.84896 41.6719H7.44271V0.296875H9.84896V41.6719ZM16.6719 41.6719H14.2656V0.296875H16.6719V41.6719ZM28.0729 41.6719H25.6667V0.296875H28.0729V41.6719ZM39.5312 41.6719H34.776V0.296875H39.5312V41.6719ZM48.4844 41.6719H46.1094V0.296875H48.4844V41.6719ZM55.4792 41.6719H50.9948V0.296875H55.4792V41.6719ZM64.5677 41.6719H62.3281V0.296875H64.5677V41.6719ZM78.3438 41.6719H76.1042V0.296875H78.3438V41.6719ZM94.4167 41.6719H89.9792V0.296875H94.4167V41.6719ZM112.625 41.6719H105.995V0.296875H112.625V41.6719ZM83.0104 41.6719H80.7708V0.296875H83.0104V41.6719ZM103.714 41.6719H101.474V0.296875H103.714V41.6719ZM119.641 41.6719H115.057V0.296875H119.641V41.6719ZM140.359 41.6719H135.776V0.296875H140.359V41.6719ZM156.391 41.6719H151.807V0.296875H156.391V41.6719ZM163.177 41.6719H158.589V0.296875H163.177V41.6719ZM172.547 41.6719H167.964V0.296875H172.547V41.6719ZM181.427 41.6719H176.844V0.296875H181.427V41.6719ZM206.583 41.6719H202V0.296875H206.583V41.6719ZM241.052 41.6719H236.464V0.296875H241.052V41.6719ZM257.151 41.6719H252.568V0.296875H257.151V41.6719ZM264.234 41.6719H259.646V0.296875H264.234V41.6719ZM273.219 41.6719H268.635V0.296875H273.219V41.6719ZM284.708 41.6719H277.781V0.296875H284.708V41.6719ZM341.969 41.6719H335.042V0.296875H341.969V41.6719ZM296.089 41.6719H291.5V0.296875H296.089V41.6719ZM307.521 41.6719H302.932V0.296875H307.521V41.6719ZM332.734 41.6719H328.151V0.296875H332.734V41.6719ZM357.87 41.6719H353.286V0.296875H357.87V41.6719ZM190.599 41.6719H183.87V0.296875H190.599V41.6719ZM128.74 41.6719H126.5V0.296875H128.74V41.6719ZM144.896 41.6719H142.656V0.296875H144.896V41.6719ZM199.771 41.6719H197.531V0.296875H199.771V41.6719ZM215.927 41.6719H213.688V0.296875H215.927V41.6719ZM220.552 41.6719H218.312V0.296875H220.552V41.6719ZM229.557 41.6719H227.318V0.296875H229.557V41.6719ZM289.161 41.6719H286.922V0.296875H289.161V41.6719ZM316.604 41.6719H314.365V0.296875H316.604V41.6719ZM325.755 41.6719H323.516V0.296875H325.755V41.6719ZM346.516 41.6719H344.276V0.296875H346.516V41.6719ZM366.88 41.6719H364.641V0.296875H366.88V41.6719ZM245.63 41.6719H243.391V0.296875H245.63V41.6719ZM73.7656 41.6719H66.9948V0.296875H73.7656V41.6719Z";

export default function SlashVPattern() {
  const [patternRows, setPatternRows] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Pattern: /\ x 28, then V x 34, repeated 8 times = 16 rows
  const cycles = 8; // Number of times to repeat the pattern
  const slashCount = 28; // Number of /\ per row
  const vCount = 34; // Number of V's per row
  const rowSpacing = 23; // Vertical spacing between rows (minimal)
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

  const rowStyle = { ...PATTERN_FONT, lineHeight: `${rowSpacing}px`, whiteSpace: "pre" as const };

  return (
    <div 
      className="absolute top-0 left-0 right-[6rem] h-full overflow-hidden z-0 flex flex-col pt-40"
    >
      <Link
        href="/"
        className="flex flex-row flex-shrink-0 mb-0 no-underline items-center w-full"
      >
        <div className="flex items-center justify-end flex-shrink-0 pr-24 w-[calc(50vw-6rem)]">
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
      <div className="ml-auto w-[50vw] flex flex-col flex-1 min-h-0 overflow-hidden">
        <div style={rowStyle}>
        {patternRows.map((row, rowIndex) => {
          const isSecondLastRow = rowIndex === patternRows.length - 2;
          const isLastRow = rowIndex === patternRows.length - 1;
          const footerBlock = (
            <div key="footer-wrap" className="relative pointer-events-auto" style={{ zIndex: 99999 }}>
              <div key="footer-barcode" style={{ ...rowStyle, marginTop: -10 }}>
                <span style={{ color: "transparent" }}>{ "V".repeat(V_FLAG_COUNT) }</span>
                <span style={{ display: "inline-block", verticalAlign: "bottom" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 367 42" fill="none" width={367} height={42} className="block">
                    <path d={BARCODE_PATH} fill="#a08e80" />
                  </svg>
                </span>
              </div>
              <div key="footer-links" style={rowStyle} className="pointer-events-auto">
                <span style={{ color: "transparent" }}>{ "V".repeat(V_FLAG_COUNT) }</span>
                <span style={{ display: "inline-block", width: 367, textAlign: "center" }}>
                  <span style={{ color: "#fec776" }}>
                    <Link href="/contact" className="text-[#fec776] no-underline hover:text-white cursor-pointer relative z-[100000]">CONTACT</Link>
                    <span> / </span>
                    <Link href="/about" className="text-[#fec776] no-underline hover:text-white cursor-pointer relative z-[100000]">ABOUT</Link>
                    <span> / </span>
                    <Link href="/news" className="text-[#fec776] no-underline hover:text-white cursor-pointer relative z-[100000]">NEWS</Link>
                  </span>
                </span>
              </div>
            </div>
          );
          const rowDivStyle = { ...rowStyle, color: "rgba(254, 244, 220, 0.25)" };
          // Check if row contains ARCHITECTURE text
          if (row.includes("ARCHITECTURE")) {
            const parts = row.split("ARCHITECTURE .");
            return (
              <div key={rowIndex} className="pointer-events-auto relative" style={{ ...rowDivStyle, zIndex: 20 }}>
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
              <div key={rowIndex} className="pointer-events-auto" style={rowDivStyle}>
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
              <div key={rowIndex} className="pointer-events-auto" style={rowDivStyle}>
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
          // Plain V or /\ row
          if (isLastRow) {
            return (
              <React.Fragment key={rowIndex}>
                <div style={rowDivStyle}>{row}</div>
                {footerBlock}
              </React.Fragment>
            );
          }
          return (
            <div key={rowIndex} style={rowDivStyle}>
              {row}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
