"use client";

export default function Architecture() {
  return (
    <div className="min-h-screen bg-[#fff5e0] relative overflow-visible">
      {/* Film Strip Container */}
      <div 
        className="film-strip-container absolute top-[48.3%] left-0 transform -translate-y-1/2 w-screen h-[700px] overflow-x-scroll overflow-y-visible scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Architecture Scroll with Tapes */}
        <div className="relative w-full h-full flex items-center">
          <div className="relative flex-shrink-0">
            <img 
              src="/assets/scroll.svg" 
              alt="Architecture Scroll" 
              className="h-[500px] w-auto object-contain"
            />
            
            {/* Tapes positioned relative to the scroll - Above */}
            <img 
              src="/assets/tape1.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[5%] w-48 h-16 opacity-80 transform rotate-[2deg] z-[9999]"
            />
            <img 
              src="/assets/tape2.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[25%] w-48 h-16 opacity-80 transform rotate-[-5deg] z-[9999]"
            />
            <img 
              src="/assets/tape3.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[45%] w-48 h-16 opacity-80 transform rotate-[4deg] z-[9999]"
            />
            <img 
              src="/assets/tape4.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[65%] w-48 h-16 opacity-80 transform rotate-[-2deg] z-[9999]"
            />
            <img 
              src="/assets/tape5.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[85%] w-48 h-16 opacity-80 transform rotate-[3deg] z-[9999]"
            />
            <img 
              src="/assets/tape6.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[15%] w-48 h-16 opacity-80 transform rotate-[-4deg] z-[9999]"
            />
          </div>
          
          <img 
            src="/assets/scroll.svg" 
            alt="Architecture Scroll" 
            className="h-[500px] w-auto object-contain flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
