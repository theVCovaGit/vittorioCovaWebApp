"use client";

import { useState, useEffect } from "react";

// Mobile: wavy /\ and V pattern only (no embedded words). Full-bleed background.
// Same visual language as desktop SlashVPattern, scaled for mobile viewport.
export default function SlashVPatternMobile() {
  const [patternRows, setPatternRows] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const cycles = 12; // 12 cycles = 24 rows total (12 /\ + 12 V)
  const slashCount = 20;
  const vCount = 24;
  const rowSpacing = 21; // Reduced vertical spacing between rows
  const charSpacing = 0;

  useEffect(() => {
    setMounted(true);
    const pattern: string[] = [];
    for (let cycle = 0; cycle < cycles; cycle++) {
      let slashRow = "";
      for (let i = 0; i < slashCount; i++) {
        slashRow += "/\\";
        if (charSpacing > 0 && i < slashCount - 1) slashRow += " ".repeat(charSpacing);
      }
      pattern.push(slashRow);
      let vRow = "";
      for (let i = 0; i < vCount; i++) {
        vRow += "V";
        if (charSpacing > 0 && i < vCount - 1) vRow += " ".repeat(charSpacing);
      }
      pattern.push(vRow);
    }
    setPatternRows(pattern);
  }, []);

  if (!mounted || patternRows.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden z-0 flex items-start justify-center pt-32">
      <div
        style={{
          fontFamily: "Blur Light, sans-serif",
          fontSize: "27px", // Scaled up from 18px (1.5x)
          lineHeight: `${rowSpacing}px`,
          whiteSpace: "pre",
          letterSpacing: "-2.4px", // Scaled up proportionally from -1.6px
          color: "rgba(254, 244, 220, 0.25)",
          textAlign: "center",
        }}
      >
        {patternRows.map((row, i) => (
          <div key={i}>{row}</div>
        ))}
      </div>
    </div>
  );
}
