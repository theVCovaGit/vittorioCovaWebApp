"use client";

import { useEffect, useState } from "react";
import { ImageUpload, MultipleImagesUpload } from "@/components/imageUpload";

interface ProductDesignItem {
  id: number;
  title: string;
  images: string[];
  icon?: string;
  year?: number;
  country?: string;
  city?: string;
  material?: string;
  useCase?: string;
}

export default function ProductDesignContentPanel({ isActive }: { isActive: boolean }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [items, setItems] = useState<ProductDesignItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [year, setYear] = useState<number | undefined>(undefined);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [material, setMaterial] = useState("");
  const [useCase, setUseCase] = useState("");

  const resetForm = () => {
    setTitle("");
    setIcon("");
    setImages([]);
    setYear(undefined);
    setCountry("");
    setCity("");
    setMaterial("");
    setUseCase("");
    setEditingId(null);
  };

  useEffect(() => {
    if (!isActive) return;
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/productdesign");
        const data = await res.json();
        if (res.ok && Array.isArray(data.projects)) {
          setItems(data.projects);
        } else {
          console.error("❌ Unexpected response:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching items:", err);
      }
    };
    fetchItems();
  }, [isActive]);

  const handleSubmit = async () => {
    if (!title || images.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const item: ProductDesignItem = {
      id: editingId ?? Date.now(),
      title,
      images,
      icon,
      year,
      country,
      city,
      material,
      useCase,
    };

    try {
      const res = await fetch("/api/productdesign", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: item }),
      });

      if (res.ok) {
        alert(editingId ? "Product updated!" : "Product added!");
        setItems((prev) =>
          editingId ? prev.map((i) => (i.id === editingId ? item : i)) : [...prev, item]
        );
        resetForm();
      } else {
        const err = await res.json();
        console.error(err);
        alert("Error saving product.");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const itemToDelete = items.find((i) => i.id === id);

    try {
      const res = await fetch("/api/productdesign", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, icon: itemToDelete?.icon || "" }),
      });

      if (res.ok) {
        alert("Product deleted!");
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (editingId === id) resetForm();
      } else {
        const err = await res.json();
        console.error(err);
        alert("Error deleting product.");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error.");
    }
  };

  if (!isActive) return null;

  return (
    <div className="mt-6">
      <h2 className="text-[#FFF3DF] text-xl font-basica">
        {editingId ? "Edit Product" : "Add New Product"}
      </h2>

      <div className="bg-[#5c4b4a] p-4 mt-4 text-black">
        {/* FORM INPUTS */}
        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Year</label>
        <input
          type="number"
          value={year ?? ""}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Material</label>
        <input
          type="text"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Use Case</label>
        <input
          type="text"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Icon</label>
        <ImageUpload onUpload={setIcon} currentImage={icon} type="icon" />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Images</label>
        <MultipleImagesUpload onUpload={setImages} currentImages={images} />

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-4 rounded-md"
          >
            {editingId ? "Update Product" : "Add Product Design project"}
          </button>
          {editingId && (
            <button onClick={resetForm} className="text-red-500 underline text-sm">
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* ITEMS LIST */}
      {items.length > 0 && (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 text-white p-4 rounded-md shadow-md"
            >
              {Array.isArray(item.images) && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {item.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Image ${i}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
              <h4 className="text-lg font-bold">{item.title}</h4>
              <p className="text-sm text-gray-400">
                {item.year && `🗓 ${item.year}`} {item.city && `📍 ${item.city}`}, {item.country}
              </p>
              <p className="text-sm text-gray-400">
                {item.material && `🧱 ${item.material}`} {item.useCase && ` · 🧰 ${item.useCase}`}
              </p>
              

              <div className="flex gap-2 mt-3">
                <button
                  className="bg-yellow-400 text-black py-1 px-3 rounded-md"
                  onClick={() => {
                    setTitle(item.title);
                    setIcon(item.icon || "");
                    setImages(item.images);
                    setYear(item.year);
                    setCountry(item.country || "");
                    setCity(item.city || "");
                    setMaterial(item.material || "");
                    setUseCase(item.useCase || "");
                    setEditingId(item.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white py-1 px-3 rounded-md"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
