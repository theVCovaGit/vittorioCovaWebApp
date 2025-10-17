"use client";

import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#5c4b4a] h-20 flex items-center px-8">
      <div className="flex items-center">
        <span className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide">
          VITTORIO COVA
        </span>
        <span className="text-[#FACC15] font-microextend text-xl font-bold uppercase tracking-wide mx-2">
          —
        </span>
        <span className="text-[#FACC15] font-microextend text-xl font-bold uppercase tracking-wide">
          STUDIO
        </span>
      </div>
    </header>
  );
}
