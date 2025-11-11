"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  top: "11%",
  left: "7%",
  width: "86%",
  height: "76%",
};

const MOBILE_ICON_SIZE = 220;
const MOBILE_SCROLL_HEIGHT = 420;
const MOBILE_SCROLL_WIDTH = 1080;
const MOBILE_SCROLL_MULTIPLIER = 2;
const MOBILE_HEADER_HEIGHT = 142;
const MOBILE_FOOTER_HEIGHT = 210;
const SCROLL_SCALE_Y = 1.2;

const TOP_TAPES = [
  { src: "/assets/tape1.svg", leftRatio: 0.05, rotate: 2 },
  { src: "/assets/tape6.svg", leftRatio: 0.18, rotate: -4 },
  { src: "/assets/tape2.svg", leftRatio: 0.32, rotate: -5 },
  { src: "/assets/tape3.svg", leftRatio: 0.5, rotate: 4 },
  { src: "/assets/tape4.svg", leftRatio: 0.68, rotate: -2 },
  { src: "/assets/tape5.svg", leftRatio: 0.82, rotate: 3 },
];

const BOTTOM_TAPES = [
  { src: "/assets/tape7.svg", leftRatio: 0.1, rotate: 2 },
  { src: "/assets/tape8.svg", leftRatio: 0.26, rotate: -5 },
  { src: "/assets/tape9.svg", leftRatio: 0.44, rotate: 4 },
  { src: "/assets/tape10.svg", leftRatio: 0.6, rotate: -2 },
  { src: "/assets/tape11.svg", leftRatio: 0.78, rotate: 3 },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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
  const filmStripRef = useRef<HTMLDivElement | null>(null);
  const [filmStripBounds, setFilmStripBounds] = useState<DOMRect | null>(null);

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

  useEffect(() => {
    const element = filmStripRef.current;
    const scroller = stripRef.current;

    if (!element) {
      return;
    }

    const updateBounds = () => {
      setFilmStripBounds(element.getBoundingClientRect());
    };

    updateBounds();

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateBounds) : null;
    resizeObserver?.observe(element);

    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds, true);
    scroller?.addEventListener("scroll", updateBounds);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds, true);
      scroller?.removeEventListener("scroll", updateBounds);
    };
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
                <div
                  ref={filmStripRef}
                  className="pointer-events-none absolute inset-0 flex origin-left"
                  style={{
                    transform: `scaleY(${SCROLL_SCALE_Y})`,
                  }}
                >
                  <img
                    src="/assets/film.svg"
                    alt="Film strip"
                    className="h-full w-auto object-contain object-left"
                  />
                  <img
                    src="/assets/film.svg"
                    alt="Film strip extended"
                    className="h-full w-auto object-contain object-left"
                  />
                </div>

                <div
                  className="absolute"
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
                              className={`h-auto w-full object-cover rounded-md transition-transform duration-200 ${
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
      <TapesOverlay rect={filmStripBounds} />
    </>
  );
}

function TapesOverlay({ rect }: { rect: DOMRect | null }) {
  if (!rect || typeof document === "undefined") {
    return null;
  }

  const tapeWidth = clamp(rect.width * 0.075, 44, 96);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[2147483000]">
      {TOP_TAPES.map((tape) => {
        const left = rect.left + rect.width * tape.leftRatio;

        return (
          <img
            key={`film-mobile-top-${tape.src}-${tape.leftRatio}`}
            src={tape.src}
            alt="Tape"
            style={{
              position: "absolute",
              width: `${tapeWidth}px`,
              left: `${left}px`,
              top: rect.top,
              transform: `translate(-50%, -65%) rotate(${tape.rotate}deg)`,
            }}
          />
        );
      })}

      {BOTTOM_TAPES.map((tape) => {
        const left = rect.left + rect.width * tape.leftRatio;

        return (
          <img
            key={`film-mobile-bottom-${tape.src}-${tape.leftRatio}`}
            src={tape.src}
            alt="Tape"
            style={{
              position: "absolute",
              width: `${tapeWidth}px`,
              left: `${left}px`,
              top: rect.bottom,
              transform: `translate(-50%, 65%) rotate(${tape.rotate}deg)`,
            }}
          />
        );
      })}
    </div>,
    document.body
  );
}

