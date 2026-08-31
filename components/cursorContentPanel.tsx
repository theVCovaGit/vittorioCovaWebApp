"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { CURSOR_UPDATED_EVENT } from "@/hooks/useCustomCursor";

/** Same box the cursor is drawn in across the site. */
const CURSOR_BOX = 28;

export default function CursorContentPanel({
  isActive,
  headerSlot,
}: {
  isActive: boolean;
  headerSlot?: ReactNode;
}) {
  const [svg, setSvg] = useState<string | null>(null);
  const [pending, setPending] = useState<{ name: string; svg: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isActive) return;
    let cancelled = false;

    const fetchCursor = async () => {
      try {
        const res = await fetch("/api/cursor", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setSvg(typeof data?.svg === "string" ? data.svg : null);
      } catch (err) {
        console.error("❌ Error fetching cursor:", err);
      }
    };

    fetchCursor();
    return () => {
      cancelled = true;
    };
  }, [isActive]);

  const readFile = async (file: File | undefined) => {
    setError(null);
    if (!file) return;

    const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    if (!isSvg) {
      setError("Only SVG files can be used as a cursor.");
      return;
    }

    const text = await file.text();
    if (!text.toLowerCase().includes("<svg")) {
      setError("That file does not look like an SVG.");
      return;
    }

    setPending({ name: file.name, svg: text });
  };

  const handleSave = async () => {
    if (!pending || saving) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/cursor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ svg: pending.svg }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Could not save the cursor");
        return;
      }

      setSvg(data.svg);
      setPending(null);
      if (inputRef.current) inputRef.current.value = "";
      window.dispatchEvent(new CustomEvent(CURSOR_UPDATED_EVENT));
    } catch (err) {
      console.error("❌ Error saving cursor:", err);
      setError("Could not save the cursor");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/cursor", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Could not reset the cursor");
        return;
      }
      setSvg(null);
      setPending(null);
      if (inputRef.current) inputRef.current.value = "";
      window.dispatchEvent(new CustomEvent(CURSOR_UPDATED_EVENT));
    } catch (err) {
      console.error("❌ Error resetting cursor:", err);
      setError("Could not reset the cursor");
    } finally {
      setSaving(false);
    }
  };

  if (!isActive) return null;

  const previewSvg = pending?.svg ?? svg;

  return (
    <div className="mt-6">
      <h2 className="text-[#FFF3DF] text-xl font-microextend font-bold">Site cursor</h2>
      {headerSlot && <div className="mt-3">{headerSlot}</div>}

      <div className="bg-[#554943] p-4 mt-4 text-black">
        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Cursor file</label>
        <p className="mb-3 font-blurlight text-xs text-[#FFF3DF]/70">
          Drop an SVG roughly 14 × 28 (twice as tall as it is wide) – it is scaled into the
          28 × 28 px cursor box automatically, and recoloured to the opposite of whatever it sits on.
          Leave it empty to keep the built-in + cursor.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            readFile(e.dataTransfer.files?.[0]);
          }}
          className={`relative flex h-40 w-full items-center justify-center overflow-hidden rounded-md border bg-transparent transition ${
            dragging ? "border-[#FFF3DF]" : "border-gray-300 hover:border-[#FFF3DF]"
          }`}
        >
          {previewSvg ? (
            <div className="flex flex-col items-center gap-3">
              {/* Shown at the real 28 x 28 size, and again enlarged */}
              <div className="flex items-end gap-6">
                <div
                  style={{ width: CURSOR_BOX, height: CURSOR_BOX, color: "#FFF3DF" }}
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                />
                <div
                  style={{ width: CURSOR_BOX * 3, height: CURSOR_BOX * 3, color: "#FFF3DF" }}
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                />
              </div>
              <span className="font-blurlight text-xs text-[#FFF3DF]/70">
                {pending ? `${pending.name} – not saved yet` : "Current site cursor"}
              </span>
            </div>
          ) : (
            <div className="pointer-events-none flex flex-col items-center justify-center text-center text-gray-300">
              <span className="text-lg font-semibold uppercase tracking-wide">Cursor</span>
              <span className="mt-2 text-sm text-gray-400">Drag and drop or click to upload an SVG</span>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={(e) => readFile(e.target.files?.[0])}
            disabled={saving}
          />
        </div>

        {error && <p className="mt-2 font-blurlight text-sm text-[#FFF3DF]">{error}</p>}

        <div className="mt-3 flex gap-3">
          {pending && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-black px-4 py-2 font-blurlight text-[#fff5e0] transition"
            >
              {saving ? "Saving…" : "Use this cursor"}
            </button>
          )}
          {svg && !pending && (
            <button
              onClick={handleReset}
              disabled={saving}
              className="rounded-md border-2 border-black bg-transparent px-4 py-2 font-blurlight text-black transition"
            >
              {saving ? "Working…" : "Back to the built-in cursor"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
