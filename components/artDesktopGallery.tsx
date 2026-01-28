"use client";

import { useEffect, useState } from "react";
import ArtProjectExpandedView from "./artProjectExpandedView";
import CreativeSectionFooter from "./creativeSectionFooter";

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

/** (collection, page) -> slots[0..3] for positions 1–4. Order: collection asc, page asc. */
function buildPageGrid(projects: ArtProject[]): { collection: string; page: number; slots: (ArtProject | null)[] }[] {
  const byCollection = new Map<string, Map<number, ArtProject[]>>();
  for (const p of projects) {
    const col = (p.collection || "").trim() || "Uncategorized";
    const pg = p.page ?? 1;
    if (!byCollection.has(col)) byCollection.set(col, new Map());
    const perPage = byCollection.get(col)!;
    if (!perPage.has(pg)) perPage.set(pg, []);
    perPage.get(pg)!.push(p);
  }
  const out: { collection: string; page: number; slots: (ArtProject | null)[] }[] = [];
  const collections = Array.from(byCollection.keys()).sort();
  for (const col of collections) {
    const perPage = byCollection.get(col)!;
    const pages = Array.from(perPage.keys()).sort((a, b) => a - b);
    for (const pg of pages) {
      const list = perPage.get(pg)!;
      const slots: (ArtProject | null)[] = [null, null, null, null];
      for (const p of list) {
        const pos = Math.max(1, Math.min(4, p.position ?? 1));
        slots[pos - 1] = p;
      }
      out.push({ collection: col, page: pg, slots });
    }
  }
  return out;
}

function materialLine(p: ArtProject): string {
  const parts: string[] = [];
  if ((p.materials || "").trim()) parts.push((p.materials || "").trim().toUpperCase());
  if ((p.dimensions || "").trim()) parts.push((p.dimensions || "").trim());
  if (parts.length) return parts.join(" - ");
  if ((p.description || "").trim()) return p.description!;
  return p.discipline ? `${p.discipline.toUpperCase()}${p.year ? ` - ${p.year}` : ""}` : "";
}

export default function ArtDesktopGallery() {
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
    return () => { cancelled = true; };
  }, []);

  const pageGrids = buildPageGrid(projects);

  return (
    <div className="min-h-screen bg-[#F5EFDF] flex flex-col">
      {/* Spacer for fixed header */}
      <div className="h-20 flex-shrink-0" aria-hidden="true" />

      <div className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 md:py-16">
          {pageGrids.length === 0 ? (
            <p className="font-blurlight text-[#4A413C] text-center py-16">
              No pieces yet.
            </p>
          ) : (
            pageGrids.map(({ collection, page, slots }, idx) => (
              <section key={`${collection}-${page}-${idx}`} className="mb-16 md:mb-24">
                <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
                  <div className="flex-1 grid grid-cols-2 gap-8 md:gap-10 order-2 lg:order-1">
                    {slots.map((p, slotIndex) =>
                      p ? (
                        <button
                          key={p.id}
                          type="button"
                          className="group text-left bg-transparent border-0 p-0 cursor-pointer"
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            window.dispatchEvent(new CustomEvent("art-expanded-open"));
                          }}
                        >
                          <div className="aspect-[4/3] bg-[#e8e0d5] overflow-hidden rounded-sm mb-3">
                            {(p.icon || p.images?.[0]) ? (
                              <img
                                src={p.icon || p.images[0]}
                                alt={p.title}
                                className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-blurlight text-[#4A413C]/50 text-sm">
                                No image
                              </div>
                            )}
                          </div>
                          <h3 className="font-blurlight font-bold text-[#4A413C] text-lg md:text-xl uppercase tracking-wide">
                            {p.title}
                          </h3>
                          <p className="font-blurlight text-[#4A413C]/80 text-sm mt-0.5">
                            {materialLine(p)}
                          </p>
                          <p
                            className={`font-blurlight text-sm mt-1 ${p.forSale !== false ? "text-[#C6898F] underline" : "text-[#4A413C]/60"}`}
                          >
                            {p.forSale !== false ? "AVAILABLE" : "SOLD"}
                          </p>
                        </button>
                      ) : (
                        <div key={`${collection}-${page}-${idx}-empty-${slotIndex}`} className="aspect-[4/3] bg-[#e8e0d5]/50 rounded-sm" aria-hidden="true" />
                      )
                    )}
                  </div>
                  <div className="lg:w-56 xl:w-64 flex-shrink-0 order-1 lg:order-2">
                    <h2 className="font-blurlight font-bold text-[#4A413C] text-2xl md:text-3xl uppercase tracking-wide">
                      {collection}
                    </h2>
                    <p className="font-blurlight text-[#C6898F] text-sm md:text-base mt-1 underline">
                      Animal Hide Western Art
                    </p>
                  </div>
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      <CreativeSectionFooter />

      {selectedProjectId && (
        <ArtProjectExpandedView
          projectId={selectedProjectId}
          onClose={() => {
            setSelectedProjectId(null);
            window.dispatchEvent(new CustomEvent("art-expanded-close"));
          }}
        />
      )}
    </div>
  );
}
