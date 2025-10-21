"use client";

export default function Art() {
  return (
    <div className="min-h-screen bg-[#895a59] relative overflow-hidden">
      {/* Film Strip Container */}
      <div 
        className="film-strip-container absolute top-[48.3%] left-0 transform -translate-y-1/2 w-screen h-[500px] overflow-x-scroll overflow-y-hidden scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Papyrus SVG */}
        <div className="relative w-full h-full flex">
          <img 
            src="/assets/papyrus.svg" 
            alt="Film Strip" 
            className="h-full w-auto object-contain flex-shrink-0"
          />
          <img 
            src="/assets/papyrus.svg" 
            alt="Film Strip" 
            className="h-full w-auto object-contain flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
