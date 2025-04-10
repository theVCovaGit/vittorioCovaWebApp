"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Render nothing until hydration is complete.

  return (
<footer className="relative w-full h-[100px] bg-[#5c4b4a] font-minecraft">

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h3 className="text-sm font-semibold md:text-lg">Contacto</h3>
          <p className="text-xs md:text-sm">Teléfono: +52 (placeholder)</p>
          <p className="text-xs md:text-sm">Correo: correo@placeholder.com</p>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-px w-full bg-gray-700 md:hidden"></div>

        {/* Seal and Admin Link */}
        <div className="text-center mt-2 md:mt-0">
 {/*   
  <span className="ml-2">
    <img src="/images/icon.png" alt="JRF Technologies" className="h-4 md:h-5" />
  </span>
*/}
          <Link
            href="/admin"
            className="text-xs md:text-sm text-blue-400 hover:text-blue-300 mt-1 block"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
