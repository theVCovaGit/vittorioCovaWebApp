"use client";

import React from "react";

type AboutNameplateProps = {
  top?: string;
  leftPercent?: string; // new prop
  fontSize?: string;
};

export default function AboutNameplate({
  top = "top-[7.2%]",
  leftPercent = "left-[74.9%]", // ← % based inside frame
  fontSize = "text-[23px]",
}: AboutNameplateProps) {
  return (
    <div
      className={`
        absolute
        ${top}
        ${leftPercent}
        ${fontSize}
        w-[222px]
        h-[23px]
        text-[#FEF4DC]
        font-blurlight
        font-normal
        leading-none
        tracking-tight
        transform -translate-x-1/2
        z-[1002]
      `}
    >
      Vittorio Cova
    </div>
  );
}
