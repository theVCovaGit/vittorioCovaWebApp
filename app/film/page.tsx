"use client";

export default function Film() {
  return (
    <div className="min-h-screen bg-[#2d2f38] relative overflow-hidden">
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
        {/* Film Strip SVG */}
        <div className="relative w-full h-full flex">
          <img 
            src="/assets/film.svg" 
            alt="Film Strip" 
            className="h-full w-auto object-contain flex-shrink-0"
          />
          <img 
            src="/assets/film.svg" 
            alt="Film Strip" 
            className="h-full w-auto object-contain flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
