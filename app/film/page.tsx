"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import FilmMobile from "@/components/filmMobile";

// Placeholder film projects data
const PLACEHOLDER_PROJECTS = [
  {
    id: 1,
    title: "WINECHESTER",
    images: ["/images/1.png"], // Using placeholder image
    genre: "Drama",
    category: "Short Film",
    releaseYear: "2024",
  },
  {
    id: 2,
    title: "PROJECT 2",
    images: ["/images/1.png"],
    genre: "Thriller",
    category: "Feature Film",
    releaseYear: "2024",
  },
  {
    id: 3,
    title: "PROJECT 3",
    images: ["/images/1.png"],
    genre: "Comedy",
    category: "Short Film",
    releaseYear: "2023",
  },
  {
    id: 4,
    title: "PROJECT 4",
    images: ["/images/1.png"],
    genre: "Action",
    category: "Feature Film",
    releaseYear: "2024",
  },
  {
    id: 5,
    title: "PROJECT 5",
    images: ["/images/1.png"],
    genre: "Horror",
    category: "Short Film",
    releaseYear: "2024",
  },
  {
    id: 6,
    title: "PROJECT 6",
    images: ["/images/1.png"],
    genre: "Sci-Fi",
    category: "Feature Film",
    releaseYear: "2023",
  },
  {
    id: 7,
    title: "PROJECT 7",
    images: ["/images/1.png"],
    genre: "Documentary",
    category: "Short Film",
    releaseYear: "2024",
  },
  {
    id: 8,
    title: "PROJECT 8",
    images: ["/images/1.png"],
    genre: "Romance",
    category: "Feature Film",
    releaseYear: "2024",
  },
];

function FilmDesktop() {
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
          {/* First film strip section - 4 projects */}
          <div className="relative h-full flex-shrink-0">
            <img
              src="/assets/film.svg"
              alt="Film Strip"
              className="h-full w-auto object-contain"
            />
            {/* Poster overlays for first strip - calculated from Illustrator dimensions */}
            {/* Film strip: 15.0312in x 6.2393in, Poster: 2.8252in x 4.2379in, Gap: 0.3in */}
            {/* Poster as % of strip: ~18.8% width, ~67.9% height */}
            <div className="absolute inset-0">
              {PLACEHOLDER_PROJECTS.slice(0, 4).map((project, localIndex) => {
                // Calculate frame positions based on proportions
                // First frame starts after left border (3.8% from left)
                const posterWidthPercent = 18.8; // Poster width as % of strip
                const posterHeightPercent = 67.9; // Poster height as % of strip
                const leftBorderPercent = 3.8; // Left border/padding
                const gapPercent = 5.7; // Gap between frames as % of strip
                const topMarginPercent = (100 - posterHeightPercent) / 2; // Center vertically
                
                // Global index across all strips for continuous positioning
                const globalIndex = localIndex;
                const leftPosition = leftBorderPercent + (globalIndex * (posterWidthPercent + gapPercent));
                
                return (
                <div
                  key={project.id}
                  className="absolute"
                  style={{
                    width: `${posterWidthPercent}%`,
                    height: `${posterHeightPercent}%`,
                    left: `${leftPosition}%`,
                    top: `${topMarginPercent}%`,
                  }}
                >
                  {project.images[0] && (
                    <div className="relative w-full h-full bg-[#f5f0e8] rounded-sm overflow-hidden" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}>
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                      <div className="absolute top-4 left-4 right-4">
                        <h3 className="font-bold text-black text-2xl uppercase tracking-tight" style={{ 
                          fontFamily: 'serif',
                          textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
                        }}>
                          {project.title}
                        </h3>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-[8px] uppercase tracking-wide" style={{ 
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                          fontFamily: 'monospace'
                        }}>
                          {project.genre} · {project.category}
                        </p>
                        <p className="text-white text-[6px] mt-0.5" style={{ 
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                          fontFamily: 'monospace'
                        }}>
                          {project.releaseYear} · VITTORIO COVA
                        </p>
                      </div>
                      <div className="absolute bottom-1 left-2 text-white text-[8px] font-bold" style={{ 
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        fontFamily: 'monospace'
                      }}>
                        {localIndex === 0 ? '2A' : localIndex === 1 ? '3' : localIndex === 2 ? '3A' : '4'}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
          
          {/* Second film strip section - for additional projects beyond 4 */}
          {PLACEHOLDER_PROJECTS.length > 4 && (
            <div className="relative h-full flex-shrink-0">
              <img
                src="/assets/film.svg"
                alt="Film Strip"
                className="h-full w-auto object-contain"
              />
              {/* Poster overlays for second strip - continuing sequence */}
              <div className="absolute inset-0">
                {PLACEHOLDER_PROJECTS.slice(4).map((project, localIndex) => {
                  const posterWidthPercent = 18.8;
                  const posterHeightPercent = 67.9;
                  const leftBorderPercent = 3.8;
                  const gapPercent = 5.7;
                  const topMarginPercent = (100 - posterHeightPercent) / 2;
                  
                  const leftPosition = leftBorderPercent + (localIndex * (posterWidthPercent + gapPercent));
                  
                  return (
                  <div
                    key={project.id}
                    className="absolute"
                    style={{
                      width: `${posterWidthPercent}%`,
                      height: `${posterHeightPercent}%`,
                      left: `${leftPosition}%`,
                      top: `${topMarginPercent}%`,
                    }}
                  >
                    {project.images[0] && (
                      <div className="relative w-full h-full bg-[#f5f0e8] rounded-sm overflow-hidden" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}>
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                        <div className="absolute top-4 left-4 right-4">
                          <h3 className="font-bold text-black text-2xl uppercase tracking-tight" style={{ 
                            fontFamily: 'serif',
                            textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
                          }}>
                            {project.title}
                          </h3>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-[8px] uppercase tracking-wide" style={{ 
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            fontFamily: 'monospace'
                          }}>
                            {project.genre} · {project.category}
                          </p>
                          <p className="text-white text-[6px] mt-0.5" style={{ 
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            fontFamily: 'monospace'
                          }}>
                            {project.releaseYear} · VITTORIO COVA
                          </p>
                        </div>
                        <div className="absolute bottom-1 left-2 text-white text-[8px] font-bold" style={{ 
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                          fontFamily: 'monospace'
                        }}>
                          {(localIndex % 4 === 0 ? '2A' : localIndex % 4 === 1 ? '3' : localIndex % 4 === 2 ? '3A' : '4')}
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          )}
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
