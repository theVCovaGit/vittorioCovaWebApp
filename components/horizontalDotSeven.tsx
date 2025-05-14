"use client";

import React from "react";

interface HorizontalDotSevenProps {
  className?: string;
}

export default function HorizontalDotSeven({ className = "" }: HorizontalDotSevenProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="4"
      viewBox="0 0 5 4"
      fill="none"
      className={className}
    >
      <path d="M0.94 1.22L4.36937 1.14999V3.21999L0.939453 3.13999L0.94 1.22Z" fill="#FFF5DF" stroke="black" strokeWidth="0.01" />
    </svg>
  );
}
