"use client";

import React, { useEffect, useState } from "react";
import NewsLabel from "@/components/newsLabel";

type NewsItem = {
  id: number;
  date: string;
  title: string;
  description?: string;
  sortOrder?: number;
};

export default function NewsMobile() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, []);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        setItems(data.items ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load news");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-[#fff3df] text-[#a08e80] font-blurlight px-3 py-4 pb-20 pt-20">
      {/* News Label - Right side, rotated - aligned with barcode bottom */}
      <div
        style={{
          position: "fixed",
          left: "calc(var(--barcode-right, 100vw) + 4.2rem)",
          bottom: "var(--barcode-bottom-offset, 80px)",
          zIndex: 40,
        }}
      >
        <NewsLabel
          bottom="bottom-0"
          right="left-0"
          scale="scale-[1]"
          fontSize="text-[60px] sm:text-[70px] md:text-[80px]"
        />
      </div>

      {/* Monoliths - right above NEWS label, same treatment as fingerprint on About / hand on Contact */}
      <div
        className="fixed z-[1010] pointer-events-none flex justify-center"
        style={{
          left: "var(--barcode-right, 100vw)",
          bottom: "var(--barcode-bottom-offset, 80px)",
          width: "80px",
          transform: "translateY(calc(-100% - 6rem))",
        }}
      >
        <img
          src="/assets/monoliths.svg"
          alt=""
          className="h-auto max-h-[14vh] w-auto object-contain"
          style={{ width: "min(44px, 12vw)" }}
        />
      </div>

      {/* News area only: fixed height between header and footer, scroll inside this area only (~4 items visible) */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center w-full px-4 pt-12 overflow-hidden"
        style={{
          top: "var(--mobile-header-height)",
          bottom: "21vh",
          height: "calc(100vh - var(--mobile-header-height) - 21vh)",
        }}
      >
        {loading && (
          <p className="text-[#a08e80] text-sm font-blurlight py-8 text-center w-full shrink-0">Loading…</p>
        )}
        {error && (
          <p className="text-[#a08e80] text-sm font-blurlight py-8 text-center w-full shrink-0">{error}</p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-[#a08e80] text-sm font-blurlight py-8 text-center w-full shrink-0">No news yet.</p>
        )}
        {!loading && !error && items.length > 0 && (
          <div
            className="flex flex-col items-center w-full max-w-lg mx-auto text-center overflow-y-auto min-h-0 flex-1 pb-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center w-full relative z-10 text-center shrink-0 py-4 px-2"
                style={{
                  // Each item = exactly 1/4 of viewport so only 4 visible; 5th and below require scroll
                  height: "calc((100vh - var(--mobile-header-height) - 21vh - 3rem) / 4)",
                }}
              >
                <div className="text-[#a08e80] font-blurlight text-sm font-semibold mb-1 w-full text-center">
                  {item.date}
                </div>
                <div className="text-[#a08e80] font-microextend text-lg font-bold mb-1.5 w-full text-center">
                  {item.title}
                </div>
                {item.description && (
                  <div className="text-[#a08e80] font-blurlight text-xs font-normal leading-relaxed max-w-md mx-auto text-center line-clamp-4">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
