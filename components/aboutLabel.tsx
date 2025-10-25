"use client";

import React from "react";

type Props = {
    bottom: string;
    right: string;
    scale: string;
    fontSize: string;
  };
  
  export default function AboutLabel({ bottom, right, scale, fontSize }: Props) {
    return (
      <div
        className={`
          absolute
          ${bottom}
          ${right}
          rotate-[-90deg]
          transform
          translate-y-[calc(-1*var(--barcode-height,40px)-5px)]
          ${scale}
          
          ${fontSize}
          text-[#F7E32D]
          font-minecraft
          font-medium
          leading-none
          tracking-tight
          z-[1001]
        `}
      >
        ABOUT.
      </div>
    );
  }
  