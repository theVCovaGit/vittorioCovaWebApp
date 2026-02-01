"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import Header from "@/components/header";
import HeaderMobile from "@/components/headerMobile";

export default function HeaderWrapper() {
  const isMobile = useIsMobile();
  
  // Render mobile version on mobile devices
  if (isMobile) {
    return <HeaderMobile />;
  }
  
  // Render desktop version on desktop – wrapper ensures header stays above full-page overlays
  return (
    <div className="relative z-[10003]">
      <Header />
    </div>
  );
}

