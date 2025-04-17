"use client";

import { useEffect, useState } from "react";
import CreativePageLayout from "@/components/creativePageLayout";

interface ArchitectureProject {
  id: number;
  title: string;
  description: string;
  category: string;
  images: string[];
}

export default function Architecture() {
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
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

  const featuredImage =
    projects.length > 0 && projects[0].images?.length > 0
      ? projects[0].images[0]
      : "/images/fallback.jpg";

  return (
    <CreativePageLayout
      heroImage={
        <img
          src={featuredImage}
          alt="Architecture hero image"
          className="w-full h-full object-cover object-center absolute top-0 left-0 z-0"
        />
      }
    >
      {loading ? (
        <p className="text-center text-gray-500 py-12">Cargando proyectos de arquitectura...</p>
      ) : (
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-10 pb-20">
          {projects.map((project) => (
            <div key={project.id} className="w-full md:w-[45%] lg:w-[30%]">
              
              <h2 className="text-xl font-bold text-[#19333F]">{project.title}</h2>
              
            </div>
          ))}
        </div>
      )}
    </CreativePageLayout>
  );
}
