"use client";

import { useEffect, useState } from "react";
import type { ArtProject, CreativeProject } from "@/types/creative";
import CreativePageLayout from "@/components/creativePageLayout";
import ProjectsList from "@/components/projectsList";
import Image from "next/image";

export default function Art() {
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<CreativeProject | null>(null);
  const [contentMoved, setContentMoved] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/art");
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects as ArtProject[]);
        } else {
          console.error("Invalid data structure from API:", data);
        }
      } catch (err) {
        console.error("Failed to fetch art projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const selected = selectedId
    ? projects.find((p) => p.id === selectedId)
    : projects[0];

  const featuredImage = selected?.images?.[0] || "/images/fallback.jpg";

  const handleProjectSelect = (id: number) => {
    const found = projects.find((p) => p.id === id) || null;
    setSelectedId(id);
    setTimeout(() => setContentMoved(true), 800);
    setTimeout(() => setExpandedProject(found), 1200);
  };

  return (
    <CreativePageLayout
      heroImage={
        <Image
          src={featuredImage}
          alt="Art hero image"
          fill
          className="object-cover object-center"
        />
      }
      projectList={
        <ProjectsList
          projects={projects}
          selectedId={selected?.id ?? null}
          onSelect={handleProjectSelect}
        />
      }
      expandedProject={expandedProject}
      setExpandedProject={setExpandedProject}
      contentMoved={contentMoved}
      setContentMoved={setContentMoved}
    >
      {loading ? (
        <p className="text-center text-gray-500 py-12">
          Cargando proyectos de arte...
        </p>
      ) : selected ? (
        <div className="pb-20">
          <h2 className="text-4xl font-bold text-[#19333F] mb-2">
            {selected.title}
          </h2>
          <p className="text-lg text-gray-400">
            {"description" in selected ? selected.description : ""}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No hay proyectos para mostrar.</p>
      )}
    </CreativePageLayout>
  );
}
