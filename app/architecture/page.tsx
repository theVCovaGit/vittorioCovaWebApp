"use client";

import { useEffect, useState } from "react";
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

const ICON_SIZE = 420;

export default function Architecture() {
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
  const [currentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

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
        const response = await fetch('/api/architecture');
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

  return (
    <div className="fixed inset-0 bg-[#fff5e0] overflow-hidden">
      {/* Film Strip Container */}
      <div 
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
        {/* Architecture Scroll with Tapes */}
        <div className="relative w-full h-full flex items-center">
          <div className="relative flex-shrink-0">
            <img 
              src="/assets/scroll.svg" 
              alt="Architecture Scroll" 
              className="h-[500px] w-auto object-contain"
            />
            
            {/* Tapes positioned relative to the scroll - Above */}
            <img 
              src="/assets/tape1.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[5%] w-48 h-16 opacity-80 transform rotate-[2deg] z-[9999]"
            />
            <img 
              src="/assets/tape2.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[25%] w-48 h-16 opacity-80 transform rotate-[-5deg] z-[9999]"
            />
            <img 
              src="/assets/tape3.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[45%] w-48 h-16 opacity-80 transform rotate-[4deg] z-[9999]"
            />
            <img 
              src="/assets/tape4.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[65%] w-48 h-16 opacity-80 transform rotate-[-2deg] z-[9999]"
            />
            <img 
              src="/assets/tape5.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[85%] w-48 h-16 opacity-80 transform rotate-[3deg] z-[9999]"
            />
            <img 
              src="/assets/tape6.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[15%] w-48 h-16 opacity-80 transform rotate-[-4deg] z-[9999]"
            />
            
            {/* Tapes positioned relative to the scroll - Below */}
            <img 
              src="/assets/tape7.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[5%] w-48 h-16 opacity-80 transform rotate-[2deg] z-[9999]"
            />
            <img 
              src="/assets/tape8.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[25%] w-48 h-16 opacity-80 transform rotate-[-5deg] z-[9999]"
            />
            <img 
              src="/assets/tape9.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[45%] w-48 h-16 opacity-80 transform rotate-[4deg] z-[9999]"
            />
            <img 
              src="/assets/tape10.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[65%] w-48 h-16 opacity-80 transform rotate-[-2deg] z-[9999]"
            />
            <img 
              src="/assets/tape11.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[85%] w-48 h-16 opacity-80 transform rotate-[3deg] z-[9999]"
            />

            {/* Architecture Projects positioned inside the scroll based on their position data */}
            <div
              className="pointer-events-none absolute"
              style={{
                top: SCROLL_GRID_BOUNDS.top,
                left: SCROLL_GRID_BOUNDS.left,
                width: SCROLL_GRID_BOUNDS.width,
                height: SCROLL_GRID_BOUNDS.height,
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
                        className="group relative bg-transparent p-0 border-0"
                        style={{ width: ICON_SIZE }}
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          window.dispatchEvent(new CustomEvent("architecture-expanded-open"));
                        }}
                      >
                        {project.icon && (
                          <img
                            src={project.icon}
                            alt={project.title}
                            className="h-auto w-full object-contain transition-transform duration-200 group-hover:scale-105"
                          />
                        )}
                        {project.iconSecondary && (
                          <img
                            src={project.iconSecondary}
                            alt={`${project.title} secondary`}
                            className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:scale-105"
                          />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <img 
            src="/assets/scroll.svg" 
            alt="Architecture Scroll" 
            className="h-[500px] w-auto object-contain flex-shrink-0"
          />
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
  );
}
