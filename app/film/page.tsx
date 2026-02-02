"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import FilmMobile from "@/components/filmMobile";
import CreativeSectionFooter from "@/components/creativeSectionFooter";
import LoadingSpinner from "@/components/loadingSpinner";

interface FilmProject {
  id: number;
  type: "film";
  title: string;
  icon?: string;
  year?: string;
  registration?: string;
  synapsis?: string;
  length?: string;
  position?: number;
  page?: number;
}

function FilmDesktop() {
  const [projects, setProjects] = useState<FilmProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/film");
        if (!response.ok) {
          throw new Error(`Unexpected status ${response.status}`);
        }
        const data = await response.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      } catch (error) {
        console.error("Error fetching film projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Group projects into strips based on page and position
  const projectStrips = useMemo(() => {
    // Sort projects by page first, then by position
    const sortedProjects = [...projects].sort((a, b) => {
      const pageA = a.page ?? 1;
      const pageB = b.page ?? 1;
      if (pageA !== pageB) {
        return pageA - pageB;
      }
      const posA = a.position ?? 1;
      const posB = b.position ?? 1;
      return posA - posB;
    });

    // Find the maximum page number
    const maxPage = sortedProjects.length > 0
      ? sortedProjects.reduce((max, p) => {
          const page = p.page ?? 1;
          return page > max ? page : max;
        }, 1)
      : 1;

    // Create strips for each page
    const strips: (FilmProject | null)[][] = [];
    for (let pageNum = 1; pageNum <= maxPage; pageNum++) {
      // Initialize strip with 4 empty slots
      const strip: (FilmProject | null)[] = [null, null, null, null];
      
      // Fill in projects for this page
      sortedProjects.forEach((project) => {
        const projectPage = project.page ?? 1;
        const projectPosition = project.position ?? 1;
        
        if (projectPage === pageNum && projectPosition >= 1 && projectPosition <= 4) {
          strip[projectPosition - 1] = project; // position 1-4 maps to index 0-3
        }
      });
      
      strips.push(strip);
    }
    
    // Always add one more empty strip
    strips.push([null, null, null, null]);
    
    return strips;
  }, [projects]);
  // First strip only (no horizontal scroll); no film strip image; background #fff3df
  const firstStrip = projectStrips[0] ?? [];
  const firstProject = firstStrip.find(Boolean) ?? null;

  return (
    <div className="min-h-screen bg-[#fff3df] relative overflow-hidden">
      {loading && <LoadingSpinner />}
      <CreativeSectionFooter />
      <div className="absolute top-[8rem] left-[7rem] flex items-start justify-start gap-12">
        {/* Poster strip */}
        <div className="h-[780px] flex items-start justify-start gap-8 flex-shrink-0">
          {firstStrip.map((project, localIndex) => {
            if (!project || !project.icon) return null;
            return (
              <div
                key={project.id}
                className="relative w-[320px] max-w-[340px] aspect-[2.8252/4.2379] overflow-hidden flex-shrink-0"
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
        {/* Text block: year, title, registration, synopsis, length, WATCH FREE */}
        {firstProject && (
          <div className="flex flex-col text-[#524b44] max-w-[420px] pt-0">
            {firstProject.year && (
              <span className="font-electrolize text-base">{firstProject.year}</span>
            )}
            <h1 className="font-microextend font-bold text-2xl uppercase tracking-wider mt-2 leading-tight">
              {firstProject.title}
            </h1>
            {firstProject.registration && (
              <span className="font-microextend text-sm mt-1">{firstProject.registration}</span>
            )}
            {firstProject.synapsis && (
              <p className="font-electrolize text-base leading-relaxed mt-6">
                {firstProject.synapsis}
              </p>
            )}
            {firstProject.length && (
              <span className="font-electrolize text-base mt-6">{firstProject.length}</span>
            )}
            <Link
              href="https://www.youtube.com/watch?v=wMNJeHijiRU"
              target="_blank"
              rel="noopener noreferrer"
              className="font-blurlight font-bold text-3xl uppercase tracking-wide mt-12 ml-40 inline-block text-[#524b44] no-underline hover:opacity-80 transition-opacity"
            >
              WATCH FREE
            </Link>
          </div>
        )}
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
