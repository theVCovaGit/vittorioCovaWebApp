"use client";

import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import NewsLabel from "@/components/newsLabel";
import NewsMobile from "@/components/newsMobile";
import InteractiveMosaics from "@/components/interactiveMosaics";

type NewsItem = {
  id: number;
  date: string;
  title: string;
  description?: string;
  sortOrder?: number;
};

const labelStyles = {
  bottom: "bottom-[8vh] sm:bottom-[10vh] md:bottom-[27vh]",
  right: "right-[8vw] sm:right-[12vw] md:right-[17.18vw]",
  scale: "scale-[0.5] sm:scale-[0.7] md:scale-[0.55]",
  fontSize: "text-[64px] sm:text-[84px] md:text-[90px]",
};

export default function News() {
  const isMobile = useIsMobile();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Mobile version
  if (isMobile) {
    return <NewsMobile />;
  }

  // Desktop version
  return (
    <main className="relative min-h-screen bg-[#fff3df] text-[#a08e80] font-blurlight overflow-hidden">
      <div
        className="absolute"
        style={{
          left: "var(--barcode-left, 0)",
          bottom: "calc(var(--barcode-bottom-offset, 80px) - 1rem)",
        }}
      >
        <NewsLabel
          bottom="bottom-0"
          left="left-0"
          scale={labelStyles.scale}
          fontSize={labelStyles.fontSize}
          transformOrigin="top left"
        />
      </div>

      <div className="absolute right-[4vw] top-[55%] transform -translate-y-1/2 z-[1002] max-h-[80vh] overflow-visible">
        <InteractiveMosaics />
      </div>

      {/* News Timeline - fixed-height area, only 4 items visible; scroll only inside this area */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-[10000] left-1/2 -translate-x-[36rem] translate-y-6 sm:-translate-x-[26rem] sm:translate-y-6 md:-translate-x-[36rem] md:translate-y-6 overflow-hidden pt-28"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="flex flex-col items-center space-y-5 max-w-lg px-4 overflow-y-auto min-h-0 w-full"
          style={{
            maxHeight: "calc(4 * 8rem + 3 * 1.25rem)",
            pointerEvents: "auto",
          }}
        >
          {loading && (
            <p className="text-[#a08e80] font-blurlight text-sm py-4">Loading…</p>
          )}
          {error && (
            <p className="text-[#a08e80] font-blurlight text-sm py-4">{error}</p>
          )}
          {!loading && !error && items.length === 0 && (
            <p className="text-[#a08e80] font-blurlight text-sm py-4">No news yet.</p>
          )}
          {!loading &&
            !error &&
            items.length > 0 &&
            items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center space-y-1.5 text-left w-full shrink-0 py-2"
                style={{ minHeight: "8rem" }}
              >
                <div className="text-[#a08e80] font-blurlight text-xs font-bold relative z-[10001]">
                  {item.date}
                </div>
                <div className="text-[#a08e80] font-blurlight text-base font-bold relative z-[10001]">
                  {item.title}
                </div>
                {item.description && (
                  <div className="text-[#a08e80] font-blurlight text-[10px] font-normal leading-relaxed relative z-[10000]">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
