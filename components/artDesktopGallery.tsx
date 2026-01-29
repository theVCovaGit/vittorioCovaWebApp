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

/** (collection, page) -> slots[0..3]. Admin uses global positions (1–4 page 1, 5–8 page 2, …); map to slot index with (position - 1) % 4. */
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
        const pos = p.position ?? 1;
        const slotIndex = Math.max(0, Math.min(3, (pos - 1) % 4));
        slots[slotIndex] = p;
      }
      out.push({ collection: col, page: pg, slots });
    }
  }
  return out;
}

function materialDimensionsLine(p: ArtProject): string {
  const mat = (p.materials || "").trim();
  const dim = (p.dimensions || "").trim();
  if (mat && dim) return `${mat} - ${dim}`;
  if (mat) return mat;
  if (dim) return dim;
  return "";
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
  /** Group by collection, flatten all pages into one grid per collection for perfect alignment. */
  const byCollection = (() => {
    const m = new Map<string, (ArtProject | null)[]>();
    for (const row of pageGrids) {
      const col = row.collection;
      const existing = m.get(col) ?? [];
      m.set(col, [...existing, ...row.slots]);
    }
    return Array.from(m.entries()).map(([collection, allSlots]) => ({ collection, allSlots }));
  })();

  const renderGrid = (slots: (ArtProject | null)[], keyPrefix: string) => (
    <div key={keyPrefix} className="flex-1 order-2 lg:order-1 min-w-0">
      <div className="grid grid-cols-2 gap-x-8 md:gap-x-10 gap-y-8 md:gap-y-10 items-start w-full max-w-4xl">
        {slots.map((p, slotIndex) =>
          p ? (
            <button
              key={p.id}
              type="button"
              className="group text-left bg-transparent border-0 p-0 cursor-pointer flex flex-col items-stretch w-full"
              onClick={() => {
                setSelectedProjectId(p.id);
                window.dispatchEvent(new CustomEvent("art-expanded-open"));
              }}
            >
              <div className="flex-shrink-0 w-full aspect-[4/3] bg-[#e8e0d5] overflow-hidden rounded-sm mb-3">
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
              <div className="min-h-0 flex flex-col items-stretch">
                <h3 className="font-blurlight font-bold text-[#4A413C] text-lg md:text-xl uppercase tracking-wide">
                  {p.title}
                </h3>
                {materialDimensionsLine(p) && (
                  <p className="font-blurlight text-[#4A413C]/80 text-sm mt-0.5">
                    {materialDimensionsLine(p)}
                  </p>
                )}
                <p
                  className={`font-blurlight text-sm mt-1 ${p.forSale !== false ? "text-[#C6898F] underline" : "text-[#4A413C]/60"}`}
                >
                  {p.forSale !== false ? "Available" : "Not available"}
                </p>
              </div>
            </button>
          ) : (
            <div key={`${keyPrefix}-empty-${slotIndex}`} className="w-full aspect-[4/3] invisible" aria-hidden="true" />
          )
        )}
      </div>
    </div>
  );

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
            byCollection.map(({ collection, allSlots }) => (
              <section key={collection} className="mb-16 md:mb-24">
                <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
                  {renderGrid(allSlots, `${collection}-grid`)}
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
