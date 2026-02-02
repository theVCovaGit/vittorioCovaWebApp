"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const CREATIVE_SECTIONS = ["/architecture", "/art", "/film"];
/** Pages with same header style as /art (VITTORIO COVA STUDIO + section label below) – desktop only */
const SAME_HEADER_STYLE_PAGES = ["/architecture", "/art", "/film", "/about", "/contact", "/news"];

export default function Header() {
  const pathname = usePathname();
  const vittorioRef = useRef<HTMLSpanElement | null>(null);

  // Section label below "VITTORIO COVA STUDIO" — only for creative sections, not for news/about/contact
  const sectionLabel =
    pathname === "/art" ? "ART" :
    pathname === "/film" ? "FILM" :
    pathname === "/architecture" ? "ARCHITECTURE" :
    null;

  // Measure "V" in VITTORIO for alignment (section label + architecture overlay)
  useEffect(() => {
    const needsVMeasurement = SAME_HEADER_STYLE_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (!needsVMeasurement) return;
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

  const noLine = SAME_HEADER_STYLE_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isCreative = noLine;
  const titleSize = isCreative ? "text-3xl" : "text-xl";

  // Fixed height = about/contact/news height; art/architecture/film use same height, section label sits lower inside it
  const headerHeight = "h-[4.5rem]";
  return (
    <header className={`fixed top-0 left-0 w-full z-[10002] !z-[10002] bg-[#554943] px-8 pt-4 pointer-events-auto flex flex-col justify-start ${headerHeight} ${sectionLabel ? "pb-1" : "pb-4"}`}>
      <Link href="/" className="flex items-center no-underline cursor-pointer relative z-[10003] !z-[10003] pointer-events-auto ml-12 sm:ml-8 md:ml-4 lg:ml-0 w-fit shrink-0">
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
      {sectionLabel && (
        <button
          type="button"
          className="font-blurlight text-xl font-bold uppercase tracking-wide bg-transparent border-0 cursor-pointer hover:opacity-90 transition-opacity p-0 -mt-2 self-start relative z-[10004] pointer-events-auto leading-tight"
          style={{
            color: "#fff3df",
            marginLeft: "calc(var(--vittorio-v-left, 2rem) - 2rem)",
          }}
          onClick={() => {
            if (pathname === "/art") {
              window.dispatchEvent(new CustomEvent("art-expanded-close"));
            } else if (pathname === "/architecture") {
              window.dispatchEvent(new CustomEvent("architecture-expanded-close"));
            }
          }}
        >
          {sectionLabel}
        </button>
      )}
    </header>
  );
}
