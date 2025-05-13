"use client";

import { useEffect, useState } from "react";
import CreativePageLayout from "@/components/creativePageLayout";
import ProjectsList from "@/components/projectsList";
import Image from "next/image";

interface ArchitectureProject {
  id: number;
  title: string;
  description: string;
  category: string;
  images: string[];
}

export default function Architecture() {
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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

  const featuredImage =
    selected?.images?.[0] || "/images/fallback.jpg";

    return (
      <div className="min-h-screen bg-[#5c4b4a]">
        {!loading && (
          <CreativePageLayout
            heroImage={
              <Image
                src={featuredImage}
                alt="Architecture hero image"
                fill
                className="object-cover object-center"
              />
            }
            projectList={
              <ProjectsList
                projects={projects}
                selectedId={selected?.id}
                onSelect={(id) => setSelectedId(id)}
              />
            }
          >
            <div className="pb-20">
              <h2 className="text-4xl font-bold text-[#19333F] mb-2">
                {selected?.title}
              </h2>
              <p className="text-lg text-gray-400">{selected?.description}</p>
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
