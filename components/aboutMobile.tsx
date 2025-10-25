"use client";

import React, { useEffect } from "react";
import InteractiveFingie from "@/components/interactiveFingie";
import AboutLabel from "@/components/aboutLabel";

export default function AboutMobile() {
  // Disable scrolling on mobile about page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#302120] text-[#fef4dc] font-basica px-3 py-4 pb-20 pt-20">
      {/* About Label - Right side, rotated */}
      <AboutLabel
        bottom="bottom-40"
        right="right-6"
        scale="scale-[1]"
        fontSize="text-[40px]"
      />

      {/* Fingerprint - Right side, much smaller */}
      <div className="absolute right-6 top-1/3 z-10 max-h-[40vh] overflow-visible scale-[0.65]">
        <InteractiveFingie />
      </div>

      {/* Content - Left side */}
      <div className="pr-24">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs font-microextend">©</span>
            <span className="text-xs font-microextend font-bold">VITTORIO COVA STUDIO</span>
            <span className="text-xs font-microextend ml-auto">Est. 2025</span>
          </div>
          
          {/* Description */}
          <p className="text-xs mb-3 leading-tight font-electrolize">
            A multi-faceted creative firm founded by Vittorio Cova in 2025.
          </p>
          
          {/* Roles List */}
          <ul className="space-y-0.5 text-xs font-electrolize">
            <li>- Architect</li>
            <li>- Film director</li>
            <li>- Designer</li>
            <li>- Artist</li>
          </ul>
        </div>

        {/* Philosophical Thoughts Section */}
        <div className="mb-4">
          <h2 className="text-xs mb-2 text-[#fef4dc]">
            Quick thoughts I want to <span className="text-[#fbe147]">share:</span>
          </h2>
          <div className="space-y-2 text-[0.65rem] leading-tight font-electrolize">
            <p>
              The greatest moment in human history was not when man walked the Moon, but when <span className="text-[#fbe147] font-bold">God</span> walked the Earth.
            </p>
            <p>
              Tell yourself that pain is a reminder that you live, discomfort is <span className="text-[#fbe147] font-bold">growth</span>, and a privilege.
            </p>
            <p>
              If you have no <span className="text-[#fbe147] font-bold">ideas</span>, there is no project. If you have many ideas, there is still no project.
            </p>
            <p>
              True <span className="text-[#fbe147] font-bold">passion</span> glues together teamwork. Genuine connections are the oxygen that catalyze success.
            </p>
            <p>
              Silence is a <span className="text-[#fbe147] font-bold">beautiful</span> thing.
            </p>
            <p>
              <span className="text-[#fbe147] font-bold">Nature</span> is Mother, it will serve as a <span className="text-[#fbe147] font-bold">sanctuary</span>, offering both mental clarity and a wellspring of inspiration.
            </p>
            <p>
              Let <span className="text-[#fbe147] font-bold">gratitude</span> nourish your passions. <span className="text-[#fbe147] font-bold">Live</span> the world, don&apos;t let it live you.
            </p>
            <p>
              Even if it&apos;s hard, be the <span className="text-[#fbe147] font-bold">smile</span> that someone may need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
