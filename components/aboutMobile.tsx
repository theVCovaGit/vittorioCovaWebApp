"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import AboutLabel from "@/components/aboutLabel";
import AboutBody from "@/components/aboutBody";
import { useAboutContent } from "@/hooks/usePageContent";

export default function AboutMobile() {
  const content = useAboutContent();

  // Disable scrolling on mobile about page
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
    <div className="relative h-screen overflow-hidden bg-[#fff3df] text-[#a08e80] font-blurlight">
      {/* About Label - Right side, rotated - aligned with barcode bottom; iPad Mini gap via .ipad-mini-label-gap */}
      <div
        className="ipad-mini-label-gap"
        style={{
          position: 'fixed',
          left: 'calc(var(--barcode-right, 100vw) + 4.2rem)',
          bottom: 'var(--barcode-bottom-offset, 80px)',
          zIndex: 40
        }}>
        <AboutLabel
          bottom="bottom-0"
          right="left-0"
          scale="scale-[1]"
          fontSize="text-[60px] sm:text-[70px] md:text-[80px]"
        />
      </div>

      {/* Fingerprint - right above the "t"; iPad Mini: .ipad-mini-icon-gap + higher/bigger via .ipad-mini-icon-about */}
      <div
        className="fixed z-[1010] pointer-events-none flex justify-center ipad-mini-icon-gap ipad-mini-icon-about"
        style={{
          left: "calc(var(--barcode-right, 100vw) - 2px)",
          bottom: "var(--barcode-bottom-offset, 80px)",
          width: "80px",
          transform: "translateY(calc(-100% - 9rem))",
        }}
      >
        <Link
          href="/admin"
          className="pointer-events-auto flex justify-center cursor-pointer"
          aria-label="Go to admin"
        >
          <img
            src="/assets/fingie.svg"
            alt=""
            className="h-auto max-h-[14vh] w-auto object-contain"
            style={{ width: "min(44px, 12vw)" }}
          />
        </Link>
      </div>

      {/* Content - Left side - Constrained between header and footer */}
      <div 
        className="absolute left-0 right-0 px-3 pr-24 pl-8 overflow-y-auto"
        style={{
          top: 'calc(var(--mobile-header-height) + 8vh)',
          bottom: '21vh',
          maxHeight: 'calc(100vh - var(--mobile-header-height) - 26vh)'
        }}
      >
        {/* Description – iPad: a bit bigger than rest via .about-mobile-heading-text */}
        <div className="text-[0.9rem] mb-4 leading-relaxed font-blurlight about-mobile-heading-text">
          {content.heading.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {/* Philosophical Thoughts Section */}
        <div className="mb-4 pl-4">
          <div className="space-y-2 text-[0.55rem] leading-relaxed font-blurlight about-mobile-content-text">
            <AboutBody body={content.body} highlightClassName="text-[#fec776] font-bold" />
          </div>
        </div>
      </div>
    </div>
  );
}
