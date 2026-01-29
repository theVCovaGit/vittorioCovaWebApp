"use client";

import { useEffect, useState } from "react";
import ArtProjectExpandedView from "@/components/artProjectExpandedView";

interface ArtProject {
  id: number;
  type: "art";
  title: string;
  country: string;
  city: string;
  discipline: string;
  collection: string;
  year?: string;
  images: string[];
  icon?: string;
  position?: number;
  page?: number;
  forSale?: boolean;
  description?: string;
  price?: string;
  materials?: string;
  dimensions?: string;
}

/** Same grouping as desktop: by collection, then pages/slots. */
function buildCollectionGroups(projects: ArtProject[]): { collection: string; projects: ArtProject[] }[] {
  const byCollection = new Map<string, ArtProject[]>();
  for (const p of projects) {
    const col = (p.collection || "").trim() || "Uncategorized";
    if (!byCollection.has(col)) byCollection.set(col, []);
    byCollection.get(col)!.push(p);
  }
  return Array.from(byCollection.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([collection, list]) => ({
      collection,
      projects: list.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    }));
}

function materialDimensionsLine(p: ArtProject): string {
  const mat = (p.materials || "").trim();
  const dim = (p.dimensions || "").trim();
  if (mat && dim) return `${mat} - ${dim}`;
  if (mat) return mat;
  if (dim) return dim;
  return "";
}

/** Hand-drawn style arrow pointing right */
function ArrowRight() {
  return (
    <svg
      width={48}
      height={24}
      viewBox="0 0 48 24"
      fill="none"
      className="text-[#4A413C]"
      aria-hidden
    >
      <path
        d="M2 12h38m0 0l-6-6m6 6l-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ArtMobile() {
  const [projects, setProjects] = useState<ArtProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/art");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.projects) setProjects(data.projects);
      } catch (e) {
        console.error("Error fetching art:", e);
      }
    };
    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = buildCollectionGroups(projects);
  const allProjects = groups.flatMap((g) => g.projects);
  const uniqueDisciplines = Array.from(
    new Set(projects.map((p) => (p.discipline || "").trim()).filter(Boolean))
  ).slice(0, 4);

  return (
    <>
      <div className="min-h-screen bg-[#FFF3DF] flex flex-col">
        <div className="flex-1 flex min-h-0 pt-4 pb-4">
          {/* Left: collection title, categories, +, arrow */}
          <div className="flex-shrink-0 w-[38%] max-w-[160px] pl-4 pr-2 flex flex-col gap-4">
            <h2 className="font-blurlight font-bold text-[#4A413C] text-lg uppercase tracking-wide leading-tight">
              {groups.length > 0 ? groups[0].collection : "Collection"}
              <span className="text-[#4A413C]">.</span>
            </h2>
            <div className="flex flex-col gap-2">
              {uniqueDisciplines.length > 0
                ? uniqueDisciplines.map((d) => (
                    <span
                      key={d}
                      className="inline-block w-fit bg-[#DCBED3] text-[#4A413C] font-blurlight text-xs uppercase tracking-wide px-2 py-1 rounded-sm"
                    >
                      {d}
                    </span>
                  ))
                : (
                  <>
                    <span className="inline-block w-fit bg-[#DCBED3] text-[#4A413C] font-blurlight text-xs uppercase tracking-wide px-2 py-1 rounded-sm">
                      Animal Hide
                    </span>
                    <span className="inline-block w-fit bg-[#DCBED3] text-[#4A413C] font-blurlight text-xs uppercase tracking-wide px-2 py-1 rounded-sm">
                      Western Art
                    </span>
                  </>
                )}
            </div>
            <button
              type="button"
              className="w-8 h-8 flex-shrink-0 bg-red-600 rounded flex items-center justify-center text-white text-lg leading-none"
              aria-label="Add or expand"
            >
              +
            </button>
            <div className="mt-auto pt-2">
              <ArrowRight />
            </div>
          </div>

          {/* Right: horizontal scroll of art cards */}
          <div
            className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden scrollbar-hide -mr-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex gap-6 pl-2 pr-6 py-2 h-full items-stretch">
              {allProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className="flex-shrink-0 w-[72vw] max-w-[280px] flex flex-col text-left bg-transparent border-0 p-0 cursor-pointer"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    window.dispatchEvent(new CustomEvent("art-expanded-open"));
                  }}
                >
                  <div className="flex-shrink-0 w-full aspect-[4/3] border-4 border-[#4A413C] rounded-sm overflow-hidden bg-[#e8e0d5]">
                    {(project.icon || project.images?.[0]) ? (
                      <img
                        src={project.icon || project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-blurlight text-[#4A413C]/50 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="font-blurlight font-bold text-[#4A413C] text-base uppercase tracking-wide mt-2">
                    {project.title}
                  </h3>
                  {materialDimensionsLine(project) && (
                    <p className="font-blurlight text-[#4A413C]/80 text-xs mt-0.5 uppercase">
                      {materialDimensionsLine(project)}
                    </p>
                  )}
                  <p
                    className={`font-blurlight text-xs mt-1 w-fit px-2 py-0.5 rounded-sm ${
                      project.forSale !== false
                        ? "bg-[#DCBED3] text-[#4A413C]"
                        : "text-[#4A413C]/60"
                    }`}
                  >
                    {project.forSale !== false ? "Available" : "Not available"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedProjectId != null && (
        <ArtProjectExpandedView
          projectId={selectedProjectId}
          onClose={() => {
            setSelectedProjectId(null);
            window.dispatchEvent(new CustomEvent("art-expanded-close"));
          }}
        />
      )}
    </>
  );
}
