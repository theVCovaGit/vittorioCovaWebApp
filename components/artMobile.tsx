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
  collectionDescription?: string;
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
  const firstGroup = groups[0];
  const collectionDescription = firstGroup?.projects.find((p) => (p.collectionDescription || "").trim())?.collectionDescription ?? firstGroup?.projects[0]?.collectionDescription ?? "";

  return (
    <>
      {/* Fixed viewport "window" – we stay here; content scrolls past (pulled in) */}
      <div
        className="fixed left-0 right-0 bottom-0 overflow-x-auto overflow-y-hidden bg-[#FFF3DF] scrollbar-hide"
        style={{
          top: "var(--mobile-header-height, 0)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          touchAction: "pan-x",
        }}
      >
        {/* One wide treadmill strip – left panel + all cards in a row */}
        <div
          className="flex flex-row flex-nowrap items-stretch min-h-full bg-[#FFF3DF] w-max"
          style={{ minHeight: "100vh" }}
        >
          {/* Left: collection title, collection description, arrow */}
          <div className="flex-shrink-0 w-[72%] max-w-[340px] pl-24 pr-8 pt-[38vh] pb-4 flex flex-col gap-4">
            <h2 className="font-blurlight font-bold text-[#4A413C] text-lg uppercase tracking-wide leading-tight">
              {groups.length > 0 ? groups[0].collection : "Collection"}
              <span className="text-[#4A413C]">.</span>
            </h2>
            {collectionDescription ? (
              <p className="font-blurlight text-[#4A413C] text-sm leading-relaxed">
                {collectionDescription}
              </p>
            ) : null}
            <div className="mt-auto pt-2">
              <ArrowRight />
            </div>
          </div>

          {/* Cards in a single row – pulled into view as you scroll */}
          <div className="flex flex-row flex-nowrap gap-6 pl-4 pr-[30vw] py-4 items-start">
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
