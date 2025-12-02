"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
}

const GRID_COLUMNS = 13;
const GRID_ROWS = 7;

const SCROLL_GRID_BOUNDS = {
  top: "13%",
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

const ICON_SIZE = 150; // Much smaller icons for art page

function ArtDesktop() {
  const [projects, setProjects] = useState<ArtProject[]>([]);
  const [currentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const projectRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const papyrusRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousHtmlHeight = html.style.height;
    const previousHtmlTouchAction = html.style.touchAction;

    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousBodyHeight = body.style.height;
    const previousBodyTouchAction = body.style.touchAction;

    html.style.setProperty("overflow", "hidden", "important");
    html.style.setProperty("overscrollBehavior", "contain", "important");
    html.style.setProperty("height", "100%", "important");
    html.style.setProperty("touch-action", "pan-x", "important");

    body.style.setProperty("overflow", "hidden", "important");
    body.style.setProperty("overscrollBehavior", "contain", "important");
    body.style.setProperty("height", "100%", "important");
    body.style.setProperty("touch-action", "pan-x", "important");

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

    window.addEventListener("wheel", preventVerticalWheel, { passive: false });
    window.addEventListener("scroll", lockScrollPosition, { passive: true });

    window.scrollTo(0, 0);

    return () => {
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
  }, []);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/art');
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Get projects for current page
  const currentPageProjects = projects
    .filter((project) => (project.page || 1) === currentPage)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  useEffect(() => {
    const element = scrollVisualRef.current;
    const scroller = papyrusRef.current;

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
    <div className="fixed inset-0 bg-[#895a59] overflow-hidden">
      {/* Papyrus Container */}
      <div 
        ref={papyrusRef}
        className="film-strip-container absolute top-[48.3%] left-0 transform -translate-y-1/2 w-screen h-[700px] overflow-x-scroll overflow-y-hidden scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-x'
        }}
      >
        {/* Papyrus Scroll */}
          <div className="relative w-full h-full flex items-center">
          <div className="relative flex-shrink-0">
            <div ref={scrollVisualRef} className="pointer-events-none">
              <img 
                src="/assets/papyrus.svg" 
                alt="Papyrus Scroll" 
                className="h-[500px] w-auto object-contain"
                style={{ transform: 'scaleY(1.8)' }}
              />
            </div>
            
            {/* Art Projects positioned inside the papyrus based on their position data */}
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
                        className="group relative bg-transparent p-0 border-0"
                        style={{ width: ICON_SIZE }}
                        ref={(element) => {
                          projectRefs.current[project.id] = element;
                        }}
                        onClick={() => {
                          setSelectedProjectId(project.id);
                        }}
                        onMouseEnter={() => setHoveredProjectId(project.id)}
                        onFocus={() => setHoveredProjectId(project.id)}
                        onMouseLeave={() => setHoveredProjectId((current) => (current === project.id ? null : current))}
                        onBlur={() => setHoveredProjectId((current) => (current === project.id ? null : current))}
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
          
          <img 
            src="/assets/papyrus.svg" 
            alt="Papyrus Scroll mirrored" 
            className="h-[500px] w-auto object-contain flex-shrink-0"
            style={{ transform: 'scaleY(1.8) scaleX(-1)' }}
          />
        </div>
      </div>

      {/* Expanded Project View */}
      {selectedProjectId && (
        <ArtProjectExpandedView
          projectId={selectedProjectId}
          onClose={() => {
            setSelectedProjectId(null);
            window.dispatchEvent(new CustomEvent('art-expanded-close'));
          }}
        />
      )}
    </div>
    </>
  );
}

export default function Art() {
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
    return <ArtDesktop />;
  }

  return isMobile ? <div>Mobile view coming soon</div> : <ArtDesktop />;
}
