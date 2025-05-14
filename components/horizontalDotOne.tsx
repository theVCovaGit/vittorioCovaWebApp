"use client";

import React from "react";

interface HorizontalDotOneProps {
  className?: string;
}

export default function HorizontalDotOne({ className = "" }: HorizontalDotOneProps) {
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
        d="M0.5 1.04999L3.89 0.955002L3.9 1.4L0.5 1.3V1.04999Z"
        fill="#FFFBF1"
        stroke="black"
        strokeWidth="0.01"
      />
    </svg>
  );
}
