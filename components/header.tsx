"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useIconDisplay } from "@/context/IconDisplayContext";
import HeaderAnimation from "@/components/headerAnimation";



export default function Header() {
  const pathname = usePathname();
  const { iconUrl } = useIconDisplay(); 
  

  const isCreativePage = ["/architecture", "/productdesign", "/film", "/art"].includes(pathname);

  if (iconUrl) {
    console.log("🧠 Header rendering icon:", iconUrl);
  } else {
    console.log("📭 Header: iconUrl is empty");
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-[#5c4b4a] font-basica z-50 h-[10rem] sm:h-[12.25rem] md:h-[13rem] ${
        isCreativePage ? "text-black" : "text-[#fef4dc]"
      }`}
    >
      {/* Logo Block */}
      <div className="absolute top-[2.375rem] sm:top-[3rem] md:top-[4.25rem] left-[2.5rem] sm:left-[3.75rem] md:left-[5rem] leading-[2.5rem]">
        <Link href="/" className="no-underline text-inherit cursor-pointer">
          <div className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] font-normal tracking-[-0.02em] md:tracking-[-0.0195rem]">
            VITTORIO
          </div>

          <div className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] font-normal tracking-[0.05em] md:tracking-[0.08775rem] ml-[4rem] sm:ml-[5rem] md:ml-[7.06rem]">
            COVA
          </div>
        </Link>
        <HeaderAnimation /> 

      </div>

      {/* Frame + Centered Icon */}
<div className="hidden md:block absolute top-[4.25rem] left-[25.6rem] w-[9rem] h-[4.7rem] z-[60]">
  {/* SVG Frame */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 144 75"
    fill="none"
    className="w-full h-full absolute top-0 left-0"
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

  {/* Centered Icon */}
  {iconUrl && (
  <div className="absolute inset-0 flex items-center justify-center z-100">
    <img
      src={iconUrl}
      alt="Project Icon"
      className="max-w-[70%] max-h-[70%] object-contain"
    />
  </div>
)}
</div>

      {/* Frame the Vision */}
     
        <div className="hidden md:block absolute top-[4.25rem] left-[36.25rem] text-[1rem] tracking-[0.002em] w-[13.06rem] h-[1.625rem] leading-none font-minecraft">
          
        </div>
     
    </header>
  );
}
