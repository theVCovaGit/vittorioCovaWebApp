"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArtProjectExpandedView from "./artProjectExpandedView";

const BARCODE_PATH =
  "M5.14062 41.6719H0.328125V0.296875H5.14062V41.6719ZM9.84896 41.6719H7.44271V0.296875H9.84896V41.6719ZM16.6719 41.6719H14.2656V0.296875H16.6719V41.6719ZM28.0729 41.6719H25.6667V0.296875H28.0729V41.6719ZM39.5312 41.6719H34.776V0.296875H39.5312V41.6719ZM48.4844 41.6719H46.1094V0.296875H48.4844V41.6719ZM55.4792 41.6719H50.9948V0.296875H55.4792V41.6719ZM64.5677 41.6719H62.3281V0.296875H64.5677V41.6719ZM78.3438 41.6719H76.1042V0.296875H78.3438V41.6719ZM94.4167 41.6719H89.9792V0.296875H94.4167V41.6719ZM112.625 41.6719H105.995V0.296875H112.625V41.6719ZM83.0104 41.6719H80.7708V0.296875H83.0104V41.6719ZM103.714 41.6719H101.474V0.296875H103.714V41.6719ZM119.641 41.6719H115.057V0.296875H119.641V41.6719ZM140.359 41.6719H135.776V0.296875H140.359V41.6719ZM156.391 41.6719H151.807V0.296875H156.391V41.6719ZM163.177 41.6719H158.589V0.296875H163.177V41.6719ZM172.547 41.6719H167.964V0.296875H172.547V41.6719ZM181.427 41.6719H176.844V0.296875H181.427V41.6719ZM206.583 41.6719H202V0.296875H206.583V41.6719ZM241.052 41.6719H236.464V0.296875H241.052V41.6719ZM257.151 41.6719H252.568V0.296875H257.151V41.6719ZM264.234 41.6719H259.646V0.296875H264.234V41.6719ZM273.219 41.6719H268.635V0.296875H273.219V41.6719ZM284.708 41.6719H277.781V0.296875H284.708V41.6719ZM341.969 41.6719H335.042V0.296875H341.969V41.6719ZM296.089 41.6719H291.5V0.296875H296.089V41.6719ZM307.521 41.6719H302.932V0.296875H307.521V41.6719ZM332.734 41.6719H328.151V0.296875H332.734V41.6719ZM357.87 41.6719H353.286V0.296875H357.87V41.6719ZM190.599 41.6719H183.87V0.296875H190.599V41.6719ZM128.74 41.6719H126.5V0.296875H128.74V41.6719ZM144.896 41.6719H142.656V0.296875H144.896V41.6719ZM199.771 41.6719H197.531V0.296875H199.771V41.6719ZM215.927 41.6719H213.688V0.296875H215.927V41.6719ZM220.552 41.6719H218.312V0.296875H220.552V41.6719ZM229.557 41.6719H227.318V0.296875H229.557V41.6719ZM289.161 41.6719H286.922V0.296875H289.161V41.6719ZM316.604 41.6719H314.365V0.296875H316.604V41.6719ZM325.755 41.6719H323.516V0.296875H325.755V41.6719ZM346.516 41.6719H344.276V0.296875H346.516V41.6719ZM366.88 41.6719H364.641V0.296875H366.88V41.6719ZM245.63 41.6719H243.391V0.296875H245.63V41.6719ZM73.7656 41.6719H66.9948V0.296875H73.7656V41.6719Z";

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
}

function groupByCollection(projects: ArtProject[]): Map<string, ArtProject[]> {
  const map = new Map<string, ArtProject[]>();
  for (const p of projects) {
    const key = (p.collection || "").trim() || "Uncategorized";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }
  return map;
}

function materialLine(p: ArtProject): string {
  if (p.description?.trim()) return p.description;
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

  const byCollection = groupByCollection(projects);

  return (
    <div className="min-h-screen bg-[#F5EFDF] flex flex-col">
      {/* Spacer for fixed header */}
      <div className="h-20 flex-shrink-0" aria-hidden="true" />

      <div className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 md:py-16">
          {byCollection.size === 0 ? (
            <p className="font-blurlight text-[#4A413C] text-center py-16">
              No pieces yet.
            </p>
          ) : (
            Array.from(byCollection.entries()).map(([collectionName, items]) => (
              <section key={collectionName} className="mb-16 md:mb-24">
                <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 order-2 lg:order-1">
                    {items.map((p) => (
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
                    ))}
                  </div>
                  <div className="lg:w-56 xl:w-64 flex-shrink-0 order-1 lg:order-2">
                    <h2 className="font-blurlight font-bold text-[#4A413C] text-2xl md:text-3xl uppercase tracking-wide">
                      {collectionName}
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

      {/* Fixed footer: always visible at viewport bottom. Dimensions & link positioning match hero. */}
      <footer
        className="fixed bottom-0 left-0 right-0 bg-[#554943] font-blurlight z-50 pointer-events-auto flex flex-col items-end justify-end pr-[6rem] pb-4 pt-4"
        style={{ fontFamily: '"Blur Light", sans-serif', fontSize: "32px", letterSpacing: "-2.4px", lineHeight: "23px" }}
      >
        <div style={{ marginTop: -10 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 367 42"
            fill="none"
            width={367}
            height={42}
            className="block"
          >
            <path d={BARCODE_PATH} fill="#a08e80" />
          </svg>
        </div>
        <div
          style={{ width: 367, textAlign: "center", marginTop: 0 }}
          className="pointer-events-auto"
        >
          <span style={{ color: "#fec776" }}>
            <Link href="/contact" className="text-[#fec776] no-underline hover:text-white cursor-pointer">
              CONTACT
            </Link>
            <span> / </span>
            <Link href="/about" className="text-[#fec776] no-underline hover:text-white cursor-pointer">
              ABOUT
            </Link>
            <span> / </span>
            <Link href="/news" className="text-[#fec776] no-underline hover:text-white cursor-pointer">
              NEWS
            </Link>
          </span>
        </div>
      </footer>

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
