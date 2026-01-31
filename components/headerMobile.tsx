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
      className="fixed top-0 left-0 w-full z-50 bg-[#554943] pl-[3.875rem] flex justify-start items-center touch-none"
      style={{
        touchAction: "none",
        height: "var(--mobile-header-height)",
        minHeight: "var(--mobile-header-height)",
      }}
    >
      <div className="flex flex-col items-start justify-start leading-none -space-y-3">
        <Link href="/" className="flex flex-col items-start justify-start no-underline -space-y-3 leading-none">
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
            className="font-blurlight text-xl font-bold uppercase tracking-wide block cursor-pointer hover:opacity-90 transition-opacity bg-transparent border-0 p-0 text-left"
            style={{ color: "#fff3df" }}
            onClick={() => {
              if (pathname === "/art") {
                window.dispatchEvent(new CustomEvent("art-expanded-close"));
              } else if (pathname === "/architecture") {
                window.dispatchEvent(new CustomEvent("architecture-expanded-close"));
              }
              // Return to main art/architecture section (film has no expanded view)
            }}
          >
            {sectionLabel}
          </button>
        )}
      </div>
    </header>
  );
}

