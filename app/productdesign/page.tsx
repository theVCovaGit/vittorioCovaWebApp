"use client";

import type { CreativeProject } from "@/types/creative";
import { useEffect, useState } from "react";
import CreativePageLayout from "@/components/creativePageLayout";
import ProjectsList from "@/components/projectsList";
import Image from "next/image";

export default function ProductDesign() {
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<CreativeProject | null>(null);
  const [contentMoved, setContentMoved] = useState(false);

  const selected = selectedId !== null
    ? projects.find((p) => p.id === selectedId)
    : projects[0];

  const featuredImage = selected?.images?.[0] || "/images/fallback.jpg";

  const handleHeroClick = () => {
    console.log("✅ Clicked hero!");
    setTimeout(() => setContentMoved(true), 800);
    setTimeout(() => setExpandedProject(selected || null), 1200);
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/productdesign");
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          // Enforce type safety by attaching the right type
          const filtered = data.projects.filter(
            (p: { type: string; }): p is CreativeProject => p.type === "productDesign"
          );
          
          setProjects(filtered);
        } else {
          console.error("Invalid data structure from API:", data);
        }
      } catch (err) {
        console.error("Failed to fetch product design projects:", err);
      }
    }

    fetchProjects();
  }, []);

  return (
    <CreativePageLayout
      heroImage={
        <div onClick={handleHeroClick} className="cursor-pointer">
          <Image
            src={featuredImage}
            alt="Product Design hero image"
            fill
            className="object-cover object-center"
          />
        </div>
      }
      projectList={
        <ProjectsList
          projects={projects}
          selectedId={selected?.id ?? null}
          onSelect={(id) => setSelectedId(id)}
        />
      }
      expandedProject={expandedProject}
      setExpandedProject={setExpandedProject}
      contentMoved={contentMoved}
      setContentMoved={setContentMoved}
      onHeroClick={handleHeroClick}
    />
  );
}
