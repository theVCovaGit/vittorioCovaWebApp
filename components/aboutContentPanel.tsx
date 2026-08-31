"use client";

import { useEffect, useState, ReactNode } from "react";
import { AboutContent, defaultAboutContent, parseAboutContent } from "@/lib/pageContent";
import { ABOUT_UPDATED_EVENT } from "@/hooks/usePageContent";

const inputClass = "w-full p-2 border border-gray-400 rounded-md mb-2";
const labelClass = "block mb-1 font-minecraft text-sm text-[#FFF3DF]";

export default function AboutContentPanel({
  isActive,
  headerSlot,
}: {
  isActive: boolean;
  headerSlot?: ReactNode;
}) {
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;
    let cancelled = false;

    const fetchContent = async () => {
      try {
        const res = await fetch("/api/about", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data?.content) setContent(parseAboutContent(data.content));
      } catch (err) {
        console.error("❌ Error fetching about content:", err);
      }
    };

    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [isActive]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data?.error || "Could not save");
        return;
      }

      setContent(parseAboutContent(data.content));
      setStatus("Saved");
      window.dispatchEvent(new CustomEvent(ABOUT_UPDATED_EVENT));
    } catch (err) {
      console.error("❌ Error saving about content:", err);
      setStatus("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (saving) return;
    if (!confirm("Restore the original About text?")) return;
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch("/api/about", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.error || "Could not reset");
        return;
      }
      setContent(parseAboutContent(data.content));
      setStatus("Back to the original text");
      window.dispatchEvent(new CustomEvent(ABOUT_UPDATED_EVENT));
    } catch (err) {
      console.error("❌ Error resetting about content:", err);
      setStatus("Could not reset");
    } finally {
      setSaving(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className="mt-6">
      <h2 className="text-[#FFF3DF] text-xl font-microextend font-bold">About page</h2>
      {headerSlot && <div className="mt-3">{headerSlot}</div>}

      <div className="bg-[#554943] p-4 mt-4 text-black">
        <label className={labelClass}>Heading</label>
        <p className="mb-2 font-blurlight text-xs text-[#FFF3DF]/70">
          One line per row – desktop joins them into a sentence, mobile keeps the line breaks.
        </p>
        <textarea
          value={content.heading}
          onChange={(e) => setContent((prev) => ({ ...prev, heading: e.target.value }))}
          rows={3}
          className={inputClass}
        />

        <label className={`${labelClass} mt-4`}>Paragraph</label>
        <p className="mb-2 font-blurlight text-xs text-[#FFF3DF]/70">
          Written exactly as it appears on the page: leave a blank line between paragraphs, and any
          line breaks or spacing you type are kept. Wrap a word in *asterisks* to pick it out in the
          accent colour, e.g. when *God* walked the Earth.
        </p>
        <textarea
          value={content.body}
          onChange={(e) => setContent((prev) => ({ ...prev, body: e.target.value }))}
          rows={18}
          className={inputClass}
        />

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-black px-4 py-2 font-blurlight text-[#fff5e0]"
          >
            {saving ? "Saving…" : "Save About page"}
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            className="rounded-md border-2 border-black bg-transparent px-4 py-2 font-blurlight text-[#FFF3DF]"
          >
            Restore original text
          </button>
          {status && <span className="font-blurlight text-sm text-[#FFF3DF]">{status}</span>}
        </div>
      </div>
    </div>
  );
}
