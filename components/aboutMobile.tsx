"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import AboutLabel from "@/components/aboutLabel";

export default function AboutMobile() {
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
      {/* About Label - Right side, rotated - aligned with barcode bottom */}
      <div style={{ 
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

      {/* Fingerprint - right above the "t"; click navigates to /admin */}
      <div
        className="fixed z-[1010] pointer-events-none flex justify-center"
        style={{
          left: "var(--barcode-right, 100vw)",
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
        {/* Description */}
        <div className="text-[0.9rem] mb-4 leading-relaxed font-blurlight">
          <p>A multi-faceted architecture and</p>
          <p>creative design firm</p>
          <p>founded in 2025</p>
        </div>

        {/* Philosophical Thoughts Section */}
        <div className="mb-4 pl-4">
          <div className="space-y-2 text-[0.55rem] leading-relaxed font-blurlight">
            <p>
              The greatest moment in human history was not when man walked the Moon, but when <span className="text-[#fec776] font-bold">God</span> walked the Earth.
            </p>
            <p>
              Tell yourself that pain is a reminder that you live, discomfort is <span className="text-[#fec776] font-bold">Growth</span>.
            </p>
            <p>
              If you have no <span className="text-[#fec776] font-bold">Ideas</span>, there is no vision. If you have many ideas, there is still no vision.
            </p>
            <p>
              Genuine <span className="text-[#fec776] font-bold">Passion</span> births success.
            </p>
            <p>
              <span className="text-[#fec776] font-bold">Silence</span> is a beautiful thing.
            </p>
            <p>
              <span className="text-[#fec776] font-bold">Nature</span> is Mother, it will serve as a sanctuary, offering both mental clarity and a wellspring of inspiration.
            </p>
            <p>
              Let <span className="text-[#fec776] font-bold">Gratitude</span> nourish your dreams.
            </p>
            <p>
              <span className="text-[#fec776] font-bold">Live</span> the world, don&apos;t let it live you.
            </p>
            <p>
              Always be the <span className="text-[#fec776] font-bold">Smile</span> that someone may need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
