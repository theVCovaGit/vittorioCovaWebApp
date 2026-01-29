"use client";

import { useEffect, useRef, useState } from "react";
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
  const verticalScrollRef = useRef<HTMLDivElement>(null);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** On scroll end: snap to nearest section (no in-between – either next category or bounce back) */
  useEffect(() => {
    const el = verticalScrollRef.current;
    if (!el || groups.length === 0) return;

    const sectionHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    const snapToNearest = () => {
      const top = el.scrollTop;
      const index = Math.round(top / sectionHeight);
      const clamped = Math.max(0, Math.min(index, groups.length - 1));
      const targetTop = clamped * sectionHeight;
      if (Math.abs(el.scrollTop - targetTop) > 1) {
        el.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    };

    const scheduleSnap = () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = setTimeout(snapToNearest, 100);
    };

    el.addEventListener("scroll", scheduleSnap, { passive: true });
    el.addEventListener("scrollend", snapToNearest);
    el.addEventListener("touchend", scheduleSnap, { passive: true });

    return () => {
      el.removeEventListener("scroll", scheduleSnap);
      el.removeEventListener("scrollend", snapToNearest);
      el.removeEventListener("touchend", scheduleSnap);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [groups.length]);

  /** Format collection name as two lines (first word / rest + period) */
  function collectionTitleLines(raw: string) {
    const space = raw.indexOf(" ");
    if (space === -1) return { line1: raw + ".", line2: null };
    return {
      line1: raw.slice(0, space),
      line2: raw.slice(space + 1).trim() + ".",
    };
  }

  function collectionDesc(group: { collection: string; projects: ArtProject[] }) {
    return group.projects.find((p) => (p.collectionDescription || "").trim())?.collectionDescription ?? group.projects[0]?.collectionDescription ?? "";
  }

  return (
    <>
      {/* Vertical scroll: on scroll end snap to nearest section (bounce back or go to next category) */}
      <div
        ref={verticalScrollRef}
        className="fixed left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden bg-[#FFF3DF] scrollbar-hide"
        style={{
          top: "var(--mobile-header-height, 0)",
          height: "calc(100vh - var(--mobile-header-height, 0))",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {groups.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center px-4">
            <p className="font-blurlight text-[#4A413C]">No collections yet.</p>
          </div>
        ) : (
          groups.map((group) => {
            const { line1, line2 } = collectionTitleLines(group.collection);
            const desc = collectionDesc(group);
            return (
              <section
                key={group.collection}
                className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide flex-shrink-0"
                style={{
                  height: "100vh",
                  scrollSnapAlign: "start",
                  scrollSnapStop: "always",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                  overscrollBehaviorX: "contain",
                }}
              >
                {/* One horizontal strip: title/description + all projects (whole screen scrolls horizontally) */}
                <div
                  className="flex flex-row flex-nowrap items-stretch h-full w-max"
                  style={{ minHeight: "100vh" }}
                >
                  {/* Left: this collection's title + description */}
                  <div className="flex-shrink-0 w-[72%] max-w-[340px] pl-24 pr-8 pt-[38vh] pb-4 flex flex-col gap-4">
                    <h2 className="font-blurlight font-bold text-[#4A413C] text-lg uppercase tracking-wide leading-tight flex flex-col">
                      <span>{line1}</span>
                      {line2 != null ? <span>{line2}</span> : null}
                    </h2>
                    {desc ? (
                      <p className="font-blurlight text-[#4A413C] text-sm leading-relaxed bg-[#facbcc] px-2 py-1 rounded-sm w-fit">
                        {desc}
                      </p>
                    ) : null}
                  </div>

                  {/* Projects in a row – scroll with the whole strip */}
                  <div className="flex flex-row flex-nowrap gap-6 pl-4 pr-[30vw] py-4 items-start">
                  {group.projects.map((project) => (
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
                        <p className="font-blurlight text-[#4A413C]/80 text-xs mt-0.5 uppercase bg-[#facbcc] px-2 py-0.5 rounded-sm w-fit">
                          {materialDimensionsLine(project)}
                        </p>
                      )}
                      <p
                        className={`font-blurlight text-xs mt-1 w-fit px-2 py-0.5 rounded-sm ${
                          project.forSale !== false
                            ? "bg-[#facbcc] text-[#4A413C]"
                            : "text-[#4A413C]/60"
                        }`}
                      >
                        {project.forSale !== false ? "Available" : "Not available"}
                      </p>
                    </button>
                  ))}
                  </div>
                </div>
              </section>
            );
          })
        )}
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
