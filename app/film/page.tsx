"use client";

import { useEffect, useState } from "react";
import FilmMobile from "@/components/filmMobile";

function FilmDesktop() {
  return (
    <div className="min-h-screen bg-[#2d2f38] relative overflow-hidden">
      <div
        className="film-strip-container absolute top-[48.3%] left-0 transform -translate-y-1/2 w-screen h-[500px] overflow-x-scroll overflow-y-hidden scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="relative w-full h-full flex">
          <img
            src="/assets/film.svg"
            alt="Film Strip"
            className="h-full w-auto object-contain flex-shrink-0"
          />
          <img
            src="/assets/film.svg"
            alt="Film Strip"
            className="h-full w-auto object-contain flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}

export default function Film() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  if (!hasMounted) {
    return <FilmDesktop />;
  }

  return isMobile ? <FilmMobile /> : <FilmDesktop />;
}
