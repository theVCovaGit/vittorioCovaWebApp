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
    onSelect(project.id);
    setIconUrl(project.icon || "");
  }}
  onClick={() => {
    setExpandedProject?.(project);
    triggerAnimations?.();
  }}
  className={`text-left uppercase tracking-[2.565px] text-[13.5px] leading-none flex justify-between items-center px-3 py-[6px] rounded-sm bg-black transition duration-150
    ${isSelected ? "text-[#8CAC77]" : "text-[#FEF4DC]"}
    focus:outline-none focus:ring-0 active:ring-0 hover:ring-0`}
  style={{
    WebkitTapHighlightColor: "transparent",
    outline: "none",
    boxShadow: "none",
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
