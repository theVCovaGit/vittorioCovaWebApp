"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef } from "react";

// Placeholder film projects data
const PLACEHOLDER_PROJECTS = [
  {
    id: 1,
    title: "WINCHESTER",
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
];

const MOBILE_SCROLL_HEIGHT = 360;
const MOBILE_SCROLL_WIDTH = 980;
const MOBILE_SCROLL_ASPECT_RATIO = MOBILE_SCROLL_WIDTH / MOBILE_SCROLL_HEIGHT;
const MOBILE_SCROLL_MULTIPLIER = 1.8;
const MOBILE_HEADER_HEIGHT = 142;
const MOBILE_FOOTER_HEIGHT = 210;

export default function FilmMobile() {
  const stripRef = useRef<HTMLDivElement | null>(null);

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
              <div
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
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "auto 100%",
                    backgroundPosition: "center",
                  }}
                />

                {/* Poster overlays inside film strip frames - using Illustrator proportions */}
                {/* Film strip: 15.0312in x 6.2393in, Poster: 2.8252in x 4.2379in, Gap: 0.3in */}
                <div className="absolute z-30 inset-0">
                  {PLACEHOLDER_PROJECTS.map((project, index) => {
                    if (!project.images[0]) return null;

                    // Same proportions as desktop
                    const posterWidthPercent = 18.8;
                    const posterHeightPercent = 67.9;
                    const leftBorderPercent = 3; // Left border/padding
                    const gapPercent = 2; // 0.3in / 15.0312in ≈ 2%
                    const topMarginPercent = (100 - posterHeightPercent) / 2;
                    
                    const leftPosition = leftBorderPercent + (index * (posterWidthPercent + gapPercent));

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
                        <div className="relative w-full h-full bg-[#f5f0e8] rounded-sm overflow-hidden" style={{ boxShadow: 'inset 0 0 15px rgba(0,0,0,0.1)' }}>
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                          <div className="absolute top-2 left-2 right-2">
                            <h3 className="font-bold text-black text-lg uppercase tracking-tight" style={{ 
                              fontFamily: 'serif',
                              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
                            }}>
                              {project.title}
                            </h3>
                          </div>
                          <div className="absolute bottom-1 left-1 right-1">
                            <p className="text-white text-[7px] uppercase tracking-wide" style={{ 
                              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                              fontFamily: 'monospace'
                            }}>
                              {project.genre} · {project.category}
                            </p>
                            <p className="text-white text-[5px] mt-0.5" style={{ 
                              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                              fontFamily: 'monospace'
                            }}>
                              {project.releaseYear} · VITTORIO COVA
                            </p>
                          </div>
                          <div className="absolute bottom-0.5 left-1 text-white text-[7px] font-bold" style={{ 
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            fontFamily: 'monospace'
                          }}>
                            {index === 0 ? '2A' : index === 1 ? '3' : index === 2 ? '3A' : '4'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

