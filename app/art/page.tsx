"use client";

import { useEffect, useState } from "react";
import ArtDesktopGallery from "@/components/artDesktopGallery";
import ArtMobile from "@/components/artMobile";

export default function Art() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  if (!hasMounted) {
    return <ArtDesktopGallery />;
  }

  return isMobile ? <ArtMobile /> : <ArtDesktopGallery />;
}
