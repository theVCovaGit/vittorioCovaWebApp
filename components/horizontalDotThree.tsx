"use client";

import React from "react";

interface HorizontalDotThreeProps {
  className?: string;
}

export default function HorizontalDotThree({ className = "" }: HorizontalDotThreeProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="2"
      viewBox="0 0 4 2"
      fill="none"
      className={className}
    >
      <path
        d="M0.45 1.65001L3.88 1.71001V0.630005L0.449219 0.720011L0.45 1.65001Z"
        fill="#FFF8E9"
        stroke="black"
        strokeWidth="0.01"
      />
    </svg>
  );
}
