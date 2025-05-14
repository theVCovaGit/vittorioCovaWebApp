"use client";

import React from "react";

interface HorizontalDotFourProps {
  className?: string;
}

export default function HorizontalDotFour({ className = "" }: HorizontalDotFourProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="4"
      viewBox="0 0 5 4"
      fill="none"
      className={className}
    >
      <path d="M0.75 0.18L2.39039 0.130005V0.230005L0.75 0.18Z" fill="#FFF8E9" stroke="black" strokeWidth="0.01" />
    </svg>
  );
}
