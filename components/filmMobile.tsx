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
              {/* Grid: col1 = poster (alignment flag), col2 = WATCH FREE; row2 = film details spanning full width */}
              <div
                className="mt-[3vh] flex-1 min-h-0 grid gap-x-4 gap-y-2 overflow-hidden"
                style={{
                  gridTemplateColumns: "minmax(0, min(58%, 200px)) 1fr",
                  gridTemplateRows: "auto 1fr",
                  alignItems: "start",
                }}
              >
                {/* Col 1: Poster */}
                <div className="flex justify-start overflow-hidden">
                  {film.icon ? (
                    <img
                      src={film.icon}
                      alt={film.title}
                      className="max-h-[26vh] w-auto h-auto object-contain object-left"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-[#e8e0d5] rounded flex items-center justify-center font-blurlight text-[#4A413C]/50 text-xs">
                      No poster
                    </div>
                  )}
                </div>

                {/* Col 2: WATCH FREE */}
                <div className="flex flex-col justify-center font-blurlight font-bold text-[#4A413C] text-sm uppercase tracking-wide leading-tight">
                  <span>WATCH</span>
                  <span>FREE</span>
                </div>

                {/* Row 2: Year, Title, Registration, Synopsis, Length - spans both cols, first letter aligned with poster left */}
                <div
                  className="flex flex-col gap-0.5 text-left min-h-0 overflow-y-auto col-span-2"
                  style={{ gridColumn: "1 / -1" }}
                >
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
                  <p className="font-electrolize text-[#4A413C] text-[10px] leading-relaxed mt-0.5">
                    {film.synapsis}
                  </p>
                )}
                {film.length && (
                  <p className="font-electrolize text-[#4A413C] text-[10px] leading-tight mt-0.5">
                    {film.length}
                  </p>
                )}
                </div>
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
