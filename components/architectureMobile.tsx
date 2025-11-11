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

const MOBILE_ICON_SIZE = "clamp(140px, 36vw, 220px)";
const MOBILE_SCROLL_HEIGHT = "clamp(420px, 62vh, 680px)";
const MOBILE_SCROLL_WIDTH = 1080;
const MOBILE_HEADER_OFFSET = "12vh";
const MOBILE_FOOTER_OFFSET = "24vh";
const SCROLL_SCALE_Y = 1.3;
const SCROLL_TRANSLATE_Y = "3.25vh";

export default function ArchitectureMobile() {
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
  const [currentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const projectRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const stripRef = useRef<HTMLDivElement | null>(null);

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

  const currentPageProjects = projects
    .filter((project) => (project.page || 1) === currentPage)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="fixed inset-0 bg-[#fff5e0] overflow-hidden">
      <div className="absolute left-0 right-0 flex items-center">
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
          <div
            className="relative flex h-full items-center"
            style={{
              paddingTop: MOBILE_HEADER_OFFSET,
              paddingBottom: MOBILE_FOOTER_OFFSET,
            }}
          >
            <div
              className="relative flex-shrink-0 overflow-visible"
              style={{ width: MOBILE_SCROLL_WIDTH, height: MOBILE_SCROLL_HEIGHT }}
            >
              <div
                className="pointer-events-none relative inset-0 block"
                style={{
                  height: "100%",
                  width: "100%",
                  transformOrigin: "center",
                  transform: `translateY(${SCROLL_TRANSLATE_Y}) scaleY(${SCROLL_SCALE_Y})`,
                }}
              >
                <img
                  src="/assets/scroll.svg"
                  alt="Architecture Scroll"
                  className="h-full w-full object-contain object-left"
                />

                <img
                  src="/assets/tape1.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -top-3 left-[4%] w-28 opacity-80"
                />
                <img
                  src="/assets/tape2.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -top-4 left-[22%] w-28 opacity-80"
                />
                <img
                  src="/assets/tape3.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -top-5 left-[40%] w-28 opacity-80"
                />
                <img
                  src="/assets/tape4.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -top-4 left-[58%] w-28 opacity-80"
                />
                <img
                  src="/assets/tape5.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -top-3 left-[76%] w-28 opacity-80"
                />
                <img
                  src="/assets/tape6.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -top-6 left-[15%] w-28 opacity-80"
                />

                <img
                  src="/assets/tape7.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -bottom-6 left-[6%] w-28 opacity-80"
                />
                <img
                  src="/assets/tape8.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -bottom-6 left-[26%] w-28 opacity-80"
                />
                <img
                  src="/assets/tape9.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -bottom-6 left-[46%] w-28 opacity-80"
                />
                <img
                  src="/assets/tape10.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -bottom-6 left-[66%] w-28 opacity-80"
                />
                <img
                  src="/assets/tape11.svg"
                  alt="Tape"
                  className="pointer-events-none absolute -bottom-6 left-[84%] w-28 opacity-80"
                />
              </div>

              <div
                className="absolute"
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
                          className="group relative bg-transparent p-0"
                          style={{ width: MOBILE_ICON_SIZE }}
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
  );
}

