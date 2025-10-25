"use client";

import React from "react";

export default function AboutMobile() {
  return (
    <div className="min-h-screen bg-[#302120] text-[#fef4dc] font-basica px-6 py-8 pb-24">
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
      <div className="flex justify-center my-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 367 42"
          width="280"
          fill="none"
          className="w-full max-w-[280px] h-auto"
        >
          <path d="M5.14062 41.6719H0.328125V0.296875H5.14062V41.6719ZM9.84896 41.6719H7.44271V0.296875H9.84896V41.6719ZM16.6719 41.6719H14.2656V0.296875H16.6719V41.6719ZM28.0729 41.6719H25.6667V0.296875H28.0729V41.6719ZM39.5312 41.6719H34.776V0.296875H39.5312V41.6719ZM48.4844 41.6719H46.1094V0.296875H48.4844V41.6719ZM55.4792 41.6719H50.9948V0.296875H55.4792V41.6719ZM64.5677 41.6719H62.3281V0.296875H64.5677V41.6719ZM78.3438 41.6719H76.1042V0.296875H78.3438V41.6719ZM94.4167 41.6719H89.9792V0.296875H94.4167V41.6719ZM112.625 41.6719H105.995V0.296875H112.625V41.6719ZM83.0104 41.6719H80.7708V0.296875H83.0104V41.6719ZM103.714 41.6719H101.474V0.296875H103.714V41.6719ZM119.641 41.6719H115.057V0.296875H119.641V41.6719ZM140.359 41.6719H135.776V0.296875H140.359V41.6719ZM156.391 41.6719H151.807V0.296875H156.391V41.6719ZM163.177 41.6719H158.589V0.296875H163.177V41.6719ZM172.547 41.6719H167.964V0.296875H172.547V41.6719ZM181.427 41.6719H176.844V0.296875H181.427V41.6719ZM206.583 41.6719H202V0.296875H206.583V41.6719ZM241.052 41.6719H236.464V0.296875H241.052V41.6719ZM257.151 41.6719H252.568V0.296875H257.151V41.6719ZM264.234 41.6719H259.646V0.296875H264.234V41.6719ZM273.219 41.6719H268.635V0.296875H273.219V41.6719ZM284.708 41.6719H277.781V0.296875H284.708V41.6719ZM341.969 41.6719H335.042V0.296875H341.969V41.6719ZM296.089 41.6719H291.5V0.296875H296.089V41.6719ZM307.521 41.6719H302.932V0.296875H307.521V41.6719ZM332.734 41.6719H328.151V0.296875H332.734V41.6719ZM357.87 41.6719H353.286V0.296875H357.87V41.6719ZM190.599 41.6719H183.87V0.296875H190.599V41.6719ZM128.74 41.6719H126.5V0.296875H128.74V41.6719ZM144.896 41.6719H142.656V0.296875H144.896V41.6719ZM199.771 41.6719H197.531V0.296875H199.771V41.6719ZM215.927 41.6719H213.688V0.296875H215.927V41.6719ZM220.552 41.6719H218.312V0.296875H220.552V41.6719ZM229.557 41.6719H227.318V0.296875H229.557V41.6719ZM289.161 41.6719H286.922V0.296875H289.161V41.6719ZM316.604 41.6719H314.365V0.296875H316.604V41.6719ZM325.755 41.6719H323.516V0.296875H325.755V41.6719ZM346.516 41.6719H344.276V0.296875H346.516V41.6719ZM366.88 41.6719H364.641V0.296875H366.88V41.6719ZM245.63 41.6719H243.391V0.296875H245.63V41.6719ZM73.7656 41.6719H66.9948V0.296875H73.7656V41.6719Z"
            fill="#FEF4DC" 
          />
        </svg>
      </div>
    </div>
  );
}
