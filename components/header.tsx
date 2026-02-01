"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const CREATIVE_SECTIONS = ["/architecture", "/art", "/film"];

export default function Header() {
  const pathname = usePathname();
  const vittorioRef = useRef<HTMLSpanElement | null>(null);

  // For /architecture (desktop only): measure "V" in VITTORIO for overlay alignment
  useEffect(() => {
    const isArchitecture = pathname === "/architecture" || pathname.startsWith("/architecture/");
    if (!isArchitecture) return;
    const el = vittorioRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      document.documentElement.style.setProperty("--vittorio-v-left", `${rect.left}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      document.documentElement.style.removeProperty("--vittorio-v-left");
    };
  }, [pathname]);

  // Hide header on home page
  if (pathname === "/") {
    return null;
  }

  const noLine = CREATIVE_SECTIONS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isCreative = noLine;
  const titleSize = isCreative ? "text-3xl" : "text-xl";

  return (
    <header className="fixed top-0 left-0 w-full z-[10002] !z-[10002] bg-[#554943] h-20 flex items-center px-8 pointer-events-auto">
      <Link href="/" className="flex items-center no-underline cursor-pointer relative z-[10003] !z-[10003] pointer-events-auto ml-12 sm:ml-8 md:ml-4 lg:ml-0">
        {/* Invisible spacer to shift text right */}
        <span className={`text-transparent font-blurlight font-bold uppercase tracking-wide pointer-events-none select-none opacity-0 ${titleSize}`}>
          VITTORIO 
        </span>
        <span ref={vittorioRef} className={`text-[#fec776] font-blurlight font-bold uppercase tracking-wide relative z-[10003] !z-[10003] pointer-events-auto ${titleSize}`}>
          VITTORIO COVA
        </span>
        {noLine ? (
          <span className={`text-[#fec776] font-blurlight font-bold uppercase tracking-wide ml-2 relative z-[10003] !z-[10003] pointer-events-auto ${titleSize}`}>
            STUDIO
          </span>
        ) : (
          <>
            <span className="text-[#fec776] font-blurlight text-xl font-bold uppercase tracking-wide mx-2 relative z-[10003] !z-[10003] pointer-events-auto">
              <svg width="80" height="4" viewBox="0 0 80 4" className="inline-block">
                <rect x="0" y="0" width="80" height="2" fill="#fec776"/>
              </svg>
            </span>
            <span className="text-[#fec776] font-blurlight text-xl font-bold uppercase tracking-wide relative z-[10003] !z-[10003] pointer-events-auto">
              STUDIO
            </span>
          </>
        )}
      </Link>
    </header>
  );
}
