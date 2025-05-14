"use client";

import React from "react";

interface HorizontalDotTenProps {
  className?: string;
}

export default function HorizontalDotTen({ className = "" }: HorizontalDotTenProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="4"
      viewBox="0 0 5 4"
      fill="none"
      className={className}
    >
      <path d="M3.82969 3.72V0.639999L0.429688 0.710002V3.64L3.82969 3.72Z" fill="#FFF5DD" stroke="black" strokeWidth="0.01" />
    </svg>
  );
}
