"use client";

import React from "react";

type Props = {
    bottom: string;
    right: string;
    scale: string;
    fontSize: string;
  };
  
  export default function ContactLabel({ bottom, right, scale, fontSize }: Props) {
    return (
      <div
        className={`
          absolute
          ${bottom}
          ${right}
          rotate-[-90deg]
          ${scale}
          
          ${fontSize}
          text-[#fec776]
          font-blurlight
          font-medium
          leading-none
          tracking-tight
          z-[1001]
        `}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: 'bottom left'
        } as React.CSSProperties}
      >
        CONTACT.
      </div>
    );
  }
  