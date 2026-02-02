"use client";

import React from "react";

type Props = {
    bottom?: string;
    right: string;
    scale: string;
    fontSize: string;
  };
  
  export default function AboutLabel({ bottom, right, scale, fontSize }: Props) {
    return (
      <div
        className={`
          absolute
          ${bottom ?? ''}
          ${right}
          rotate-[-90deg]
          ${scale}
          
          ${fontSize}
          text-[#F7E32D]
          font-blurlight
          font-medium
          leading-none
          tracking-tight
          z-[1001]
        `}
        style={{
          ...(!bottom && { bottom: 'var(--barcode-bottom-offset, 80px)' }),
          transform: 'rotate(-90deg)',
          transformOrigin: 'bottom left'
        } as React.CSSProperties}
      >
        ABOUT.
      </div>
    );
  }
  