"use client";

export default function Film() {
  return (
    <div className="min-h-screen bg-[#5c4b4a] relative overflow-hidden">
      {/* Film Strip Container */}
      <div className="film-strip-container absolute top-1/2 left-0 transform -translate-y-1/2 w-[400vw] h-[500px] overflow-x-auto overflow-y-hidden">
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
