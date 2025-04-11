"use client";

import React from "react";

export default function Footer() {
  return (
<footer className="fixed bottom-0 left-0 w-full h-[100px] bg-transparent font-minecraft flex items-center justify-end px-[4vw] z-50 pointer-events-auto">
      <div className="w-full max-w-[351px] flex justify-between text-[#fef4dc] text-[4.5vw] sm:text-[3.5vw] md:text-[21px] font-medium leading-none">
        <span>CONTACT</span>
        <span>/</span>
        <span>ABOUT</span>
        <span>/</span>
        <span>HISTORY</span>
      </div>
    </footer>
  );
}
