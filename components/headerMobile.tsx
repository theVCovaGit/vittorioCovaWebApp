"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeaderMobile() {
  const pathname = usePathname();
  const studioRef = useRef<HTMLSpanElement | null>(null);

  const sectionLabel =
    pathname === "/art" ? "ART" :
    pathname === "/film" ? "FILM" :
    pathname === "/architecture" ? "ARCHITECTURE" : null;

  useEffect(() => {
    const isSection = pathname === "/film" || pathname === "/art" || pathname === "/architecture";
    if (!isSection) return;
    const el = studioRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      document.documentElement.style.setProperty("--studio-s-left", `${rect.left}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      document.documentElement.style.removeProperty("--studio-s-left");
    };
  }, [pathname]);

  // Hide header on home page (hero has its own)
  if (pathname === "/") {
    return null;
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-50 bg-[#554943] pl-[2.125rem] pr-6 pb-0 flex justify-between items-end touch-none"
      style={{
        touchAction: "none",
        height: "var(--mobile-header-height)",
        minHeight: "var(--mobile-header-height)",
      }}
    >
      <Link href="/" className="flex flex-col items-start justify-center no-underline leading-none -space-y-3 shrink-0">
        <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
          VITTORIO
        </span>
        <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
          COVA
        </span>
        <span ref={sectionLabel ? studioRef : undefined} className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
          STUDIO©
        </span>
      </Link>
      {sectionLabel && (
        <button
          type="button"
          className="font-blurlight text-xl font-bold uppercase tracking-wide shrink-0 cursor-pointer hover:opacity-90 transition-opacity bg-transparent border-0 p-0"
          style={{ color: "#fff3df" }}
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

