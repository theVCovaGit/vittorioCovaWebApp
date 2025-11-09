"use client";
import { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ImageUpload, MultipleImagesUpload } from "@/components/imageUpload";
import IconUpload from "@/components/iconUpload";
import ProjectPosition from "@/components/projectPosition";

interface ArchitectureProject {
  id: number;
  title: string;
  country: string;
  city: string;
  category: string;
  year?: string;
  images: string[];
  icon?: string;
  iconSecondary?: string;
  position?: number;
  page?: number;
}


export default function ArchitectureContentPanel({ isActive }: { isActive: boolean }) {
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [icon, setIcon] = useState<string>("");
  const [iconSecondary, setIconSecondary] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [position, setPosition] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  const InfoTooltip = ({ message }: { message: string }) => (
    <div className="relative group">
      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#FFF3DF]/60 bg-transparent text-[#FFF3DF]">
        <InformationCircleIcon className="h-3.5 w-3.5" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 rounded-md bg-black/90 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {message}
      </div>
    </div>
  );

  const resetForm = () => {
    setTitle("");
    setCountry("");
    setCity("");
    setYear("");
    setCategory("");
    setIcon("");
    setIconSecondary("");
    setImages([]);
    setPosition(1);
    setPage(1);
    setEditingId(null);
    setCurrentPage(1);
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
    if (!title || !country || !city || !category || images.length === 0) {
      alert("Faltan campos obligatorios");
      return;
    }
    
    const project: ArchitectureProject = {
      id: editingId ?? Date.now(),
      title,
      country,
      city,
      category,
      year,
      images,
      icon,
      iconSecondary,
      position,
      page,
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
  
    const projectToDelete = projects.find((p) => p.id === id);
  
    try {
      const res = await fetch("/api/architecture", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          icon: projectToDelete?.icon || "",
          iconSecondary: projectToDelete?.iconSecondary || "",
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
      <h2 className="text-[#FFF3DF] text-xl font-microextend">
        {editingId ? "Edit project" : "Add new project"}
      </h2>
      <div className="bg-[#5c4b4a] p-4 mt-4 text-black">
        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Title</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />
       <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Country</label>
        <input
          type="text"
          placeholder="e.g. Mexico"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">City</label>
        <input
          type="text"
          placeholder="e.g. CDMX"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Category</label>
        <input
          type="text"
          placeholder="e.g. Casa habitación"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Year</label>
        <input
          type="text"
          placeholder="e.g. 2023"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <div className="mb-1 flex items-center gap-2 font-minecraft text-sm text-[#FFF3DF]">
          <span>Icon #1</span>
          <InfoTooltip message="Add the outline of the icon." />
        </div>
        <IconUpload onUpload={setIcon} currentIcon={icon} label="Icon #1" />
        <div className="mt-4 mb-1 flex items-center gap-2 font-minecraft text-sm text-[#FFF3DF]">
          <span>Icon #2</span>
          <InfoTooltip message="Add the icon's fill." />
        </div>
        <IconUpload
          onUpload={setIconSecondary}
          currentIcon={iconSecondary}
          label="Icon #2"
        />
        <div className="mt-4 mb-1 flex items-center gap-2 font-minecraft text-sm text-[#FFF3DF]">
          <span>Project images</span>
          <InfoTooltip message="Add the project's images. Image #1 shows at the top; image #15 sits at the bottom." />
        </div>
        <MultipleImagesUpload 
          onUpload={setImages} 
          currentImages={images} 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        <div className="mt-4 mb-1 flex items-center gap-2 font-minecraft text-sm text-[#FFF3DF]">
          <span>Project position</span>
          <InfoTooltip message="Choose where this specific project will be positioned." />
        </div>
        <ProjectPosition 
          onPositionSelect={setPosition}
          currentPosition={position}
          currentPage={page}
          onPageChange={setPage}
        />

        <div className="flex items-center gap-4 mt-4">
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

      {projects.length > 0 && (
        <div className="mt-6 space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-transparent text-white p-4 rounded-md border border-gray-300">
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
              <h4 className="text-lg font-bold font-microextend">{project.title}</h4>
              <p className="text-sm text-gray-400">{project.category}</p>
              <p className="text-gray-300 mt-2">
                {project.city}, {project.country} {project.year && `· ${project.year}`}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  className="bg-yellow-400 text-black py-1 px-3 rounded-md font-microextend"
                  onClick={() => {
                    setTitle(project.title);
                    setCountry(project.country);
                    setCity(project.city);
                    setCategory(project.category);
                    setYear(project.year || "");
                    setCategory(project.category);
                    setIcon(project.icon || "");
                    setIconSecondary(project.iconSecondary || "");
                    setImages(project.images);
                    setEditingId(project.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white py-1 px-3 rounded-md font-microextend"
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
