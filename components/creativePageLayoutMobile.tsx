"use client";

import type { CreativeProject } from "@/types/creative";
import React, { useState } from "react";

type CreativePageLayoutMobileProps = {
  heroImage?: React.ReactNode;
  children?: React.ReactNode;
  projectList?: React.ReactElement<{ 
    setExpandedProject?: (project: CreativeProject | null) => void;
    onProjectClick?: (project: CreativeProject) => void;
  }>;
  expandedProject?: CreativeProject | null;
  setExpandedProject?: (project: CreativeProject | null) => void;
  categoryColor?: string;
};

export default function CreativePageLayoutMobile({
  heroImage,
  projectList,
  expandedProject,
  setExpandedProject,
  categoryColor = "#fef4dc"
}: CreativePageLayoutMobileProps) {
  const [showProjectList, setShowProjectList] = useState(false);

  const categoryColors: Record<string, string> = {
    architecture: "#92a982",
    productDesign: "#8494ac",
    film: "#d7c97c",
    art: "#bc76b1",
  };

  const color = expandedProject?.type ? categoryColors[expandedProject.type] || "#fef4dc" : categoryColor;

  return (
    <div className="relative w-full min-h-screen bg-black text-[#fef4dc] pt-16 overflow-x-hidden">
      
      {/* Project List View - Default */}
      {!expandedProject && (
        <div className="w-full min-h-screen">
          {/* Hero Image Section */}
          {heroImage && (
            <div 
              className="w-full h-64 relative cursor-pointer"
              onClick={() => setShowProjectList(true)}
            >
              {heroImage}
              {!showProjectList && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <span className="text-[#fef4dc] font-microextend text-lg uppercase">
                    Tap to Explore Projects
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Projects List */}
          <div className="px-4 py-6">
            {projectList &&
              React.isValidElement(projectList) &&
              React.cloneElement(
                projectList as React.ReactElement<{
                  setExpandedProject?: (project: CreativeProject | null) => void;
                  onProjectClick?: (project: CreativeProject) => void;
                }>,
                {
                  setExpandedProject,
                  onProjectClick: (project: CreativeProject) => {
                    setExpandedProject?.(project);
                  }
                }
              )}
          </div>
        </div>
      )}

      {/* Expanded Project View */}
      {expandedProject && (
        <div className="w-full min-h-screen pb-20">
          {/* Back Button */}
          <button
            onClick={() => setExpandedProject?.(null)}
            className="fixed top-20 left-4 z-50 bg-black bg-opacity-70 text-[#fef4dc] px-4 py-2 rounded font-microextend text-sm"
          >
            ← BACK
          </button>

          {/* Project Title */}
          <div className="px-4 pt-8 pb-4">
            <h1 
              className="font-microextend text-3xl font-bold uppercase"
              style={{ color }}
            >
              {expandedProject.title}
            </h1>
          </div>

          {/* Project Metadata */}
          <div className="px-4 pb-6 space-y-2">
            {expandedProject.type === "architecture" && (
              <>
                <p className="text-sm text-[#fef4dc] opacity-80">
                  {expandedProject.city}, {expandedProject.country}
                  {expandedProject.year && ` · ${expandedProject.year}`}
                </p>
                <p className="text-sm text-[#fef4dc] opacity-80">
                  {expandedProject.category}
                </p>
              </>
            )}

            {expandedProject.type === "productDesign" && (
              <>
                <p className="text-sm text-[#fef4dc] opacity-80">
                  {expandedProject.city}, {expandedProject.country}
                  {expandedProject.year && ` · ${expandedProject.year}`}
                </p>
                <p className="text-sm text-[#fef4dc] opacity-80">
                  {[expandedProject.material, expandedProject.useCase]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </>
            )}

            {expandedProject.type === "art" && (
              <>
                <p className="text-sm text-[#fef4dc] opacity-80">
                  {expandedProject.city}, {expandedProject.country}
                  {expandedProject.year && ` · ${expandedProject.year}`}
                </p>
                <p className="text-sm text-[#fef4dc] opacity-80">
                  {expandedProject.discipline} · {expandedProject.collection}
                </p>
              </>
            )}

            {expandedProject.type === "film" && (
              <>
                {expandedProject.year && (
                  <p className="text-sm text-[#fef4dc] opacity-80">{expandedProject.year}</p>
                )}
                {(expandedProject.registration || expandedProject.length) && (
                  <p className="text-sm text-[#fef4dc] opacity-80">
                    {[expandedProject.registration, expandedProject.length].filter(Boolean).join(" · ")}
                  </p>
                )}
                {expandedProject.synapsis && (
                  <p className="text-sm text-[#fef4dc] opacity-80">{expandedProject.synapsis}</p>
                )}
              </>
            )}
          </div>

          {/* Project Images - Simple vertical gallery (film has no images) */}
          {"images" in expandedProject && expandedProject.images && expandedProject.images.length > 0 && (
            <div className="px-4 space-y-4">
              {expandedProject.images.map((image, index) => (
                <div key={index} className="w-full aspect-[4/3] relative">
                  <img
                    src={image}
                    alt={`${expandedProject.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Project Description */}
          {expandedProject.type === "art" && expandedProject.description && (
            <div className="px-4 pt-6">
              <p className="text-sm text-[#fef4dc] leading-relaxed">
                {expandedProject.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

