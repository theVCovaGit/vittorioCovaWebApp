"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure all dynamic client logic only runs after hydration
    setIsClient(true);
  }, []);

  const isArchitecture = pathname === "/architecture";

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-[#5c4b4a] font-basica z-50 h-[10rem] sm:h-[12.25rem] md:h-[13rem] ${
        isClient && isArchitecture ? "text-black" : "text-[#fef4dc]"
      }`}
    >
      {/* Logo Block */}
      <div className="absolute top-[2.375rem] sm:top-[3rem] md:top-[4.25rem] left-[2.5rem] sm:left-[3.75rem] md:left-[5rem] leading-[2.5rem]">
        {/* VITTORIO */}
        <div className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] font-normal tracking-[-0.02em] md:tracking-[-0.0195rem]">
          VITTORIO
        </div>

        {/* COVA */}
        <div className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] font-normal tracking-[0.05em] md:tracking-[0.08775rem] ml-[4rem] sm:ml-[5rem] md:ml-[7.06rem]">
          COVA
        </div>

        {/* ARCHITECTURE label */}
        {isClient && isArchitecture && (
          <div
          className={`text-[0.85rem] sm:text-[1rem] md:text-[1.3rem] font-bold tracking-[0.025em] mt-[0.5rem] sm:mt-[0.625rem] md:mt-[0.8rem] transition-opacity duration-300 ${
            isClient && isArchitecture ? "text-[#8CAC77] opacity-100" : "opacity-0"
          }`}
        >
          ARCHITECTURE
        </div>
        
        )}
      </div>

      {/* Frame SVG */}
      <div className="hidden md:block absolute top-[4.25rem] left-[26.25rem] w-[9rem] h-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 144 75"
          fill="none"
          className="w-full h-auto"
        >
          <g clipPath="url(#clip0_18_57)">
            <path d="M25.7093 0.705688H0.694824V26.1103" stroke="#FFF3DF" strokeMiterlimit="10" />
            <path d="M0.694824 48.8897V74.2943H25.7093" stroke="#FFF3DF" strokeMiterlimit="10" />
            <path d="M118.277 74.2943H143.305V48.8897" stroke="#FFF3DF" strokeMiterlimit="10" />
            <path d="M143.305 26.1103V0.705688H118.277" stroke="#FFF3DF" strokeMiterlimit="10" />
          </g>
          <defs>
            <clipPath id="clip0_18_57">
              <rect width="144" height="75" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Frame the Vision */}
      {isClient && !isArchitecture && (
        <div className="hidden md:block absolute top-[4.25rem] left-[36.25rem] text-[1rem] tracking-[0.002em] w-[13.06rem] h-[1.625rem] leading-none">
          FRAME THE VISION .
        </div>
      )}
    </header>
  );
}
