"use client";

import React from "react";

type AboutNameplateProps = {
  top?: string;
  right?: string;
  fontSize?: string;
};

export default function AboutNameplate({
  top = "top-[4.2%]",
  right = "right-[8.2%]",
  fontSize = "text-[23px]",
}: AboutNameplateProps) {
  return (
    <div
      className={`
        absolute
        ${top}
        ${right}
        w-[222px]
        h-[23px]
        ${fontSize}
        text-[#FEF4DC]
        font-basica
        font-normal
        leading-none
        tracking-tight
        z-[1002]
      `}
    >
      Vittorio Cova
    </div>
  );
}
