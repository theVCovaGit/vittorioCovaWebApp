"use client";

import React, { useState } from "react";

export default function InteractiveMosaics() {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const handleAreaClick = (area: string) => {
    console.log(`${area} clicked!`);
    alert(`You clicked ${area}!`);
  };

  return (
    <div className="relative w-auto h-auto scale-[0.6]">
      {/* Base mosaics image */}
      <img 
        src="/assets/mosaics.svg" 
        alt="Mosaics" 
        className="w-[200px] sm:w-[250px] md:w-[300px] h-auto"
      />
      
      {/* Interactive overlay */}
      <div className="absolute inset-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 129.19 255.07"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Interactive areas - these will light up yellow on hover */}
          {/* Top section */}
          <path
            d="M98.76,251.09c-3.94,0-8.33.21-12.68-.14-1.14-.09-2.22-1.87-3.17-3-.36-.43-.45-1.24-.4-1.86.55-6.07-2.44-11.57-2.74-17.5-.18-3.6.2-7.31-.58-10.76-.88-3.9-.39-8.07-1.58-11.64-1.63-4.92-.62-9.67-1-14.47-.22-2.72-.8-5.41-1.02-8.13-.22-2.66-.25-5.34-.24-8.01,0-1.47.29-2.93.43-4.22,7.26,0,14.33-.06,21.39.04,1.77.03,2.45,2.22,2.11,4.26-.75,4.59-1.58,9.21-1.68,13.84-.08,4,.94,8.02,1.23,12.04.17,2.37-.14,4.77-.23,7.16-.02.46-.12.96.01,1.38,1.13,3.74,1.83,7.72,3.62,11.12,1.12,2.12.82,3.84.74,5.83-.11,2.61.28,5.29-.22,7.81-.68,3.36-2.13,6.56-3.02,9.89-.55,2.03-.67,4.18-.99,6.37Z"
            fill={hoveredArea === "area1" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("area1")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("Mosaic Area 1")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* Middle section */}
          <path
            d="M126.63,149.48v16.68h-35.07c.54-2.57,1.01-4.75,1.47-6.93.81-3.91,1.76-7.81,2.34-11.76.18-1.25-.59-2.64-.95-3.96-.23-.85-.69-1.69-.73-2.55-.31-6.25-.66-12.51-.75-18.77-.05-3.37.42-6.75.63-10.13.06-.93.42-2.09,0-2.75-1.64-2.66-.5-5.12.07-6.99,3.73-.56,7.2-1.28,10.7-1.53,2.61-.19,5.3.04,7.9.45,1.58.25,2.5,1.42,1.67,3.27-.25.55-.35,1.29-.22,1.88,1,4.42,2.08,8.83,3.14,13.24.04.18.26.4.2.5-2.32,4.41-.43,9.64-2.99,14.12-1.9,3.33-3.02,7.12-4.3,10.77-.61,1.74.48,2.26,2.14,2.23,2.95-.05,5.94-.18,8.85.19,1.97.25,3.84,1.29,5.89,2.03Z"
            fill={hoveredArea === "area2" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("area2")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("Mosaic Area 2")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* Upper section */}
          <path
            d="M125.75,89.67h-35.26c.72-3.45,1.42-6.43,1.96-9.44.34-1.91.63-3.86.64-5.8.01-1.96,1.08-2.31,2.63-2.31,2.43,0,4.86,0,7.29,0l.05-1.04c-1.82-.26-3.63-.53-5.45-.78-2.81-.39-4.81-2.48-4.94-5.37-.31-6.64-.67-13.29-.76-19.94-.05-3.3.47-6.61.71-9.91.05-.64.21-1.38-.04-1.91-1.24-2.67-.92-5.27-.01-7.36,3.59-.55,6.97-1.27,10.39-1.52,2.81-.21,5.7-.06,8.47.4.68.11,1.27,2,1.54,3.16.34,1.44.28,2.97.45,4.45.06.51.45,1.02.4,1.5-.37,3.35.32,6.43,2.03,9.33.23.38.17,1.15-.06,1.56-1.36,2.4-1.06,4.95-1.04,7.55.02,1.57-.59,3.23-1.27,4.69-1.3,2.79-2.86,5.46-4.31,8.18-.13.24-.35.49-.36.74-.06,1.29-.43,2.76.06,3.82.29.61,1.98.68,3.06.79,2.38.23,4.8.19,7.16.53,2.02.29,4.01.88,5.96,1.51.37.12.68,1.07.68,1.63.05,5.13.03,10.27.03,15.53Z"
            fill={hoveredArea === "area3" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("area3")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("Mosaic Area 3")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* Bottom section */}
          <path
            d="M2.84,229.9c.37-18.59.72-36.68,1.09-55.17,1.67-.15,3.28-.42,4.9-.4,5.29.06,10.58.32,15.86.3,1.89,0,2.76.47,3.26,2.42.67,2.65,1.94,5.14,2.78,7.76.36,1.11.6,2.43.34,3.53-1.09,4.57-2.54,9.05-3.57,13.63-.92,4.05-1.26,8.23-2.21,12.27-1.19,5.09-1.33,10.58-5.01,14.83-.32.37-.83.8-1.25.8-5.29.05-10.58.04-16.18.04Z"
            fill={hoveredArea === "area4" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("area4")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("Mosaic Area 4")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* Right side section */}
          <path
            d="M124.91,251.82h-16.46v-79.55h14.7c-.49,3.09,1.37,6.15-.88,9.47-1.06,1.57-.74,4.28-.59,6.44.31,4.5.98,8.98,1.39,13.47.1,1.08-.48,2.23-.35,3.29.25,1.98.88,3.92,1.2,5.89.31,1.88.49,3.78.64,5.68.37,4.63.71,9.27,1.01,13.91.31,4.68.78,9.37.76,14.05,0,2.41-.91,4.82-1.44,7.36Z"
            fill={hoveredArea === "area5" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("area5")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("Mosaic Area 5")}
            className="cursor-pointer transition-all duration-300"
          />
        </svg>
      </div>
    </div>
  );
}

