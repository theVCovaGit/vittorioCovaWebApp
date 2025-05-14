"use client";

import React from "react";

interface HorizontalDotEightProps {
  className?: string;
}

export default function HorizontalDotEight({ className = "" }: HorizontalDotEightProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="4"
      viewBox="0 0 5 4"
      fill="none"
      className={className}
    >
      <path d="M3.84992 3.39V0.970001L0.42 1.05L0.419922 3.31L3.84992 3.39Z" fill="#FFF5DE" stroke="black" strokeWidth="0.01" />
    </svg>
  );
}
