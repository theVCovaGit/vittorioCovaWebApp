"use client";

import { useShowMobileLayout } from "@/hooks/useMediaQuery";
import Footer from "@/components/footer";
import FooterMobile from "@/components/footerMobile";

export default function FooterWrapper() {
  const showMobileLayout = useShowMobileLayout();

  // Mobile layout for viewport ≤1024px (phones + all iPads) so all iPads look like iPad Mini
  if (showMobileLayout) {
    return <FooterMobile />;
  }

  return <Footer />;
}

