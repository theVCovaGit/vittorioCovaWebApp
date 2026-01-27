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
        
        if (patternContent && patternContainerRef.current) {
          const patternRect = patternContent.getBoundingClientRect();
          const containerRect = patternContainerRef.current.getBoundingClientRect();
          
          // Calculate left position of pattern content relative to its container
          const left = patternRect.left - containerRect.left;
          setLeftOffset(left);
        } else {
          // Fallback: if pattern content not found, align to container's left (0)
          setLeftOffset(0);
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
      // Also observe the pattern content when it's available
      const patternContent = patternContainerRef.current.querySelector('.pattern-mobile-container');
      if (patternContent) {
        resizeObserver.observe(patternContent);
      }
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
        <div 
          ref={patternContainerRef}
          className="relative w-full max-w-[85%] sm:max-w-[75%] h-full"
        >
          {/* Pattern positioned within shared container */}
          <div className="absolute inset-0 pt-32 overflow-hidden z-0">
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

