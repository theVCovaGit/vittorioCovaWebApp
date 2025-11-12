"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";

interface FilmProject {
  id: number;
  type: "film";
  title: string;
  icon?: string;
  iconSecondary?: string;
  images: string[];
  releaseYear?: string;
  countries?: string[];
  cities?: string[];
  genre?: string;
  category?: string;
  position?: number;
  page?: number;
}

const GRID_COLUMNS = 13;
const GRID_ROWS = 7;

const ICON_GRID_BOUNDS = {
  top: "14%",
  left: "9%",
  width: "82%",
  height: "68%",
};

const MOBILE_ICON_SIZE = 220;
const MOBILE_SCROLL_HEIGHT = 360;
const MOBILE_SCROLL_WIDTH = 980;
const MOBILE_SCROLL_MULTIPLIER = 1.8;
const MOBILE_HEADER_HEIGHT = 142;
const MOBILE_FOOTER_HEIGHT = 210;
const SCROLL_SCALE_Y = 1;

const getAbsolutePlacement = (zeroBasedIndex: number) => {
  const safeIndex = Math.max(0, zeroBasedIndex);
  const column = (safeIndex % GRID_COLUMNS) + 1;
  const row = Math.floor(safeIndex / GRID_COLUMNS) + 1;

  const leftPercent = ((column - 0.5) / GRID_COLUMNS) * 100;
  const topPercent = ((row - 0.5) / GRID_ROWS) * 100;

  return {
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
  };
};

export default function FilmMobile() {
  const [projects, setProjects] = useState<FilmProject[]>([]);
  const [currentPage] = useState(1);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const projectRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const stripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/film");
        if (!response.ok) {
          throw new Error(`Unexpected status ${response.status}`);
        }
        const data = await response.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      } catch (error) {
        console.error("Error fetching film projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!stripRef.current) {
      return;
    }

    stripRef.current.scrollLeft = 0;
  }, [projects.length]);

  const currentPageProjects = useMemo(() => {
    return projects
      .filter((project) => (project.page || 1) === currentPage)
      .sort((a, b) => {
        const aPosition = a.position ?? 0;
        const bPosition = b.position ?? 0;
        if (aPosition === bPosition) {
          return a.id - b.id;
        }
        return aPosition - bPosition;
      });
  }, [projects, currentPage]);

  return (
    <>
      <div className="fixed inset-0 bg-[#2d2f38] overflow-hidden">
        <div
          className="absolute left-0 right-0 flex items-center"
          style={{
            top: MOBILE_HEADER_HEIGHT,
            bottom: MOBILE_FOOTER_HEIGHT,
          }}
        >
          <div
            ref={stripRef}
            className="film-strip-container flex h-full w-full items-center justify-start overflow-x-auto overflow-y-hidden scrollbar-hide"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
              touchAction: "pan-x",
            }}
          >
            <div className="relative flex h-full items-center">
              <div
                className="relative flex-shrink-0 overflow-visible"
                style={{
                  width: MOBILE_SCROLL_WIDTH * MOBILE_SCROLL_MULTIPLIER,
                  height: MOBILE_SCROLL_HEIGHT,
                }}
              >
                <div className="absolute inset-0 z-0 rounded-[32px] bg-[#2d2f38]" />

                <div
                  className="pointer-events-none absolute inset-0 z-20"
                  style={{
                    transform: `scaleY(${SCROLL_SCALE_Y})`,
                    backgroundImage: "url('/assets/film.svg')",
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "auto 100%",
                    backgroundPosition: "center",
                  }}
                />

                <div
                  className="absolute z-30"
                  style={{
                    top: ICON_GRID_BOUNDS.top,
                    left: ICON_GRID_BOUNDS.left,
                    width: ICON_GRID_BOUNDS.width,
                    height: ICON_GRID_BOUNDS.height,
                  }}
                >
                  {currentPageProjects.map((project, index) => {
                    const placementIndex = (project.position ?? 0) > 0 ? (project.position as number) - 1 : index;
                    const { left, top } = getAbsolutePlacement(placementIndex);

                    const hasVisual = project.icon || project.images?.[0];
                    if (!hasVisual) {
                      return null;
                    }

                    return (
                      <div
                        key={project.id}
                        className="pointer-events-auto absolute flex items-center justify-center"
                        style={{
                          left,
                          top,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <button
                          type="button"
                          className="group relative bg-transparent p-0"
                          style={{ width: MOBILE_ICON_SIZE }}
                          ref={(element) => {
                            projectRefs.current[project.id] = element;
                          }}
                          onMouseEnter={() => setHoveredProjectId(project.id)}
                          onFocus={() => setHoveredProjectId(project.id)}
                          onMouseLeave={() =>
                            setHoveredProjectId((current) => (current === project.id ? null : current))
                          }
                          onBlur={() =>
                            setHoveredProjectId((current) => (current === project.id ? null : current))
                          }
                          onTouchStart={() => setHoveredProjectId(project.id)}
                          onTouchEnd={() => setHoveredProjectId(null)}
                        >
                          {project.icon && (
                            <img
                              src={project.icon}
                              alt={project.title}
                              className={`h-auto w-full object-contain transition-transform duration-200 ${
                                hoveredProjectId === project.id ? "scale-105" : ""
                              }`}
                            />
                          )}
                          {!project.icon && project.images?.[0] && (
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className={`h-auto w-full rounded-md object-cover transition-transform duration-200 ${
                                hoveredProjectId === project.id ? "scale-105" : ""
                              }`}
                            />
                          )}
                          {project.iconSecondary && (
                            <img
                              src={project.iconSecondary}
                              alt={`${project.title} secondary`}
                              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
                                hoveredProjectId === project.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

