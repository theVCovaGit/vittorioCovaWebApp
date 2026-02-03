"use client";

import React, { useState } from "react";

export default function InteractiveMorse() {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const handleAreaClick = (area: string) => {
    console.log(`${area} clicked!`);
    alert(`You clicked ${area}!`);
  };

  return (
    <div className="relative w-auto h-auto scale-[0.6] pointer-events-none">
      {/* Base morse code image */}
      <img 
        src="/assets/morse.svg" 
        alt="Morse Code" 
        className="w-[200px] sm:w-[250px] md:w-[300px] h-auto"
      />
      
      {/* Overlay: non-interactive (morse code not clickable) */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 151.33 70.27"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Interactive morse code elements - these will light up yellow on hover */}
          
          {/* VITTORIO line */}
          <text 
            transform="translate(0 16.14)"
            fill={hoveredArea === "vittorio" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("vittorio")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("VITTORIO")}
            className="cursor-pointer transition-all duration-300"
            style={{ fontFamily: 'Helvetica', fontSize: '18.79px' }}
          >
            <tspan x="0" y="0">...- .. - - --- .-. .. --- </tspan>
          </text>

          {/* COVA line */}
          <text 
            transform="translate(0 38.69)"
            fill={hoveredArea === "cova" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("cova")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("COVA")}
            className="cursor-pointer transition-all duration-300"
            style={{ fontFamily: 'Helvetica', fontSize: '18.79px' }}
          >
            <tspan x="0" y="0">-.-. --- ...- .-</tspan>
          </text>

          {/* STUDIO line */}
          <text 
            transform="translate(0 61.24)"
            fill={hoveredArea === "studio" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("studio")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("STUDIO")}
            className="cursor-pointer transition-all duration-300"
            style={{ fontFamily: 'Helvetica', fontSize: '18.79px' }}
          >
            <tspan x="0" y="0">... - ..- -.. .. ---</tspan>
          </text>

          {/* Individual morse code characters for more granular interaction */}
          
          {/* V = ...- */}
          <rect
            x="0"
            y="0"
            width="20"
            height="16"
            fill={hoveredArea === "v" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("v")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("V (...-)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* I = .. */}
          <rect
            x="25"
            y="0"
            width="15"
            height="16"
            fill={hoveredArea === "i1" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("i1")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("I (..)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* T = - */}
          <rect
            x="45"
            y="0"
            width="10"
            height="16"
            fill={hoveredArea === "t1" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("t1")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("T (-)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* T = - */}
          <rect
            x="60"
            y="0"
            width="10"
            height="16"
            fill={hoveredArea === "t2" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("t2")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("T (-)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* O = --- */}
          <rect
            x="75"
            y="0"
            width="20"
            height="16"
            fill={hoveredArea === "o1" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("o1")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("O (---)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* R = .-. */}
          <rect
            x="100"
            y="0"
            width="15"
            height="16"
            fill={hoveredArea === "r" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("r")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("R (.-.)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* I = .. */}
          <rect
            x="120"
            y="0"
            width="15"
            height="16"
            fill={hoveredArea === "i2" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("i2")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("I (..)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* O = --- */}
          <rect
            x="140"
            y="0"
            width="20"
            height="16"
            fill={hoveredArea === "o2" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("o2")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("O (---)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* COVA line - C = -.-. */}
          <rect
            x="0"
            y="22"
            width="20"
            height="16"
            fill={hoveredArea === "c" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("c")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("C (-.-.)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* O = --- */}
          <rect
            x="25"
            y="22"
            width="20"
            height="16"
            fill={hoveredArea === "o3" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("o3")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("O (---)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* V = ...- */}
          <rect
            x="50"
            y="22"
            width="20"
            height="16"
            fill={hoveredArea === "v2" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("v2")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("V (...-)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* A = .- */}
          <rect
            x="75"
            y="22"
            width="10"
            height="16"
            fill={hoveredArea === "a" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("a")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("A (.-)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* STUDIO line - S = ... */}
          <rect
            x="0"
            y="44"
            width="15"
            height="16"
            fill={hoveredArea === "s" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("s")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("S (...)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* T = - */}
          <rect
            x="20"
            y="44"
            width="10"
            height="16"
            fill={hoveredArea === "t3" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("t3")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("T (-)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* U = ..- */}
          <rect
            x="35"
            y="44"
            width="15"
            height="16"
            fill={hoveredArea === "u" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("u")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("U (..-)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* D = -.. */}
          <rect
            x="55"
            y="44"
            width="15"
            height="16"
            fill={hoveredArea === "d" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("d")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("D (-..)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* I = .. */}
          <rect
            x="75"
            y="44"
            width="15"
            height="16"
            fill={hoveredArea === "i3" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("i3")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("I (..)")}
            className="cursor-pointer transition-all duration-300"
          />

          {/* O = --- */}
          <rect
            x="95"
            y="44"
            width="20"
            height="16"
            fill={hoveredArea === "o4" ? "#fbe147" : "transparent"}
            onMouseEnter={() => setHoveredArea("o4")}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick("O (---)")}
            className="cursor-pointer transition-all duration-300"
          />
        </svg>
      </div>
    </div>
  );
}
