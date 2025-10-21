"use client";

export default function Architecture() {
  return (
    <div className="min-h-screen bg-[#fff5e0] relative overflow-hidden">
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
        {/* Architecture Scroll with Tape */}
        <div className="relative w-full h-full flex">
          <div className="relative flex-shrink-0">
            <img 
              src="/assets/scroll.svg" 
              alt="Architecture Scroll" 
              className="h-full w-auto object-contain"
            />
            
            {/* Single tape at upper left corner */}
            <img 
              src="/assets/tape2.svg" 
              alt="Tape" 
              className="absolute top-2 left-2 w-48 h-16 opacity-80 transform rotate-[-5deg]"
            />
          </div>
          
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
