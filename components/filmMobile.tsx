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
              className="w-full flex-shrink-0 px-4 pt-4 pb-4 flex flex-col overflow-hidden"
              style={{
                height: "100vh",
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
              }}
            >
              {/* Top: Poster + WATCH FREE */}
              <div className="flex flex-row items-stretch gap-2 flex-shrink-0 mt-[8vh]">
                <div className="flex-shrink-0 w-[62%] max-w-[240px] flex items-center justify-center min-h-0">
                  {film.icon ? (
                    <img
                      src={film.icon}
                      alt={film.title}
                      className="w-full h-auto object-contain max-h-[38vh]"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-[#e8e0d5] rounded flex items-center justify-center font-blurlight text-[#4A413C]/50 text-sm">
                      No poster
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center font-blurlight font-bold text-[#4A413C] text-base uppercase tracking-wide leading-tight ml-12">
                  <span>WATCH</span>
                  <span>FREE</span>
                </div>
              </div>

              {/* Middle: Year, Title, Registration/Length, Synapsis, More */}
              <div className="mt-3 flex flex-col gap-0.5 text-left flex-shrink-0 min-h-0 overflow-hidden">
                {film.year && (
                  <p className="font-blurlight text-[#4A413C] text-xs">{film.year}</p>
                )}
                <h2 className="font-blurlight font-bold text-[#4A413C] text-lg uppercase tracking-wide leading-tight">
                  {film.title}
                </h2>
                {(film.registration || film.length) && (
                  <p className="font-blurlight text-[#4A413C] text-xs">
                    {[film.registration, film.length].filter(Boolean).join(" · ")}
                  </p>
                )}
                {film.synapsis && (
                  <p className="font-blurlight text-[#4A413C] text-xs leading-relaxed mt-1 line-clamp-2">
                    {film.synapsis}
                  </p>
                )}
                <button
                  type="button"
                  className="font-blurlight text-[#4A413C] text-xs underline mt-0.5 w-fit bg-transparent border-0 p-0 cursor-pointer text-left"
                  aria-label="More"
                >
                  More
                </button>
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
