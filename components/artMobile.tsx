"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import ArtProjectExpandedView from "@/components/artProjectExpandedView";

interface ArtProject {
  id: number;
  type: "art";
  title: string;
  country: string;
  city: string;
  discipline: string;
  collection: string;
  year?: string;
  images: string[];
  icon?: string;
  position?: number;
  page?: number;
  forSale?: boolean;
  description?: string;
  price?: string;
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

const MOBILE_ICON_SIZE = 150; // Smaller icons for art
const MOBILE_SCROLL_HEIGHT = 380;
const MOBILE_SCROLL_WIDTH = 1080;
const MOBILE_HEADER_HEIGHT = 142;
const MOBILE_FOOTER_HEIGHT = 210;
const SCROLL_SCALE_Y = 1.35;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const TOP_TAPES = [
  { src: "/assets/tape1.svg", leftRatio: 0.05, rotate: 2 },
  { src: "/assets/tape6.svg", leftRatio: 0.15, rotate: -4 },
  { src: "/assets/tape2.svg", leftRatio: 0.25, rotate: -5 },
  { src: "/assets/tape3.svg", leftRatio: 0.45, rotate: 4 },
  { src: "/assets/tape4.svg", leftRatio: 0.65, rotate: -2 },
  { src: "/assets/tape5.svg", leftRatio: 0.85, rotate: 3 },
];

const BOTTOM_TAPES = [
  { src: "/assets/tape7.svg", leftRatio: 0.05, rotate: 2 },
  { src: "/assets/tape8.svg", leftRatio: 0.25, rotate: -5 },
  { src: "/assets/tape9.svg", leftRatio: 0.45, rotate: 4 },
  { src: "/assets/tape10.svg", leftRatio: 0.65, rotate: -2 },
  { src: "/assets/tape11.svg", leftRatio: 0.85, rotate: 3 },
];

export default function ArtMobile() {
  const [projects, setProjects] = useState<ArtProject[]>([]);
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
        const response = await fetch("/api/art");
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
      <div className="fixed inset-0 bg-[#895a59] overflow-hidden">
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
              style={{ width: MOBILE_SCROLL_WIDTH, height: MOBILE_SCROLL_HEIGHT }}
            >
              <div
                ref={scrollVisualRef}
                className="pointer-events-none absolute inset-0 origin-left"
                style={{ transform: `scaleY(${SCROLL_SCALE_Y})` }}
              >
                <img
                  src="/assets/papyrus.svg"
                  alt="Art Papyrus Scroll"
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
                      {project.icon && (
                        <button
                          type="button"
                          className="group relative bg-transparent p-0"
                          style={{ width: MOBILE_ICON_SIZE }}
                          ref={(element) => {
                            projectRefs.current[project.id] = element;
                          }}
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            window.dispatchEvent(new CustomEvent("art-expanded-open"));
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
                          <img
                            src={project.icon}
                            alt={project.title}
                            className={`h-auto w-full object-contain transition-transform duration-200 ${
                              hoveredProjectId === project.id ? "scale-105" : ""
                            }`}
                          />
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
        <ArtProjectExpandedView
          projectId={selectedProjectId}
          onClose={() => {
            setSelectedProjectId(null);
            window.dispatchEvent(new CustomEvent("art-expanded-close"));
          }}
        />
      )}
      </div>
      {/* Only show tapes when no project is expanded */}
      {!selectedProjectId && <TapesOverlay metrics={scrollMetrics} />}
    </>
  );
}


function TapesOverlay({ metrics }: { metrics: { rect: DOMRect; scrollLeft: number } | null }) {
  const pathname = usePathname();
  const [isIntroShowing, setIsIntroShowing] = useState(false);
  
  // Check if intro animation is showing (hooks must be called unconditionally)
  useEffect(() => {
    if (typeof document === "undefined") return;
    
    const checkIntro = () => {
      const introElement = document.querySelector('[data-intro-animation="true"]');
      setIsIntroShowing(!!introElement);
    };

    checkIntro();
    const interval = setInterval(checkIntro, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, []);

  // Only render if we're on the art page
  if (pathname !== "/art" || !metrics || typeof document === "undefined") {
    return null;
  }

  // Don't render if intro animation is showing
  if (isIntroShowing) {
    return null;
  }

  const { rect, scrollLeft } = metrics;
  
  // Only show tapes if the scroll element is actually visible and has valid dimensions
  // Check if rect has valid dimensions and is within viewport
  if (
    rect.width === 0 || 
    rect.height === 0 || 
    rect.top < -rect.height || 
    rect.top > window.innerHeight ||
    rect.left < -rect.width ||
    rect.left > window.innerWidth
  ) {
    return null;
  }
  
  const tapeWidth = clamp(rect.width * 0.028, 45, 85);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[2147483000]">
      {TOP_TAPES.map((tape) => {
        const left = rect.left + scrollLeft + rect.width * tape.leftRatio;

        return (
          <img
            key={`overlay-top-${tape.src}`}
            src={tape.src}
            alt="Tape"
            style={{
              position: "absolute",
              width: `${tapeWidth}px`,
              left: `${left}px`,
              top: rect.top,
              transform: `translate(-50%, -40%) rotate(${tape.rotate}deg)`, // Moved lower on mobile (was -65%)
            }}
          />
        );
      })}

      {BOTTOM_TAPES.map((tape) => {
        const left = rect.left + scrollLeft + rect.width * tape.leftRatio;

        return (
          <img
            key={`overlay-bottom-${tape.src}`}
            src={tape.src}
            alt="Tape"
            style={{
              position: "absolute",
              width: `${tapeWidth}px`,
              left: `${left}px`,
              top: rect.bottom,
              transform: `translate(-50%, -60%) rotate(${tape.rotate}deg)`, // Moved higher on mobile (was -38%)
            }}
          />
        );
      })}
    </div>,
    document.body
  );
}

