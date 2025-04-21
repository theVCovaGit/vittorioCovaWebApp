"use client";
import { useEffect, useState } from "react";
import {ImageUpload, MultipleImagesUpload} from "@/components/imageUpload";



export default function ArchitectureContentPanel({ isActive }: { isActive: boolean }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("residencial");
  const [icon, setIcon] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("residencial");
    setImages([]);
    setEditingId(null);
  };

  // GET: Fetch all projects
  useEffect(() => {
    if (!isActive) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/architecture");
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

  // POST or PUT
  const handleSubmit = async () => {
    if (!title || !description || images.length === 0) {
      alert("Faltan campos");
      return;
    }

    const project = {
      id: editingId ?? Date.now(),
      title,
      description,
      category,
      images,
      icon,
    };

    try {
      const res = await fetch("/api/architecture", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });

      if (res.ok) {
        alert(editingId ? "Proyecto actualizado" : "Proyecto publicado");
        setProjects((prev) => {
          return editingId
            ? prev.map((p) => (p.id === editingId ? project : p))
            : [...prev, project];
        });
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

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
  
    const projectToDelete = projects.find((p) => p.id === id); // 👈 grab icon
  
    try {
      const res = await fetch("/api/architecture", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          icon: projectToDelete?.icon || "", // ✅ include the icon
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
        {editingId ? "Edit project" : "Add new project"}
      </h2>
      <div className="bg-[#5c4b4a] p-4 mt-4 text-black">
        <label className="block mb-1 font-basica text-sm text-[#FFF3DF]">Title</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />
        <label className="block mb-1 font-basica text-sm text-[#FFF3DF]">Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />
        <label className="block mb-1 font-basica text-sm text-[#FFF3DF]">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        >
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
          <option value="cultural">Cultural</option>
          <option value="otros">Otros</option>
        </select>
        <label className="block mb-1 font-basica text-sm text-[#FFF3DF]">Icon</label>
        <ImageUpload onUpload={setIcon} currentImage={icon} type="icon" />
        <label className="block mb-1 font-basica text-sm text-[#FFF3DF]">Project images</label>
        <MultipleImagesUpload onUpload={setImages} currentImages={images} />

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-4 rounded-md"
          >
            {editingId ? "Actualizar" : "Publicar Proyecto"}
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

      {projects.length > 0 && (
        <div className="mt-6 space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 text-white p-4 rounded-md shadow-md">
              {Array.isArray(project.images) && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {project.images.map((img: string, i: number) => (
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
              <p className="text-sm text-gray-400">{project.category}</p>
              <p className="text-gray-300 mt-2">{project.description}</p>
              <div className="flex gap-2 mt-3">
                <button
                  className="bg-yellow-400 text-black py-1 px-3 rounded-md"
                  onClick={() => {
                    setTitle(project.title);
                    setDescription(project.description);
                    setCategory(project.category);
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
