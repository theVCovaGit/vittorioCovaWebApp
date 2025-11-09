"use client";
import { useEffect, useState } from "react";
import { ImageUpload, MultipleImagesUpload } from "@/components/imageUpload";
import IconUpload from "@/components/iconUpload";
import ProjectPosition from "@/components/projectPosition";

interface ArtProject {
  id: number;
  title: string;
  country: string;
  city: string;
  discipline: string;
  collection: string;
  year?: string;
  images: string[];
  icon?: string;
}

export default function ArtContentPanel({ isActive }: { isActive: boolean }) {
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [collection, setCollection] = useState("");
  const [year, setYear] = useState("");
  const [icon, setIcon] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [projects, setProjects] = useState<ArtProject[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setTitle("");
    setCountry("");
    setCity("");
    setDiscipline("");
    setCollection("");
    setYear("");
    setImages([]);
    setIcon("");
    setEditingId(null);
  };

  useEffect(() => {
    if (!isActive) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/art");
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
    if (!title || !country || !city || !discipline || !collection || images.length === 0) {
      alert("Faltan campos obligatorios");
      return;
    }

    const project: ArtProject = {
      id: editingId ?? Date.now(),
      title,
      country,
      city,
      discipline,
      collection,
      year,
      images,
      icon,
    };

    try {
      const res = await fetch("/api/art", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });

      if (res.ok) {
        alert(editingId ? "Proyecto actualizado" : "Proyecto publicado");
        setProjects((prev) =>
          editingId ? prev.map((p) => (p.id === editingId ? project : p)) : [...prev, project]
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
      const res = await fetch("/api/art", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          icon: projectToDelete?.icon || "",
        }),
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
        {editingId ? "Edit art project" : "Add new art project"}
      </h2>
      <div className="bg-[#5c4b4a] p-4 mt-4 text-black">
        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Discipline</label>
        <input
          type="text"
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          placeholder="e.g. Painting, Sculpture"
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Collection</label>
        <input
          type="text"
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
          placeholder="e.g. Private, Museum, Gallery"
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Year</label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Icon</label>
        <IconUpload onUpload={setIcon} currentIcon={icon} label="Icon" />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Project Images</label>
        <MultipleImagesUpload onUpload={setImages} currentImages={images} />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF] mt-4">Project position</label>
        <ProjectPosition 
          onPositionSelect={(position) => console.log('Selected position:', position)}
          currentPosition={1}
          currentPage={1}
          onPageChange={(page) => console.log('Page changed:', page)}
        />

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

      {projects.length > 0 && (
        <div className="mt-6 space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 text-white p-4 rounded-md shadow-md">
              {Array.isArray(project.images) && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {project.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`imagen ${i}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
              <h4 className="text-lg font-bold">{project.title}</h4>
              <p className="text-sm text-gray-400">{project.discipline} · {project.collection}</p>
              <p className="text-gray-300 mt-2">
                {project.city}, {project.country} {project.year && `· ${project.year}`}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  className="bg-yellow-400 text-black py-1 px-3 rounded-md"
                  onClick={() => {
                    setTitle(project.title);
                    setCountry(project.country);
                    setCity(project.city);
                    setDiscipline(project.discipline);
                    setCollection(project.collection);
                    setYear(project.year || "");
                    setIcon(project.icon || "");
                    setImages(project.images);
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
