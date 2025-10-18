"use client";

import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-30 w-full z-50 bg-[#5c4b4a] h-20 flex items-center px-8">      <div className="flex items-center">
        <span className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide">
          VITTORIO COVA
        </span>
        <span className="text-[#FACC15] font-microextend text-xl font-bold uppercase tracking-wide mx-2">
          <svg width="80" height="4" viewBox="0 0 80 4" className="inline-block">
            <rect x="0" y="0" width="80" height="2" fill="#FACC15" rx="1"/>
          </svg>
        </span>
        <span className="text-[#FACC15] font-microextend text-xl font-bold uppercase tracking-wide">
          STUDIO
        </span>
      </div>
    </header>
  );
}
