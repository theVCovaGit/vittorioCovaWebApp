"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useMemo } from "react";

interface FilmProject {
  id: number;
  type: "film";
  title: string;
  icon?: string;
  images: string[];
  releaseYear?: string;
  countries?: string[];
  cities?: string[];
  genre?: string;
  category?: string;
  position?: number;
  page?: number;
}

const PROJECTS_PER_STRIP = 4;
const MOBILE_HEADER_HEIGHT = 142;
const MOBILE_FOOTER_HEIGHT = 210;

export default function FilmMobile() {
  const [projects, setProjects] = useState<FilmProject[]>([]);
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

  // Group projects into strips of 4, always add one extra empty strip
  const projectStrips = useMemo(() => {
    const strips: FilmProject[][] = [];
    for (let i = 0; i < projects.length; i += PROJECTS_PER_STRIP) {
      strips.push(projects.slice(i, i + PROJECTS_PER_STRIP));
    }
    // Always add one more empty strip than needed
    const stripsNeeded = Math.ceil(projects.length / PROJECTS_PER_STRIP);
    const totalStrips = stripsNeeded + 1;
    // Ensure we have the extra strip even if it's empty
    while (strips.length < totalStrips) {
      strips.push([]);
    }
    return strips;
  }, [projects]);

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
            className="film-strip-container flex h-full w-full items-center overflow-x-auto overflow-y-hidden scrollbar-hide"
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
              {projectStrips.map((stripProjects, stripIndex) => (
                <div
                  key={stripIndex}
                  className="relative h-full flex-shrink-0"
                >
                  <img
                    src="/assets/film.svg"
                    alt="Film Strip"
                    className="h-full w-auto object-contain"
                  />

                  {/* Poster icons - calculated from Illustrator dimensions */}
                  {/* Film strip: 15.0312in x 6.2393in, Poster: 2.8252in x 4.2379in, Gap: 0.3in */}
                  <div className="absolute inset-0">
                    {stripProjects.map((project, localIndex) => {
                      const posterWidthPercent = 18.8; // Poster width as % of strip
                      const posterHeightPercent = 67.9; // Poster height as % of strip
                      const leftBorderPercent = 3.8; // Left border/padding
                      const gapPercent = 5.7; // Gap between frames as % of strip
                      const topMarginPercent = (100 - posterHeightPercent) / 2; // Center vertically
                      
                      const leftPosition = leftBorderPercent + (localIndex * (posterWidthPercent + gapPercent));
                      
                      if (!project.icon) return null;
                      
                      return (
                        <div
                          key={project.id}
                          className="absolute overflow-hidden"
                          style={{
                            width: `${posterWidthPercent}%`,
                            height: `${posterHeightPercent}%`,
                            left: `${leftPosition}%`,
                            top: `${topMarginPercent}%`,
                          }}
                        >
                          <img
                            src={project.icon}
                            alt={project.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

