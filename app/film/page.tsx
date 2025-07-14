"use client";

import type { FilmProject } from "@/types/creative";

import { useEffect, useState } from "react";
import CreativePageLayout from "@/components/creativePageLayout";
import ProjectsList from "@/components/projectsList";
import Image from "next/image";

export default function Film() {
  const [projects, setProjects] = useState<FilmProject[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<FilmProject | null>(null);
  const [contentMoved, setContentMoved] = useState(false);

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

  const selected = selectedId
    ? projects.find((p) => p.id === selectedId)
    : projects[0];

  const handleHeroClick = () => {
    console.log("Clicked film hero image");
    setTimeout(() => setContentMoved(true), 800);
    setTimeout(() => setExpandedProject(selected || null), 1200);
  };

  const featuredImage = selected?.images?.[0] || "/images/fallback.jpg";

  return (
    <div className="min-h-screen bg-[#5c4b4a]">
      {!loading && (
        <CreativePageLayout
          heroImage={
            <div onClick={handleHeroClick} className="cursor-pointer">
              <Image
                src={featuredImage}
                alt="Film hero image"
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
          setExpandedProject={(p) => setExpandedProject(p as FilmProject | null)}
          contentMoved={contentMoved}
          setContentMoved={setContentMoved}
        >
          <div className="pb-20">
            <h2 className="text-4xl font-bold text-[#fef4dc] mb-2">
              {selected?.title}
            </h2>
            <p className="text-lg text-gray-400">
              {(selected?.cities ?? []).join(", ")}, {(selected?.countries ?? []).join(", ")}
              {selected?.releaseYear ? ` · ${selected.releaseYear}` : ""}
            </p>
            <p className="text-md text-gray-500 mt-1 italic">
              {[selected?.genre, selected?.category].filter(Boolean).join(" · ")}
            </p>
          </div>
        </CreativePageLayout>
      )}

      {loading && (
        <p className="text-center text-gray-500 py-12">
          Cargando proyectos de film...
        </p>
      )}
    </div>
  );
}
