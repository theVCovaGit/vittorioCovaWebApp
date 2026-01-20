"use client";

import Link from "next/link";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#302120] relative overflow-hidden flex flex-col">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#302120] flex items-center justify-center px-4" style={{ height: 'var(--mobile-header-height)' }}>
        <Link href="/" className="flex flex-col items-center justify-center no-underline leading-none">
          <span className="text-[#fef4dc] font-blurlight text-2xl font-bold uppercase tracking-wide">
            VITTORIO COVA
          </span>
          <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
            STUDIO
          </span>
        </Link>
      </header>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-[104px]">
        {/* Navigation Links */}
        <div className="flex flex-col items-center space-y-0.5 w-full -mt-[5.5rem]">
          <Link 
            href="/architecture" 
            className="text-[#fef4dc] font-blurlight text-sm font-bold uppercase tracking-wide no-underline
              w-full max-w-xs py-4 text-center"
          >
            ARCHITECTURE
          </Link>
          
          <Link 
            href="/film" 
            className="text-[#fef4dc] font-blurlight text-sm font-bold uppercase tracking-wide no-underline
              w-full max-w-xs py-4 text-center"
          >
            FILM
          </Link>
          
          <Link 
            href="/art" 
            className="text-[#fef4dc] font-blurlight text-sm font-bold uppercase tracking-wide no-underline
              w-full max-w-xs py-4 text-center"
          >
            ART
          </Link>
        </div>
      </div>
    </div>
  );
}

