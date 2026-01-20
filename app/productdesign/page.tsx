"use client";

import { useEffect, useState } from "react";
import type { ProductDesignProject } from "@/types/creative";
import CreativePageLayout from "@/components/creativePageLayout";
import ProjectsList from "@/components/projectsList";
import Image from "next/image";

export default function ProductDesign() {
  const [projects, setProjects] = useState<ProductDesignProject[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<ProductDesignProject | null>(null);
  const [contentMoved, setContentMoved] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/productdesign");
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects as ProductDesignProject[]);
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

  const handleHeroClick = () => {
    console.log("🧢 Clicked product design hero");
    setTimeout(() => setContentMoved(true), 800);
    setTimeout(() => setExpandedProject(selected || null), 1200);
  };

  const featuredImage = selected?.images?.[0] || "/images/fallback.jpg";

  return (
    <div className="min-h-screen bg-[#554943]">
      {!loading && (
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
          setExpandedProject={(p) =>
            setExpandedProject(p as ProductDesignProject | null)
          }
          contentMoved={contentMoved}
          setContentMoved={setContentMoved}
        >
          <div className="pb-20">
            <h2 className="text-4xl font-bold text-[#fef4dc] mb-2">
              {selected?.title}
            </h2>
            <p className="text-lg text-gray-400">
              
              {selected?.year ? ` · ${selected.year}` : ""}
            </p>
            <p className="text-md text-gray-500 mt-1 italic">
              {selected?.material}
              {selected?.city && ` · ${selected.city}`}
              {selected?.country && `, ${selected.country}`}
              {selected?.useCase && ` · ${selected.useCase}`}
            </p>
          </div>
        </CreativePageLayout>
      )}

      {loading && (
        <p className="text-center text-gray-500 py-12">
          Cargando proyectos de diseño de producto...
        </p>
      )}
    </div>
  );
}
