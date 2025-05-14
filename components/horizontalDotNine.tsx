"use client";

import React from "react";

interface HorizontalDotNineProps {
  className?: string;
}

export default function HorizontalDotNine({ className = "" }: HorizontalDotNineProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="4"
      viewBox="0 0 5 4"
      fill="none"
      className={className}
    >
      <path d="M4.33969 3.56V0.809998L0.929688 0.87V3.48L4.33969 3.56Z" fill="#FFF5DD" stroke="black" strokeWidth="0.01" />
    </svg>
  );
}
