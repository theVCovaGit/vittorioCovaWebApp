"use client";

import { useEffect, useState, ReactNode } from "react";
import { ContactContent, defaultContactContent, parseContactContent } from "@/lib/pageContent";
import { CONTACT_UPDATED_EVENT } from "@/hooks/usePageContent";

const inputClass = "w-full p-2 border border-gray-400 rounded-md mb-2";
const labelClass = "block mb-1 font-minecraft text-sm text-[#FFF3DF]";

export default function ContactContentPanel({
  isActive,
  headerSlot,
}: {
  isActive: boolean;
  headerSlot?: ReactNode;
}) {
  const [content, setContent] = useState<ContactContent>(defaultContactContent);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;
    let cancelled = false;

    const fetchContent = async () => {
      try {
        const res = await fetch("/api/contact", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data?.content) setContent(parseContactContent(data.content));
      } catch (err) {
        console.error("❌ Error fetching contact content:", err);
      }
    };

    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [isActive]);

  const setListItem = (field: "locations" | "copyright", index: number, value: string) =>
    setContent((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));

  const addListItem = (field: "locations" | "copyright") =>
    setContent((prev) => ({ ...prev, [field]: [...prev[field], ""] }));

  const removeListItem = (field: "locations" | "copyright", index: number) =>
    setContent((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setStatus(null);

    try {
      const payload: ContactContent = {
        instagram: content.instagram.trim(),
        email: content.email.trim(),
        locations: content.locations.map((l) => l.trim()).filter(Boolean),
        copyright: content.copyright.map((l) => l.trim()).filter(Boolean),
      };

      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: payload }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data?.error || "Could not save");
        return;
      }

      setContent(parseContactContent(data.content));
      setStatus("Saved");
      window.dispatchEvent(new CustomEvent(CONTACT_UPDATED_EVENT));
    } catch (err) {
      console.error("❌ Error saving contact content:", err);
      setStatus("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (saving) return;
    if (!confirm("Restore the original Contact details?")) return;
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.error || "Could not reset");
        return;
      }
      setContent(parseContactContent(data.content));
      setStatus("Back to the original details");
      window.dispatchEvent(new CustomEvent(CONTACT_UPDATED_EVENT));
    } catch (err) {
      console.error("❌ Error resetting contact content:", err);
      setStatus("Could not reset");
    } finally {
      setSaving(false);
    }
  };

  const renderList = (field: "locations" | "copyright", label: string, hint: string) => (
    <>
      <label className={`${labelClass} mt-4`}>{label}</label>
      <p className="mb-2 font-blurlight text-xs text-[#FFF3DF]/70">{hint}</p>
      {content[field].map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => setListItem(field, index, e.target.value)}
            className={inputClass}
          />
          <button
            onClick={() => removeListItem(field, index)}
            className="mt-1 rounded-md border border-black bg-transparent px-2 py-1 font-blurlight text-xs text-[#FFF3DF]"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() => addListItem(field)}
        className="mb-2 rounded-md border-2 border-black bg-transparent px-4 py-1 font-blurlight text-sm text-[#FFF3DF]"
      >
        Add {label.toLowerCase().replace(/s$/, "")}
      </button>
    </>
  );

  if (!isActive) return null;

  return (
    <div className="mt-6">
      <h2 className="text-[#FFF3DF] text-xl font-microextend font-bold">Contact page</h2>
      {headerSlot && <div className="mt-3">{headerSlot}</div>}

      <div className="bg-[#554943] p-4 mt-4 text-black">
        <label className={labelClass}>Instagram</label>
        <input
          type="text"
          value={content.instagram}
          onChange={(e) => setContent((prev) => ({ ...prev, instagram: e.target.value }))}
          placeholder="@vittoriocova_studio"
          className={inputClass}
        />

        <label className={labelClass}>Email</label>
        <input
          type="text"
          value={content.email}
          onChange={(e) => setContent((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="studio@vittoriocova.com"
          className={inputClass}
        />

        {renderList("locations", "Locations", "Shown in a row, separated by | on the page.")}
        {renderList("copyright", "Copyright", "One line each, printed under the locations.")}

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-black px-4 py-2 font-blurlight text-[#fff5e0]"
          >
            {saving ? "Saving…" : "Save Contact page"}
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            className="rounded-md border-2 border-black bg-transparent px-4 py-2 font-blurlight text-[#FFF3DF]"
          >
            Restore original details
          </button>
          {status && <span className="font-blurlight text-sm text-[#FFF3DF]">{status}</span>}
        </div>
      </div>
    </div>
  );
}
