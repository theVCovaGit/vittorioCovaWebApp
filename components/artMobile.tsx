"use client";

import { useEffect, useRef, useState } from "react";
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

export default function ArtMobile() {
  const [projects, setProjects] = useState<ArtProject[]>([]);
  const [currentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const projectRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const stripRef = useRef<HTMLDivElement | null>(null);
  const scrollVisualRef = useRef<HTMLDivElement | null>(null);

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
    </>
  );
}

