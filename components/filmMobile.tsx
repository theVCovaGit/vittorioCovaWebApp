"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

interface FilmProject {
  id: number;
  type: "film";
  title: string;
  icon?: string;
  year?: string;
  registration?: string;
  synapsis?: string;
  length?: string;
  position?: number;
  page?: number;
}

export default function FilmMobile() {
  const [projects, setProjects] = useState<FilmProject[]>([]);
  const verticalScrollRef = useRef<HTMLDivElement>(null);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/film");
        if (!response.ok) throw new Error(`Unexpected status ${response.status}`);
        const data = await response.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      } catch (error) {
        console.error("Error fetching film projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const sortedFilms = [...projects].sort((a, b) => {
    const pageA = a.page ?? 1;
    const pageB = b.page ?? 1;
    if (pageA !== pageB) return pageA - pageB;
    return (a.position ?? 0) - (b.position ?? 0);
  });

  useEffect(() => {
    const el = verticalScrollRef.current;
    if (!el || sortedFilms.length === 0) return;

    const sectionHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    const snapToNearest = () => {
      const top = el.scrollTop;
      const index = Math.round(top / sectionHeight);
      const clamped = Math.max(0, Math.min(index, sortedFilms.length - 1));
      const targetTop = clamped * sectionHeight;
      if (Math.abs(el.scrollTop - targetTop) > 1) {
        el.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    };

    const scheduleSnap = () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = setTimeout(snapToNearest, 100);
    };

    el.addEventListener("scroll", scheduleSnap, { passive: true });
    el.addEventListener("scrollend", snapToNearest);
    el.addEventListener("touchend", scheduleSnap, { passive: true });

    return () => {
      el.removeEventListener("scroll", scheduleSnap);
      el.removeEventListener("scrollend", snapToNearest);
      el.removeEventListener("touchend", scheduleSnap);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [sortedFilms.length]);

  return (
    <>
      <div
        ref={verticalScrollRef}
        className="fixed left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden bg-[#FFF3DF] scrollbar-hide"
        style={{
          top: "var(--mobile-header-height, 0)",
          height: "calc(100vh - var(--mobile-header-height, 0))",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {sortedFilms.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center px-4">
            <p className="font-blurlight text-[#4A413C]">No films yet.</p>
          </div>
        ) : (
          sortedFilms.map((film) => (
            <section
              key={film.id}
              className="w-full flex-shrink-0 px-3 pt-2 pb-2 flex flex-col overflow-hidden"
              style={{
                height: "100vh",
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
              }}
            >
              {/* Top: Poster + WATCH FREE - smaller, higher */}
              <div className="flex flex-row items-stretch gap-1.5 flex-shrink-0 mt-[3vh]">
                <div className="flex-shrink-0 w-[58%] max-w-[200px] flex items-center justify-center min-h-0">
                  {film.icon ? (
                    <img
                      src={film.icon}
                      alt={film.title}
                      className="w-full h-auto object-contain max-h-[26vh]"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-[#e8e0d5] rounded flex items-center justify-center font-blurlight text-[#4A413C]/50 text-xs">
                      No poster
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center font-blurlight font-bold text-[#4A413C] text-sm uppercase tracking-wide leading-tight ml-8">
                  <span>WATCH</span>
                  <span>FREE</span>
                </div>
              </div>

              {/* Middle: Year, Title, Registration, Synopsis, Length - compact, no scroll */}
              <div className="mt-2 flex flex-col gap-0.5 text-left flex-shrink-0 min-h-0 overflow-hidden">
                {film.year && (
                  <p className="font-electrolize text-[#4A413C] text-[10px] leading-tight">{film.year}</p>
                )}
                <h2 className="font-microextend font-bold text-[#4A413C] text-sm uppercase tracking-wide leading-tight">
                  {film.title}
                </h2>
                {film.registration && (
                  <p className="font-microextend text-[#4A413C] text-[10px] leading-tight">
                    {film.registration}
                  </p>
                )}
                {film.synapsis && (
                  <p className="font-electrolize text-[#4A413C] text-[10px] leading-relaxed mt-0.5 line-clamp-4">
                    {film.synapsis}
                  </p>
                )}
                {film.length && (
                  <p className="font-electrolize text-[#4A413C] text-[10px] leading-tight mt-0.5">
                    {film.length}
                  </p>
                )}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
