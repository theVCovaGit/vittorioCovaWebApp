"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import ContactLabel from "@/components/contactLabel";
import InteractiveHand from "@/components/interactiveHand";
import InteractiveMorse from "@/components/interactiveMorse";
import ContactMobile from "@/components/contactMobile";
// import AboutNameplate from "@/components/aboutNameplate";




const labelStyles = {
    bottom: "bottom-[8vh] sm:bottom-[10vh] md:bottom-[40vh]",
    right: "right-[2vw] sm:right-[3vw] md:right-[6.9vw]",
    scale: "scale-[0.5] sm:scale-[0.7] md:scale-[0.7]",
    fontSize: "text-[64px] sm:text-[84px] md:text-[117.9px]",
  };
  
  
export default function Contact() {
  const isMobile = useIsMobile();

  // Mobile version
  if (isMobile) {
    return <ContactMobile />;
  }

  // Desktop version
  return (
    <main className="relative min-h-screen bg-[#554943] text-[#fef4dc] font-blurlight overflow-hidden">
        

      <ContactLabel
        bottom={labelStyles.bottom}
        right={labelStyles.right}
        scale={labelStyles.scale}
        
        fontSize={labelStyles.fontSize}
        />

      {/* Interactive Fingie SVG - Right side, lower position */}
      <div className="absolute right-[7vw] top-[55%] transform -translate-y-1/2 z-[1002] max-h-[80vh] overflow-visible scale-[0.3]">
        <InteractiveHand />
      </div>

      {/* Interactive Morse Code SVG - Below InteractiveHand */}
      <div className="absolute right-[7vw] top-[75%] transform -translate-y-1/2 z-[1002] max-h-[80vh] overflow-visible scale-[1]">
        <InteractiveMorse />
      </div>

      
      {/* Contact Information - Left */}
      <div className="absolute top-[12rem] left-[20rem] text-[#fef4dc] font-blurlight">
        <div className="flex items-center gap-3 mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#fef4dc]">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className="text-lg">@vittoriocova_studio</span>
        </div>
        
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#fef4dc]">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span className="text-lg">studio@vittoriocova.com</span>
        </div>
      </div>

      {/* Signature - Left */}
      <div className="absolute top-[60%] left-[20rem] transform -translate-y-1/2 z-[1001]">
        <img 
          src="/assets/signatureLight.svg" 
          alt="Vittorio Cova Signature" 
          className="w-auto h-20 sm:h-24 md:h-28"
        />
      </div>

      {/* Locations - Left */}
      <div className="absolute top-[70%] left-[20rem] text-[#fef4dc] font-blurlight">
        <div className="text-lg">
          <span>Mexico City</span>
          <span className="mx-2">|</span>
          <span>Houston</span>
          <span className="mx-2">|</span>
          <span>Florence</span>
        </div>
      </div>

      {/* Copyright - Left */}
      <div className="absolute top-[78%] left-[24rem] text-[#fef4dc] font-blurlight">
        <div className="text-sm">
          © Vittorio Cova Studio<br />
          &nbsp;&nbsp;All rights reserved.
        </div>
      </div>

    </main>
  );
}
