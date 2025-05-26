"use client";

import type { CreativeProject } from "@/types/creative";

import { useEffect, useState } from "react";
import CreativePageLayout from "@/components/creativePageLayout";
import ProjectsList from "@/components/projectsList";
import Image from "next/image";

type ProductDesignProject = CreativeProject;

export default function ProductDesign() {
  const [projects, setProjects] = useState<ProductDesignProject[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<ProductDesignProject | null>(null);
  const [dotMoved, setDotMoved] = useState(false);
  const [dotsMoved, setDotsMoved] = useState(false);
  const [contentMoved, setContentMoved] = useState(false);

  const handleHeroClick = () => {
    console.log("✅ Clicked hero!");
    setDotMoved(true);
    setTimeout(() => setDotsMoved(true), 400);
    setTimeout(() => setContentMoved(true), 800);
    setTimeout(() => setExpandedProject(selected || null), 1200);
  };  

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/productdesign");
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          console.error("Invalid data structure from API:", data);
        }
      } catch (err) {
        console.error("Failed to fetch product design projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const selected = selectedId
    ? projects.find((p) => p.id === selectedId)
    : projects[0];

  const featuredImage =
    selected?.images?.[0] || "/images/fallback.jpg";

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
      selectedId={selected?.id}
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
