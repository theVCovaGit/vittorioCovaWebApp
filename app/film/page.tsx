"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useMemo } from "react";
import FilmMobile from "@/components/filmMobile";

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

function FilmDesktop() {
  const [projects, setProjects] = useState<FilmProject[]>([]);

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
    <div className="min-h-screen bg-[#2d2f38] relative overflow-hidden">
      <div
        className="film-strip-container absolute top-[48.3%] left-0 transform -translate-y-1/2 w-screen h-[500px] overflow-x-scroll overflow-y-hidden scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="relative w-full h-full flex">
          {projectStrips.map((stripProjects, stripIndex) => (
            <div key={stripIndex} className="relative h-full flex-shrink-0">
              <img
                src="/assets/film.svg"
                alt="Film Strip"
                className="h-full w-auto object-contain"
              />
              {/* Poster images - calculated from Illustrator dimensions */}
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
  );
}

export default function Film() {
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
    return <FilmDesktop />;
  }

  return isMobile ? <FilmMobile /> : <FilmDesktop />;
}
