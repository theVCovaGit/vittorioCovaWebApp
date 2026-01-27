"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import SlashVPatternMobile from "./slashVPatternMobile";

export default function HeroMobile() {
  const patternContainerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [leftOffset, setLeftOffset] = useState(0);

  useEffect(() => {
    const updateAlignment = () => {
      if (patternContainerRef.current) {
        // Find the actual pattern content (the div with pattern-mobile-container class)
        const patternContent = patternContainerRef.current.querySelector('.pattern-mobile-container') as HTMLElement;
        
        if (patternContent) {
          const patternRect = patternContent.getBoundingClientRect();
          const parentRect = patternContainerRef.current.offsetParent?.getBoundingClientRect();
          
          if (parentRect) {
            // Calculate left position of pattern content relative to parent
            const left = patternRect.left - parentRect.left;
            setLeftOffset(left);
          }
        } else {
          // Fallback: use container's left edge
          const patternRect = patternContainerRef.current.getBoundingClientRect();
          const parentRect = patternContainerRef.current.offsetParent?.getBoundingClientRect();
          
          if (parentRect) {
            const left = patternRect.left - parentRect.left;
            setLeftOffset(left);
          }
        }
      }
    };

    // Update on mount and resize
    updateAlignment();
    window.addEventListener('resize', updateAlignment);
    
    // Use ResizeObserver for more accurate updates
    const resizeObserver = new ResizeObserver(updateAlignment);
    if (patternContainerRef.current) {
      resizeObserver.observe(patternContainerRef.current);
    }
    
    // Also update after delays to ensure pattern is rendered
    const timeouts = [
      setTimeout(updateAlignment, 50),
      setTimeout(updateAlignment, 200),
      setTimeout(updateAlignment, 500)
    ];

    return () => {
      window.removeEventListener('resize', updateAlignment);
      resizeObserver.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden flex flex-col">
      {/* Shared centered container for pattern and text alignment */}
      <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
        {/* Centered content wrapper - both pattern and text align to this */}
        <div className="relative w-full max-w-[85%] sm:max-w-[75%] h-full">
          {/* Pattern positioned within shared container */}
          <div 
            ref={patternContainerRef}
            className="absolute inset-0 pt-32 overflow-hidden z-0"
          >
            <SlashVPatternMobile />
          </div>
          
          {/* VITTORIO COVA STUDIO© - Constrained to left edge of pattern */}
          <div 
            ref={textContainerRef}
            className="absolute top-16 z-50"
            style={{ left: `${leftOffset}px` }}
          >
            <Link href="/" className="flex flex-col items-start justify-start no-underline leading-none -space-y-3">
              <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
                VITTORIO
              </span>
              <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
                COVA
              </span>
              <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
                STUDIO©
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

