"use client";

import Link from "next/link";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#5c4b4a] relative overflow-hidden flex flex-col">
      {/* Logo */}
      <div className="absolute top-8 left-4 px-4">
        <img 
          src="/logos/logoYellow.png" 
          alt="Vittorio Cova Studio Logo" 
          className="h-12 w-auto"
        />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Studio Name */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center mb-2">
            <span className="text-[#fef4dc] font-microextend text-lg font-bold uppercase tracking-wide">
              VITTORIO COVA
            </span>
          </div>
          <div className="flex items-center">
            <svg width="60" height="3" viewBox="0 0 60 3" className="mr-2">
              <rect x="0" y="0" width="60" height="2" fill="#fdf053"/>
            </svg>
            <span className="text-[#fdf053] font-microextend text-lg font-bold uppercase tracking-wide">
              STUDIO
            </span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col items-center space-y-6 w-full">
          <Link 
            href="/architecture" 
            className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide no-underline
              w-full max-w-xs py-4 text-center"
          >
            ARCHITECTURE
          </Link>
          
          <Link 
            href="/productdesign" 
            className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide no-underline
              w-full max-w-xs py-4 text-center"
          >
            PRODUCT DESIGN
          </Link>
          
          <Link 
            href="/film" 
            className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide no-underline
              w-full max-w-xs py-4 text-center"
          >
            FILM
          </Link>
          
          <Link 
            href="/art" 
            className="text-[#fef4dc] font-microextend text-xl font-bold uppercase tracking-wide no-underline
              w-full max-w-xs py-4 text-center"
          >
            ART
          </Link>
        </div>
      </div>
    </div>
  );
}

