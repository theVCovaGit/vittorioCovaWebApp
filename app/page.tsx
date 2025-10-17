"use client";

import { useState, useEffect } from "react";
import HeroAnimation from "@/components/heroAnimation";
import SignatureAnimation from "@/components/signatureAnimation";

export default function Hero() {
  const [showMainContent, setShowMainContent] = useState(false);

  // Automatically transition after signature completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMainContent(true);
    }, 7000); // adjust to match total signature animation time

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      
    </>
  );
}
