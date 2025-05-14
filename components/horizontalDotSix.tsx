"use client";

import React from "react";

interface HorizontalDotSixProps {
  className?: string;
}

export default function HorizontalDotSix({ className = "" }: HorizontalDotSixProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="4"
      viewBox="0 0 5 4"
      fill="none"
      className={className}
    >
      <path d="M0.431328 0.39L3.86055 0.309998V2.06999L0.429688 1.98L0.431328 0.39Z" fill="#FFF5E1" stroke="black" strokeWidth="0.01" />
    </svg>
  );
}
