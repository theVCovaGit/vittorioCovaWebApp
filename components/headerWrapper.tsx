"use client";

import { useShowMobileLayout } from "@/hooks/useMediaQuery";
import Header from "@/components/header";
import HeaderMobile from "@/components/headerMobile";

export default function HeaderWrapper() {
  const showMobileLayout = useShowMobileLayout();

  // Mobile layout for viewport ≤1024px (phones + all iPads) so all iPads look like iPad Mini
  if (showMobileLayout) {
    return <HeaderMobile />;
  }

  return (
    <div className="relative z-[10003]">
      <Header />
    </div>
  );
}

