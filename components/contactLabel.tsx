"use client";

import React from "react";

type Props = {
    bottom?: string;
    right?: string;
    left?: string;
    scale: string;
    fontSize: string;
    /** Use "top left" to align the label's leftmost edge with barcode left (desktop). Default "bottom left". */
    transformOrigin?: 'top left' | 'bottom left';
  };
  
  export default function ContactLabel({ bottom, right, left, scale, fontSize, transformOrigin = 'bottom left' }: Props) {
    return (
      <div
        className={`
          absolute
          ${bottom ?? ''}
          ${right ?? ''}
          ${left ?? ''}
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
          ...(!bottom && { bottom: 'var(--barcode-bottom-offset, 80px)' }),
          ...(left !== undefined && { right: 'auto' }),
          transform: 'rotate(-90deg)',
          transformOrigin
        } as React.CSSProperties}
      >
        CONTACT.
      </div>
    );
  }
  