"use client";

import React, { useEffect } from "react";
import InteractiveHand from "@/components/interactiveHand";
import ContactLabel from "@/components/contactLabel";

export default function ContactMobile() {
  // Disable scrolling on mobile contact page
  useEffect(() => {
    // Store original values
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;
    
    // Set overflow hidden and height 100vh
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";
    
    return () => {
      // Restore original values
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-[#302120] text-[#fef4dc] font-basica px-3 py-4 pb-20 pt-20">
      {/* Contact Label - Right side, rotated - aligned with barcode bottom */}
      <ContactLabel
        bottom="bottom-0"
        right="-right-10"
        scale="scale-[1]"
        fontSize="text-[40px]"
      />

      {/* Interactive Hand - Right side, much smaller */}
      <div className="absolute -right-16 top-1/4 z-10 max-h-[30vh] overflow-visible scale-[0.15]">
        <InteractiveHand />
      </div>

      {/* Content - Centered */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-[1001] px-4">
        {/* Contact Information */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#fef4dc]">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-[0.65rem] font-electrolize">@vittoriocova_studio</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#fef4dc]">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span className="text-[0.65rem] font-electrolize">studio@vittoriocova.com</span>
          </div>
        </div>

        {/* Signature */}
        <div className="mb-4 flex justify-center">
          <img 
            src="/assets/signatureLight.svg" 
            alt="Vittorio Cova Signature" 
            className="w-auto h-12"
          />
        </div>

        {/* Locations */}
        <div className="mb-4 text-[0.65rem] font-microextend">
          <div>
            <span>Mexico City</span>
            <span className="mx-2">|</span>
            <span>Houston</span>
            <span className="mx-2">|</span>
            <span>Florence</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-[0.5rem] font-microextend">
          <div>
            © Vittorio Cova Studio<br />
            &nbsp;&nbsp;All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
