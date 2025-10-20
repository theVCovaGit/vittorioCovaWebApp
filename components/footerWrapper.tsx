"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import Footer from "@/components/footer";
import FooterMobile from "@/components/footerMobile";

export default function FooterWrapper() {
  const isMobile = useIsMobile();
  
  // Render mobile version on mobile devices
  if (isMobile) {
    return <FooterMobile />;
  }
  
  // Render desktop version on desktop
  return <Footer />;
}

