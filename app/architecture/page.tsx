"use client";

export default function Architecture() {
  return (
    <div className="min-h-screen bg-[#fff5e0] relative">
      {/* Tapes positioned outside the scroll container - Above */}
      <img 
        src="/assets/tape1.svg" 
        alt="Tape" 
        className="absolute top-[calc(50%-250px-48px)] left-[5%] w-48 h-16 opacity-80 transform rotate-[2deg] z-50"
      />
      <img 
        src="/assets/tape2.svg" 
        alt="Tape" 
        className="absolute top-[calc(50%-250px-48px)] left-[25%] w-48 h-16 opacity-80 transform rotate-[-5deg] z-50"
      />
      <img 
        src="/assets/tape3.svg" 
        alt="Tape" 
        className="absolute top-[calc(50%-250px-48px)] left-[45%] w-48 h-16 opacity-80 transform rotate-[4deg] z-50"
      />
      <img 
        src="/assets/tape4.svg" 
        alt="Tape" 
        className="absolute top-[calc(50%-250px-48px)] left-[65%] w-48 h-16 opacity-80 transform rotate-[-2deg] z-50"
      />
      <img 
        src="/assets/tape5.svg" 
        alt="Tape" 
        className="absolute top-[calc(50%-250px-48px)] left-[85%] w-48 h-16 opacity-80 transform rotate-[3deg] z-50"
      />
      <img 
        src="/assets/tape6.svg" 
        alt="Tape" 
        className="absolute top-[calc(50%-250px-48px)] left-[15%] w-48 h-16 opacity-80 transform rotate-[-4deg] z-50"
      />
      
      {/* Film Strip Container */}
      <div 
        className="film-strip-container absolute top-1/2 left-0 transform -translate-y-1/2 w-screen h-[500px] overflow-x-scroll overflow-y-hidden scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Architecture Scroll */}
        <div className="relative w-full h-full flex">
          <img 
            src="/assets/scroll.svg" 
            alt="Architecture Scroll" 
            className="h-full w-auto object-contain flex-shrink-0"
          />
          <img 
            src="/assets/scroll.svg" 
            alt="Architecture Scroll" 
            className="h-full w-auto object-contain flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
