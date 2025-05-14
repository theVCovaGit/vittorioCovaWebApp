"use client";

import React from "react";

interface HorizontalDotFiveProps {
  className?: string;
}

export default function HorizontalDotFive({ className = "" }: HorizontalDotFiveProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="4"
      viewBox="0 0 5 4"
      fill="none"
      className={className}
    >
      <path d="M0.96 0.55L4.34969 0.470001V1.89L0.958984 1.81L0.96 0.55Z" fill="#FFF6E4" stroke="black" strokeWidth="0.01" />
    </svg>
  );
}
