"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CreativePageLayout from "@/components/creativePageLayout";
import ProjectsList from "@/components/projectsList";
import type { FilmProject } from "@/types/creative";

export default function Film() {
  const [projects, setProjects] = useState<FilmProject[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/film");
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          console.error("Invalid data structure from API:", data);
        }
      } catch (err) {
        console.error("Failed to fetch film projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const selected = selectedId !== null
    ? projects.find((p) => p.id === selectedId)
    : projects[0];

  const featuredImage = selected?.images?.[0] || "/images/fallback.jpg";

  return (
    <CreativePageLayout
      heroImage={
        <Image
          src={featuredImage}
          alt="Film hero image"
          fill
          className="object-cover object-center"
        />
      }
      projectList={
        <ProjectsList
          projects={projects}
          selectedId={selected?.id ?? null}
          onSelect={(id) => setSelectedId(id)}
        />
      }
    >
      {loading ? (
        <p className="text-center text-gray-500 py-12">
          Cargando proyectos de film...
        </p>
      ) : selected ? (
        <div className="pb-20">
          <h2 className="text-4xl font-bold text-[#19333F] mb-2">
            {selected.title}
          </h2>
          <p className="text-lg text-gray-400">{selected.description}</p>
        </div>
      ) : (
        <p className="text-gray-500">No hay proyectos para mostrar.</p>
      )}
    </CreativePageLayout>
  );
}
