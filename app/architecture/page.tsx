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

const getGridPlacement = (position?: number) => {
  const safeIndex = Math.max(0, (position ?? 1) - 1);
  const column = (safeIndex % GRID_COLUMNS) + 1;
  const row = Math.min(
    GRID_ROWS,
    Math.floor(safeIndex / GRID_COLUMNS) + 1
  );

  return {
    gridColumnStart: column,
    gridRowStart: row,
  };
};

export default function Architecture() {
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
  const [currentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

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
    <div className="min-h-screen bg-[#fff5e0] relative overflow-visible">
      {/* Film Strip Container */}
      <div 
        className="film-strip-container absolute top-[48.3%] left-0 transform -translate-y-1/2 w-screen h-[700px] overflow-x-scroll overflow-y-visible scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
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
              <div
                className="grid h-full w-full"
                style={{
                  gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
                  gap: "1.5%",
                }}
              >
                {currentPageProjects.map((project) => {
                  const { gridColumnStart, gridRowStart } = getGridPlacement(project.position);

                  return (
                    <div
                      key={project.id}
                      className="pointer-events-auto flex items-center justify-center"
                      style={{
                        gridColumnStart,
                        gridRowStart,
                      }}
                    >
                      {(project.icon || project.iconSecondary) && (
                        <button
                          type="button"
                          className="group relative h-28 w-28 max-w-full bg-transparent p-0 border-0"
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            window.dispatchEvent(new CustomEvent("architecture-expanded-open"));
                          }}
                        >
                          {project.icon && (
                            <img
                              src={project.icon}
                              alt={project.title}
                              className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
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
