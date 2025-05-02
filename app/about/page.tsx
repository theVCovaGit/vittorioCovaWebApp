"use client";

import React from "react";
import AboutFrame from "@/components/aboutFrame";

// ⬅️ Optional offsets you can still tweak later
const frameStyles = {
  top: "mt-[11rem] md:mt-[11.5rem]",
  bottom: "mb-[6rem]",
  left: "left-[5vw] sm:left-[6vw] xl:left-[6vw]",
};

export default function About() {
  return (
    <main className="relative min-h-screen bg-[#5c4b4a] text-[#fef4dc] font-basica overflow-hidden">
      {/* 🔳 Frame container - responsive, graceful fallback on small screens */}
      <div
        className={`
          absolute
          top-0
          ${frameStyles.top}
          ${frameStyles.bottom}
          ${frameStyles.left}
          w-[min(90vw,52vw)]     // ✅ full responsiveness
          max-w-[1200px]         // ✅ caps on large screens
          min-w-[320px]          // ✅ avoid being crushed on tiny screens
          aspect-[781/588]       // ✅ keeps SVG looking crisp
          transform
          origin-top-left
          z-[1000]
        `}
      >
        <AboutFrame />
      </div>

      {/* 🧱 Content Zone (stacked on top of SVG) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12">
        {/* 🧬 Add your bio, images, icons, etc. here */}
      </section>
    </main>
  );
}
