"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function HeaderMobile() {
  const pathname = usePathname();
  
  // Hide header on home page (hero has its own)
  if (pathname === "/") {
    return null;
  }

  // Match hero look: same color (#fec776), same three lines, same typography, same top spacing (pt-6)
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#554943] pt-6 pb-6 pl-[3.875rem] flex justify-start items-start">
      <Link href="/" className="flex flex-col items-start justify-start no-underline leading-none -space-y-3">
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
    </header>
  );
}

