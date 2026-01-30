"use client";

import { useEffect, useState } from "react";
import IconUpload from "@/components/iconUpload";
import FilmProjectPosition from "@/components/filmProjectPosition";

interface FilmProject {
  id: number;
  type: "film";
  title: string;
  icon?: string;
  year?: string;
  registration?: string;
  synapsis?: string;
  length?: string;
  position?: number;
  page?: number;
}

export default function FilmContentPanel({ isActive }: { isActive: boolean }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string>("");
  const [year, setYear] = useState("");
  const [registration, setRegistration] = useState("");
  const [synapsis, setSynapsis] = useState("");
  const [length, setLength] = useState("");
  const [projects, setProjects] = useState<FilmProject[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [position, setPosition] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<FilmProject | null>(null);

  const resetForm = () => {
    setTitle("");
    setIcon("");
    setYear("");
    setRegistration("");
    setSynapsis("");
    setLength("");
    setPosition(1);
    setPage(1);
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
          const currentSelection = data.projects.find(
            (project: FilmProject) =>
              project.position === position && (project.page || 1) === page
          );
          setSelectedProject(currentSelection ?? null);
        } else {
          console.error("❌ Unexpected response:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [isActive]);

  useEffect(() => {
    const match = projects.find(
      (project) =>
        project.position === position && (project.page || 1) === page
    );
    setSelectedProject(match ?? null);
  }, [projects, position, page]);

  const handleSubmit = async () => {
    if (!title) {
      alert("Faltan campos obligatorios");
      return;
    }

    const project: FilmProject = {
      id: editingId ?? Date.now(),
      type: "film",
      title,
      icon,
      year,
      registration,
      synapsis,
      length,
      position,
      page,
    };

    try {
      const res = await fetch("/api/film", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });

      if (res.ok) {
        alert(editingId ? "Proyecto actualizado" : "Proyecto publicado");
        setProjects((prev) => {
          const updated = editingId
            ? prev.map((p) => (p.id === editingId ? project : p))
            : [...prev, project];

          const match = updated.find(
            (p) =>
              p.position === project.position && (p.page || 1) === (project.page || 1)
          );
          setSelectedProject(match ?? null);
          return updated;
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
        setProjects((prev) => {
          const filtered = prev.filter((p) => p.id !== id);
          if (selectedProject?.id === id) {
            setSelectedProject(null);
          }
          return filtered;
        });
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
      <h2 className="text-[#FFF3DF] text-xl font-microextend font-bold">
        {editingId ? "Edit project" : "Add new film project"}
      </h2>
      <div className="bg-[#554943] p-4 mt-4 text-black">
        {/* Inputs – order: year, title, registration, synapsis, length */}
        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Year</label>
        <input
          type="text"
          placeholder="e.g. 2024"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Title</label>
        <input
          type="text"
          placeholder="Film title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Registration</label>
        <input
          type="text"
          placeholder="e.g. Registration number or code"
          value={registration}
          onChange={(e) => setRegistration(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Synapsis</label>
        <textarea
          placeholder="Film synopsis"
          value={synapsis}
          onChange={(e) => setSynapsis(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2 min-h-[80px]"
          rows={3}
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Length</label>
        <input
          type="text"
          placeholder="e.g. 15 min, 90 min"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block font-minecraft text-sm text-[#FFF3DF] mb-1">Icon</label>
        <IconUpload onUpload={setIcon} currentIcon={icon} label="Icon" />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF] mt-4">Project position</label>
        <FilmProjectPosition 
          onPositionSelect={(selectedPos) => {
            setPosition(selectedPos);
            const associated = projects.find(
              (proj) =>
                proj.position === selectedPos && (proj.page || 1) === page
            );
            setSelectedProject(associated ?? null);
          }}
          currentPosition={position}
          currentPage={page}
          onPageChange={(newPage) => {
            setPage(newPage);
            const associated = projects.find(
              (proj) =>
                proj.position === position && (proj.page || 1) === newPage
            );
            setSelectedProject(associated ?? null);
          }}
          projects={projects}
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

      {/* Selected Project Display */}
      <div className="mt-6">
        {selectedProject ? (
          <div className="bg-transparent text-white p-4 rounded-md border border-gray-300">
            <h4 className="text-lg font-bold font-microextend">{selectedProject.title}</h4>
            {selectedProject.year && <p className="text-sm text-gray-400">{selectedProject.year}</p>}
            {(selectedProject.registration || selectedProject.length) && (
              <p className="text-sm text-gray-400">
                {[selectedProject.registration, selectedProject.length].filter(Boolean).join(" · ")}
              </p>
            )}
            {selectedProject.synapsis && (
              <p className="text-gray-300 mt-2 line-clamp-2">{selectedProject.synapsis}</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                className="bg-yellow-400 text-black py-1 px-3 rounded-md font-microextend"
                onClick={() => {
                  setTitle(selectedProject.title);
                  setIcon(selectedProject.icon || "");
                  setYear(selectedProject.year || "");
                  setRegistration(selectedProject.registration || "");
                  setSynapsis(selectedProject.synapsis || "");
                  setLength(selectedProject.length || "");
                  setPosition(selectedProject.position || 1);
                  setPage(selectedProject.page || 1);
                  setEditingId(selectedProject.id);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white py-1 px-3 rounded-md font-microextend"
                onClick={() => handleDelete(selectedProject.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-gray-500/60 p-6 text-center text-sm text-gray-400">
            Select a slot on the film strip to view project details.
          </div>
        )}
      </div>
    </div>
  );
}
