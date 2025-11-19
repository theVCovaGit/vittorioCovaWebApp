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
const MOBILE_SCROLL_HEIGHT = 360;
const MOBILE_SCROLL_WIDTH = 980;
const MOBILE_SCROLL_ASPECT_RATIO = MOBILE_SCROLL_WIDTH / MOBILE_SCROLL_HEIGHT;
const MOBILE_SCROLL_MULTIPLIER = 1.8;
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
              {projectStrips.map((stripProjects, stripIndex) => (
                <div
                  key={stripIndex}
                  className="relative flex-shrink-0"
                  style={{
                    height: "100%",
                    width: `calc(100% * ${MOBILE_SCROLL_ASPECT_RATIO * MOBILE_SCROLL_MULTIPLIER})`,
                    minWidth: MOBILE_SCROLL_WIDTH,
                  }}
                >
                  <div className="absolute inset-0 z-0 bg-[#2d2f38]" />

                  <div
                    className="pointer-events-none absolute left-0 right-0 z-20"
                    style={{
                      top: 0,
                      bottom: 0,
                      backgroundImage: "url('/assets/film.svg')",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "auto 100%",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Poster icons - using Illustrator proportions */}
                  {/* Film strip: 15.0312in x 6.2393in, Poster: 2.8252in x 4.2379in, Gap: 0.3in */}
                  <div className="absolute z-30 inset-0">
                    {stripProjects.map((project, localIndex) => {
                      if (!project.icon) return null;

                      const posterWidthPercent = 18.8;
                      const posterHeightPercent = 67.9;
                      const leftBorderPercent = 3.8; // Same as desktop
                      const gapPercent = 5.7; // Same as desktop
                      const topMarginPercent = (100 - posterHeightPercent) / 2;
                      
                      const leftPosition = leftBorderPercent + (localIndex * (posterWidthPercent + gapPercent));

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

