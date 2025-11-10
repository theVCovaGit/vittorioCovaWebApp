"use client";

import { useEffect, useState } from "react";
import { MultipleImagesUpload } from "@/components/imageUpload";
import IconUpload from "@/components/iconUpload";
import ProjectPosition from "@/components/projectPosition";

interface FilmProject {
  id: number;
  type: "film";
  title: string;
  icon?: string;
  images: string[];
  year?: string;
  countries: string;
  cities: string;
  genre: string;
  category: string; // e.g. "short film", "full film"
}

export default function FilmContentPanel({ isActive }: { isActive: boolean }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [year, setYear] = useState("");
  const [countries, setCountries] = useState("");
  const [cities, setCities] = useState("");
  const [genre, setGenre] = useState("");
  const [category, setCategory] = useState("");
  const [projects, setProjects] = useState<FilmProject[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setTitle("");
    setIcon("");
    setImages([]);
    setYear("");
    setCountries("");
    setCities("");
    setGenre("");
    setCategory("");
    setEditingId(null);
  };

  useEffect(() => {
    if (!isActive) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/film");
        const data = await res.json();
        if (res.ok && Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          console.error("❌ Unexpected response:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [isActive]);

  const handleSubmit = async () => {
    if (!title || images.length === 0 || !countries || !cities || !genre || !category) {
      alert("Faltan campos obligatorios");
      return;
    }

    const project: FilmProject = {
      id: editingId ?? Date.now(),
      type: "film",
      title,
      icon,
      images,
      year,
      countries,
      cities,
      genre,
      category,
    };

    try {
      const res = await fetch("/api/film", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });

      if (res.ok) {
        alert(editingId ? "Proyecto actualizado" : "Proyecto publicado");
        setProjects((prev) =>
          editingId
            ? prev.map((p) => (p.id === editingId ? project : p))
            : [...prev, project]
        );
        resetForm();
      } else {
        const err = await res.json();
        console.error(err);
        alert("Error al guardar el proyecto");
      }
    } catch (err) {
      console.error(err);
      alert("Error inesperado");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

    const projectToDelete = projects.find((p) => p.id === id);

    try {
      const res = await fetch("/api/film", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, icon: projectToDelete?.icon || "" }),
      });

      if (res.ok) {
        alert("Proyecto eliminado");
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (editingId === id) resetForm();
      } else {
        const err = await res.json();
        console.error(err);
        alert("Error al eliminar");
      }
    } catch (err) {
      console.error(err);
      alert("Error inesperado");
    }
  };

  if (!isActive) return null;

  return (
    <div className="mt-6">
      <h2 className="text-[#FFF3DF] text-xl font-basica">
        {editingId ? "Edit project" : "Add new project"}
      </h2>
      <div className="bg-[#5c4b4a] p-4 mt-4 text-black">
        {/* Inputs */}
        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Title</label>
        <input
          type="text"
          placeholder="Film title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Year</label>
        <input
          type="text"
          placeholder="e.g. 2024"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Countries</label>
        <input
          type="text"
          placeholder="e.g. Mexico, France"
          value={countries}
          onChange={(e) => setCountries(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Cities</label>
        <input
          type="text"
          placeholder="e.g. CDMX, Paris"
          value={cities}
          onChange={(e) => setCities(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Genre</label>
        <input
          type="text"
          placeholder="e.g. Drama"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Category</label>
        <input
          type="text"
          placeholder="e.g. Short film"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Icon</label>
        <IconUpload onUpload={setIcon} currentIcon={icon} label="Icon" />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Images</label>
        <MultipleImagesUpload onUpload={setImages} currentImages={images} />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF] mt-4">Project position</label>
        <ProjectPosition 
          onPositionSelect={(position) => console.log('Selected position:', position)}
          currentPosition={1}
          currentPage={1}
          onPageChange={(page) => console.log('Page changed:', page)}
        />

        {/* Submit / Cancel */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-transparent border-2 border-black text-white py-2 px-4 rounded-md"
          >
            {editingId ? "Actualizar" : "Submit"}
          </button>
          {editingId && (
            <button onClick={resetForm} className="text-red-500 underline text-sm">
              Cancelar edición
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {projects.length > 0 && (
        <div className="mt-6 space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 text-white p-4 rounded-md shadow-md">
              {project.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {project.images.map((img, i) => (
                    <img key={i} src={img} alt={`image ${i}`} className="w-full h-32 object-cover rounded-md" />
                  ))}
                </div>
              )}
              <h4 className="text-lg font-bold">{project.title}</h4>
              <p className="text-sm text-gray-300">{project.genre} · {project.category}</p>
              <p className="text-sm text-gray-400">
                {project.cities}, {project.countries} {project.year && `· ${project.year}`}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  className="bg-yellow-400 text-black py-1 px-3 rounded-md"
                  onClick={() => {
                    setTitle(project.title);
                    setIcon(project.icon || "");
                    setImages(project.images);
                    setYear(project.year || "");
                    setCountries(project.countries);
                    setCities(project.cities);
                    setGenre(project.genre);
                    setCategory(project.category);
                    setEditingId(project.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white py-1 px-3 rounded-md"
                  onClick={() => handleDelete(project.id)}
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
