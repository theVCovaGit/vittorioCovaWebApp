"use client";

import { useEffect, useRef, useState } from "react";
import ArchitectureProjectExpandedView from "@/components/architectureProjectExpandedView";

interface ArchitectureProject {
  id: number;
  type: "architecture";
  title: string;
  country: string;
  city: string;
  category: string;
  year?: string;
  images: string[];
  icon?: string;
  iconSecondary?: string;
  position?: number;
  page?: number;
}

const GRID_COLUMNS = 13;
const GRID_ROWS = 7;

const ICON_GRID_BOUNDS = {
  top: "7%",
  left: "6%",
  width: "88%",
  height: "74%",
};

const getAbsolutePlacement = (position?: number) => {
  const safeIndex = Math.max(0, (position ?? 1) - 1);
  const column = (safeIndex % GRID_COLUMNS) + 1;
  const row = Math.floor(safeIndex / GRID_COLUMNS) + 1;

  const leftPercent = ((column - 0.5) / GRID_COLUMNS) * 100;
  const topPercent = ((row - 0.5) / GRID_ROWS) * 100;

  return {
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
  };
};

/** Scroll strip aspect ratio (width/height) for responsive scaling */
const SCROLL_ASPECT_RATIO = 1080 / 380;
/** Icon size as fraction of scroll strip height (220/380) */
const ICON_TO_STRIP_RATIO = 220 / 380;
/** Min padding in vh – scales on larger screens */
const SCROLL_PADDING_VH = 18;
/** Top: always at least header height so content stays below header; scales with vh on larger screens */
const SCROLL_TOP = `max(var(--mobile-header-height, 104px), ${SCROLL_PADDING_VH}vh)`;
/** Bottom: always at least footer height so content stays above footer; scales with vh on larger screens */
const SCROLL_BOTTOM = `max(200px, ${SCROLL_PADDING_VH}vh)`;
/** Scroll area height: viewport minus top and bottom (ensures padding on all devices) */
const SCROLL_AREA_HEIGHT = `calc(100vh - ${SCROLL_TOP} - ${SCROLL_BOTTOM})`;
const SCROLL_SCALE_Y = 1.35;

export default function ArchitectureMobile() {
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
  const [currentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const projectRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const stripRef = useRef<HTMLDivElement | null>(null);
  const scrollVisualRef = useRef<HTMLDivElement | null>(null);
  const [scrollMetrics, setScrollMetrics] = useState<{ rect: DOMRect; scrollLeft: number } | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/architecture");
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (stripRef.current) {
      stripRef.current.scrollLeft = 0;
    }
  }, [projects.length]);

  useEffect(() => {
    const element = scrollVisualRef.current;
    const scroller = stripRef.current;

    if (!element) {
      return;
    }

    const updateBounds = () => {
      const rect = element.getBoundingClientRect();
      const scrollLeft = scroller?.scrollLeft ?? 0;
      setScrollMetrics({ rect, scrollLeft });
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

  const currentPageProjects = projects
    .filter((project) => (project.page || 1) === currentPage)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <>
      <div className="fixed inset-0 bg-[#fff5e0] overflow-hidden">
      <div
        className="absolute left-0 right-0 flex items-center"
        style={{
          top: SCROLL_TOP,
          bottom: SCROLL_BOTTOM,
          ["--scroll-strip-height" as string]: SCROLL_AREA_HEIGHT,
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
                height: "100%",
                width: `calc(var(--scroll-strip-height, ${SCROLL_AREA_HEIGHT}) * ${SCROLL_ASPECT_RATIO})`,
              }}
            >
              <div
                ref={scrollVisualRef}
                className="pointer-events-none absolute inset-0 origin-left"
                style={{ transform: `scaleY(${SCROLL_SCALE_Y})` }}
              >
                <img
                  src="/assets/scroll.svg"
                  alt="Architecture Scroll"
                  className="h-full w-full object-contain object-left"
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
                {currentPageProjects.map((project) => {
                  const { left, top } = getAbsolutePlacement(project.position);

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
                      {(project.icon || project.iconSecondary) && (
                        <button
                          type="button"
                          className="group relative bg-transparent p-0"
                          style={{
                            width: `calc(var(--scroll-strip-height, ${SCROLL_AREA_HEIGHT}) * ${ICON_TO_STRIP_RATIO})`,
                          }}
                          ref={(element) => {
                            projectRefs.current[project.id] = element;
                          }}
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            window.dispatchEvent(new CustomEvent("architecture-expanded-open"));
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
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedProjectId && (
        <ArchitectureProjectExpandedView
          projectId={selectedProjectId}
          onClose={() => {
            setSelectedProjectId(null);
            window.dispatchEvent(new CustomEvent("architecture-expanded-close"));
          }}
        />
      )}
      </div>
    </>
  );
}

