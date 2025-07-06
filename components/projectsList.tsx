"use client";

import React from "react";
import { useIconDisplay } from "@/context/IconDisplayContext";
import type { CreativeProject } from "@/types/creative";

type ProjectsListProps = {
  projects: CreativeProject[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  setExpandedProject?: (project: CreativeProject | null) => void;
  triggerAnimations?: () => void; // ✅ new prop
};




export default function ProjectsList({
  projects,
  selectedId,
  onSelect,
  setExpandedProject,
  triggerAnimations
 
}: ProjectsListProps) {
  const { setIconUrl } = useIconDisplay();

  return (
    <div
      className="w-[259px] h-auto flex flex-col gap-2 sm:gap-3 px-2"
      style={{
        flexShrink: 0,
        fontFamily: '"Basica", sans-serif',
      }}
    >
      {projects.map((project) => {
        const [main, number] = project.title.split(/ (?=\d+$)/);
        const isSelected = selectedId === project.id;
  
        return (
          <button
            key={project.id}
            onMouseEnter={() => {
              onSelect(project.id); // Hover to preview
              setIconUrl(project.icon || "");
            }}
            onClick={() => {
              setExpandedProject?.(project);     // set project
              triggerAnimations?.();             // trigger animations
            }}
            
            className={`text-left uppercase tracking-[2.565px] text-[13.5px] leading-none flex justify-between items-center transition duration-150 px-3 py-[6px] rounded-sm
              ${isSelected ? "text-[#8CAC77]" : "text-[#FEF4DC] hover:text-[#8CAC77]"} bg-black`}
            style={{
              marginTop: "2.5vh",
              zIndex: 9999,
              fontWeight: 400,
              fontStyle: "normal",
            }}
          >
            <span className="truncate">{main}</span>
            {number && (
              <span
                style={{
                  fontFamily: "Barrel, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "13.5px",
                  letterSpacing: "2.565px",
                }}
              >
                {number}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
  
}
