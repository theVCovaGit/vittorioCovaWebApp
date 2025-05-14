"use client";

import React from "react";

interface HorizontalDotTwoProps {
  className?: string;
}

export default function HorizontalDotTwo({ className = "" }: HorizontalDotTwoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="2"
      viewBox="0 0 5 2"
      fill="none"
      className={className}
    >
      <path
        d="M0.971406 1.48L4.36078 1.55V0.800003L0.970703 0.89L0.971406 1.48Z"
        fill="#FFFBF1"
        stroke="black"
        strokeWidth="0.01"
      />
    </svg>
  );
}
