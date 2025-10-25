"use client";

import React from "react";

export default function AboutMobile() {
  return (
    <div className="min-h-screen bg-[#302120] text-[#fef4dc] font-basica px-6 py-8 pb-24 pt-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-microextend">©</span>
          <span className="text-lg font-microextend font-bold">VITTORIO COVA STUDIO</span>
          <span className="text-sm font-microextend ml-auto">Est. 2025</span>
        </div>
        
        {/* Description */}
        <p className="text-sm mb-6 leading-relaxed font-electrolize">
          A multi-faceted creative firm founded by Vittorio Cova in 2025.
        </p>
        
        {/* Roles List */}
        <ul className="space-y-1 text-sm font-electrolize">
          <li>- Architect</li>
          <li>- Film director</li>
          <li>- Designer</li>
          <li>- Artist</li>
        </ul>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#fef4dc] opacity-30 my-8"></div>

      {/* Philosophical Thoughts Section */}
      <div className="mb-12">
        <h2 className="text-sm font-bold mb-4 text-[#fef4dc]">
          Quick thoughts I want to <span className="text-[#fbe147]">share:</span>
        </h2>
        <div className="space-y-4 text-xs leading-relaxed font-electrolize">
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

      {/* Barcode */}
      
    </div>
  );
}
