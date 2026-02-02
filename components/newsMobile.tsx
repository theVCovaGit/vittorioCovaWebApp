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
          left: "calc(var(--barcode-right, 100vw) + 3.5rem)",
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

      {/* Timeline content - centered horizontally, from DB */}
      <div className="relative flex flex-col items-center justify-center overflow-y-auto min-h-0 w-full px-4" style={{ paddingTop: "var(--mobile-header-height)", paddingBottom: "1rem" }}>
        {loading && (
          <p className="text-[#a08e80] text-sm font-blurlight py-8 text-center w-full">Loading…</p>
        )}
        {error && (
          <p className="text-[#a08e80] text-sm font-blurlight py-8 text-center w-full">{error}</p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-[#a08e80] text-sm font-blurlight py-8 text-center w-full">No news yet.</p>
        )}
        {!loading && !error && items.length > 0 && (
          <div className="flex flex-col items-center w-full max-w-lg mx-auto text-center">
            {/* Vertical dashed line - visual backbone */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 border-l border-dashed border-[#a08e80]/40"
              aria-hidden
            />
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center w-full py-4 relative z-10 text-center"
              >
                <div className="text-[#a08e80] font-blurlight text-xs font-semibold mb-1 w-full text-center">
                  {item.date}
                </div>
                <div className="text-[#a08e80] font-blurlight text-base font-bold mb-1.5 w-full text-center">
                  {item.title}
                </div>
                {item.description && (
                  <div className="text-[#a08e80] font-blurlight text-[10px] font-normal leading-relaxed max-w-md mx-auto text-center">
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
