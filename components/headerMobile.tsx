"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function HeaderMobile() {
  const pathname = usePathname();

  const sectionLabel =
    pathname === "/art" ? "ART" :
    pathname === "/film" ? "FILM" :
    pathname === "/architecture" ? "ARCHITECTURE" : null;

  // Hide header on home page (hero has its own)
  if (pathname === "/") {
    return null;
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-50 bg-[#554943] px-6 flex justify-between items-end touch-none"
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
        <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
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

