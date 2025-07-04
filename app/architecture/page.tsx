"use client";

import type { ArchitectureProject } from "@/types/creative";

import { useEffect, useState } from "react";
import CreativePageLayout from "@/components/creativePageLayout";
import ProjectsList from "@/components/projectsList";
import Image from "next/image";

export default function Architecture() {
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<ArchitectureProject | null>(null);
  const [contentMoved, setContentMoved] = useState(false);


  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/architecture");
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          console.error("Invalid data structure from API:", data);
        }
      } catch (err) {
        console.error("Failed to fetch architecture projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const selected = selectedId
    ? projects.find((p) => p.id === selectedId)
    : projects[0];

  const handleHeroClick = () => {
    console.log("✅ Clicked hero!");
    setTimeout(() => setContentMoved(true), 800);
    setTimeout(() => setExpandedProject(selected || null), 1200);
  };    

  const featuredImage =
    selected?.images?.[0] || "/images/fallback.jpg";

    return (
      <div className="min-h-screen bg-[#5c4b4a]">
        {!loading && (
          <CreativePageLayout
          heroImage={
            <div onClick={handleHeroClick} className="cursor-pointer">
              <Image
                src={featuredImage}
                alt="Architecture hero image"
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
          setExpandedProject={(p) => setExpandedProject(p as ArchitectureProject | null)}
          contentMoved={contentMoved}
          setContentMoved={setContentMoved}
          onHeroClick={handleHeroClick}
        >
          <div className="pb-20">
            <h2 className="text-4xl font-bold text-[#19333F] mb-2">
              {selected?.title}
            </h2>
            <p className="text-lg text-gray-400">
              {selected?.city}, {selected?.country}
              {selected?.year ? ` · ${selected?.year}` : ""}
            </p>
            <p className="text-md text-gray-500 mt-1 italic">
              {selected?.category}
            </p>
          </div>
        </CreativePageLayout>
        
        )}
    
        {loading && (
          <p className="text-center text-gray-500 py-12">
            Cargando proyectos de arquitectura...
          </p>
        )}
      </div>
    );
    
}