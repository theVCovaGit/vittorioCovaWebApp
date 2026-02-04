"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import ArchitectureMobile from "@/components/architectureMobile";
import ArchitectureProjectExpandedView from "@/components/architectureProjectExpandedView";
import LoadingSpinner from "@/components/loadingSpinner";

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

/** Grid matches admin "Project position": 13 columns × 7 rows, positions 1–91. Equal x and y separation. */
const GRID_COLUMNS = 13;
const GRID_ROWS = 7;

const SCROLL_GRID_BOUNDS = {
  top: "13%",
  left: "14%",
  width: "80%",
  height: "74%",
};

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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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

const ICON_SIZE = 420;

function ArchitectureDesktop() {
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const projectRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const filmStripRef = useRef<HTMLDivElement | null>(null);
  const scrollVisualRef = useRef<HTMLDivElement | null>(null);
  const [scrollMetrics, setScrollMetrics] = useState<{ rect: DOMRect; scrollLeft: number } | null>(null);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const pointerX = event.clientX;
    const pointerY = event.clientY;

    let closestId: number | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;
    let closestThreshold = 0;

    for (const [idKey, element] of Object.entries(projectRefs.current)) {
      if (!element) {
        continue;
      }

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = pointerX - centerX;
      const dy = pointerY - centerY;
      const distance = Math.hypot(dx, dy);

      const threshold = Math.min(rect.width, rect.height) * 0.35;

      if (distance < closestDistance) {
        closestDistance = distance;
        closestId = Number(idKey);
        closestThreshold = threshold;
      }
    }

    if (closestId !== null && closestDistance <= closestThreshold) {
      setHoveredProjectId((current) => (current === closestId ? current : closestId));
    } else if (hoveredProjectId !== null) {
      setHoveredProjectId(null);
    }
  }, [hoveredProjectId]);

  const handlePointerLeave = useCallback(() => {
    if (hoveredProjectId !== null) {
      setHoveredProjectId(null);
    }
  }, [hoveredProjectId]);

  /** Click: open the project whose icon center is closest to the pointer, only if within threshold (icon-defined area). */
  const handleGridClick = useCallback((clientX: number, clientY: number) => {
    let closestId: number | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;
    let closestThreshold = 0;
    const thresholdRatio = 0.45; // open only if click is within this fraction of icon size from center

    for (const [idKey, element] of Object.entries(projectRefs.current)) {
      if (!element?.isConnected) continue;
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.hypot(dx, dy);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestId = Number(idKey);
        closestThreshold = Math.min(rect.width, rect.height) * thresholdRatio;
      }
    }
    if (closestId !== null && closestDistance <= closestThreshold) {
      setSelectedProjectId(closestId);
      window.dispatchEvent(new CustomEvent("architecture-expanded-open"));
    }
  }, []);

  // Lock document scroll when expanded view is closed; remove lock when open (custom events keep deps array stable)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const applyLock = () => {
      html.style.setProperty("overflow", "hidden", "important");
      html.style.setProperty("overscrollBehavior", "contain", "important");
      html.style.setProperty("height", "100%", "important");
      html.style.setProperty("touch-action", "pan-x", "important");
      body.style.setProperty("overflow", "hidden", "important");
      body.style.setProperty("overscrollBehavior", "contain", "important");
      body.style.setProperty("height", "100%", "important");
      body.style.setProperty("touch-action", "pan-x", "important");
      window.addEventListener("wheel", preventVerticalWheel, { passive: false });
      window.addEventListener("scroll", lockScrollPosition, { passive: true });
      window.scrollTo(0, 0);
    };

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousHtmlHeight = html.style.height;
    const previousHtmlTouchAction = html.style.touchAction;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousBodyHeight = body.style.height;
    const previousBodyTouchAction = body.style.touchAction;

    const preventVerticalWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
      }
    };

    const lockScrollPosition = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    const removeLock = () => {
      window.removeEventListener("wheel", preventVerticalWheel);
      window.removeEventListener("scroll", lockScrollPosition);
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      html.style.height = previousHtmlHeight;
      html.style.touchAction = previousHtmlTouchAction;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscroll;
      body.style.height = previousBodyHeight;
      body.style.touchAction = previousBodyTouchAction;
    };

    applyLock();

    const onExpandedOpen = () => removeLock();
    const onExpandedClose = () => applyLock();

    window.addEventListener("architecture-expanded-open", onExpandedOpen);
    window.addEventListener("architecture-expanded-close", onExpandedClose);

    return () => {
      window.removeEventListener("architecture-expanded-open", onExpandedOpen);
      window.removeEventListener("architecture-expanded-close", onExpandedClose);
      removeLock();
    };
  }, []);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/architecture');
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get projects for current page
  const currentPageProjects = projects
    .filter((project) => (project.page || 1) === currentPage)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  useEffect(() => {
    const handleReturnToMain = () => setSelectedProjectId(null);
    window.addEventListener("architecture-expanded-close", handleReturnToMain);
    return () => window.removeEventListener("architecture-expanded-close", handleReturnToMain);
  }, []);

  useEffect(() => {
    const element = scrollVisualRef.current;
    const scroller = filmStripRef.current;

    if (!element) {
      return;
    }

    const updateRect = () => {
      const rect = element.getBoundingClientRect();
      const scrollLeft = scroller?.scrollLeft ?? 0;
      setScrollMetrics({ rect, scrollLeft });
    };

    updateRect();

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateRect) : null;
    resizeObserver?.observe(element);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    scroller?.addEventListener("scroll", updateRect);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
      scroller?.removeEventListener("scroll", updateRect);
    };
  }, [currentPageProjects.length]);

  return (
    <>
    <div className="fixed inset-0 bg-[#fff5e0] overflow-hidden">
      {loading && <LoadingSpinner />}
      {/* Film Strip Container */}
      <div 
        ref={filmStripRef}
        className="film-strip-container absolute top-[48.3%] left-0 transform -translate-y-1/2 w-screen h-[700px] overflow-x-scroll overflow-y-hidden scrollbar-hide pl-8 md:pl-12"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-x'
        }}
      >
        {/* Architecture Scroll with Tapes */}
          <div className="relative w-full h-full flex items-center">
          <div className="relative flex-shrink-0">
            <div ref={scrollVisualRef} className="pointer-events-none">
              {/* Paper scroll – commented out, may use later
              <img
                src="/assets/scroll.svg"
                alt="Architecture Scroll"
                className="h-[500px] w-auto object-contain"
              />
              */}
              <div className="h-[720px] w-auto min-w-[576px] aspect-[1080/421] shrink-0" aria-hidden />
            </div>
            
            {/* Architecture Projects positioned inside the scroll based on their position data */}
            <div
              className="absolute"
              style={{
                top: SCROLL_GRID_BOUNDS.top,
                left: SCROLL_GRID_BOUNDS.left,
                width: SCROLL_GRID_BOUNDS.width,
                height: SCROLL_GRID_BOUNDS.height,
              }}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              {currentPageProjects.map((project) => {
                const { left, top } = getAbsolutePlacement(project.position);

                return (
                  <div
                    key={project.id}
                    className="pointer-events-none absolute flex items-center justify-center"
                    style={{
                      left,
                      top,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {(project.icon || project.iconSecondary) && (
                        <button
                        type="button"
                        className="group relative bg-transparent p-0 border-0 pointer-events-none"
                        style={{ width: ICON_SIZE }}
                        ref={(element) => {
                          projectRefs.current[project.id] = element;
                        }}
                        aria-label={`Open ${project.title}`}
                      >
                        <img
                          src={project.icon || project.iconSecondary}
                          alt={project.title}
                          className="h-auto w-full object-contain"
                        />
                      </button>
                    )}
                  </div>
                );
              })}
              {/* Single overlay: click opens the project whose icon center is closest (within threshold) */}
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                aria-hidden
                onClick={(e) => handleGridClick(e.clientX, e.clientY)}
              />
            </div>
          </div>

          {/* Mirrored scroll – commented out, may use later
          <img
            src="/assets/scroll.svg"
            alt="Architecture Scroll mirrored"
            className="h-[500px] w-auto object-contain flex-shrink-0"
            style={{ transform: "scaleX(-1)" }}
          />
          */}
          <div className="h-[720px] w-auto min-w-[576px] aspect-[1080/421] shrink-0 flex-shrink-0" aria-hidden />
        </div>
      </div>

      {/* Expanded Project View */}
      {selectedProjectId && (
        <ArchitectureProjectExpandedView
          projectId={selectedProjectId}
          onClose={() => {
            setSelectedProjectId(null);
            window.dispatchEvent(new CustomEvent('architecture-expanded-close'));
          }}
        />
      )}
    </div>
    {/* Tapes – commented out, may use later
    {!selectedProjectId && <DesktopTapesOverlay metrics={scrollMetrics} />}
    */}
    </>
  );
}

function DesktopTapesOverlay({ metrics }: { metrics: { rect: DOMRect; scrollLeft: number } | null }) {
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

  // Only render if we're on the architecture page
  if (pathname !== "/architecture" || !metrics || typeof document === "undefined") {
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
  
  const tapeWidth = clamp(rect.width * 0.022, 35, 65);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[2147483000]">
      {TOP_TAPES.map((tape) => {
        const left = rect.left + scrollLeft + rect.width * tape.leftRatio;

        return (
          <img
            key={`desktop-top-${tape.src}`}
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
        const left = rect.left + scrollLeft + rect.width * tape.leftRatio;

        return (
          <img
            key={`desktop-bottom-${tape.src}`}
            src={tape.src}
            alt="Tape"
            style={{
              position: "absolute",
              width: `${tapeWidth}px`,
              left: `${left}px`,
              top: rect.bottom,
              transform: `translate(-50%, -30%) rotate(${tape.rotate}deg)`,
            }}
          />
        );
      })}
    </div>,
    document.body
  );
}

export default function Architecture() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  if (!hasMounted) {
    return <ArchitectureDesktop />;
  }

  return isMobile ? <ArchitectureMobile /> : <ArchitectureDesktop />;
}
