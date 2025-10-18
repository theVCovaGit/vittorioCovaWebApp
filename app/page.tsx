"use client";

import { useState, useEffect } from "react";
import HeroAnimation from "@/components/heroAnimation";
import SignatureAnimation from "@/components/signatureAnimation";

export default function Hero() {
  const [showMainContent, setShowMainContent] = useState(false);

  // Automatically transition after signature completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMainContent(true);
    }, 7000); // adjust to match total signature animation time

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#5c4b4a] relative">
      {/* Main Content */}
      <div className="pt-64 left-30 px-8 relative">
        <div className="flex items-center">
          <span className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide">
            VITTORIO COVA
          </span>
          <span className="text-[#FACC15] font-microextend text-xl font-bold uppercase tracking-wide mx-2">
            <svg width="80" height="4" viewBox="0 0 80 4" className="inline-block">
              <rect x="0" y="0" width="80" height="2" fill="#FACC15"/>
            </svg>
          </span>
          <span className="text-[#FACC15] font-microextend text-xl font-bold uppercase tracking-wide">
            STUDIO
          </span>
        </div>
      </div>
    </div>
  );
}
