"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  id: number;
  date: string;
  title: string;
  description?: string;
  sortOrder?: number;
}

export default function NewsContentPanel({ isActive }: { isActive: boolean }) {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);

  const resetForm = () => {
    setDate("");
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  useEffect(() => {
    if (!isActive) return;

    const fetchItems = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (res.ok && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          console.error("❌ Unexpected response:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching news items:", err);
      }
    };

    fetchItems();
  }, [isActive]);

  const handleSubmit = async () => {
    if (!title || !title.trim()) {
      alert("Title is required");
      return;
    }

    const payload = {
      date: date.trim(),
      title: title.trim(),
      description: content.trim() || undefined,
      sortOrder: 0,
    };

    try {
      if (editingId) {
        const res = await fetch("/api/news", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (res.ok) {
          const data = await res.json();
          setItems((prev) =>
            prev.map((i) => (i.id === editingId ? { ...i, ...data.item } : i))
          );
          alert("News item updated");
          resetForm();
        } else {
          const err = await res.json();
          alert(err?.error || "Error updating news item");
        }
      } else {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setItems((prev) => [...prev, data.item]);
          alert("News item added");
          resetForm();
        } else {
          const err = await res.json();
          alert(err?.error || "Error adding news item");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error saving news item");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this news item?")) return;
    try {
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (selectedItem?.id === id) setSelectedItem(null);
        if (editingId === id) resetForm();
        alert("News item deleted");
      } else {
        const err = await res.json();
        alert(err?.error || "Error deleting news item");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting news item");
    }
  };

  if (!isActive) return null;

  return (
    <div className="mt-6">
      <h2 className="text-[#FFF3DF] text-xl font-microextend font-bold">
        {editingId ? "Edit news item" : "Add news item"}
      </h2>
      <div className="bg-[#554943] p-4 mt-4 text-black">
        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Date</label>
        <input
          type="text"
          placeholder="e.g. January 2026, 2025"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Title</label>
        <input
          type="text"
          placeholder="News title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Content</label>
        <textarea
          placeholder="News content / description"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2 min-h-[80px]"
          rows={4}
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-transparent border-2 border-black text-white py-2 px-4 rounded-md font-microextend"
          >
            {editingId ? "Actualizar" : "Submit"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-red-500 underline text-sm"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-transparent text-white p-4 rounded-md border border-gray-300"
              >
                <div className="text-[#a08e80] text-xs font-minecraft">{item.date}</div>
                <h4 className="font-microextend font-bold text-[#FFF3DF]">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-gray-300 mt-1 line-clamp-2">{item.description}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    className="bg-yellow-400 text-black py-1 px-3 rounded-md font-microextend text-sm"
                    onClick={() => {
                      setDate(item.date);
                      setTitle(item.title);
                      setContent(item.description || "");
                      setEditingId(item.id);
                      setSelectedItem(item);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white py-1 px-3 rounded-md font-microextend text-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-md border border-dashed border-gray-500/60 p-6 text-center text-sm text-gray-400">
            No news items yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
