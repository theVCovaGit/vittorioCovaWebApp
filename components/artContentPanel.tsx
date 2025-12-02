"use client";
import { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { MultipleImagesUpload } from "@/components/imageUpload";
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
  position?: number;
  page?: number;
  forSale?: boolean;
  description?: string;
  price?: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [position, setPosition] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<ArtProject | null>(null);
  const [forSale, setForSale] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const InfoTooltip = ({ message }: { message: string }) => (
    <span className="group relative inline-flex h-5 w-5 items-center justify-center text-[#FFF3DF]">
      <InformationCircleIcon className="h-5 w-5 cursor-help" />
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 rounded-md bg-black/90 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {message}
      </span>
    </span>
  );

  const resetForm = () => {
    setTitle("");
    setCountry("");
    setCity("");
    setDiscipline("");
    setCollection("");
    setYear("");
    setIcon("");
    setImages([]);
    setPosition(1);
    setPage(1);
    setEditingId(null);
    setCurrentPage(1);
    setForSale(true);
    setDescription("");
    setPrice("");
  };

  // GET: Fetch all projects
  useEffect(() => {
    if (!isActive) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/art");
        const data = await res.json();
        if (res.ok && Array.isArray(data.projects)) {
          setProjects(data.projects);
          const currentSelection = data.projects.find(
            (project: ArtProject) =>
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

  // POST or PUT
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
      position,
      page,
      forSale,
      description,
      price,
    };
    

    try {
      const res = await fetch("/api/art", {
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

  // DELETE
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

        <div className="mb-4">
          <label className="block mb-2 font-minecraft text-sm text-[#FFF3DF]">For Sale</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForSale(true)}
              className={`px-4 py-2 rounded-md font-microextend transition-colors ${
                forSale
                  ? "bg-[#fbef56] text-black"
                  : "bg-gray-600 text-white"
              }`}
            >
              For Sale
            </button>
            <button
              type="button"
              onClick={() => setForSale(false)}
              className={`px-4 py-2 rounded-md font-microextend transition-colors ${
                !forSale
                  ? "bg-[#fbef56] text-black"
                  : "bg-gray-600 text-white"
              }`}
            >
              Not For Sale
            </button>
          </div>
        </div>

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Description</label>
        <textarea
          placeholder="Enter project description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2 min-h-[100px] resize-y"
          rows={4}
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Price</label>
        <input
          type="text"
          placeholder="e.g. $9,800.00 or Price on Request"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Discipline</label>
        <input
          type="text"
          placeholder="e.g. Painting, Sculpture"
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Collection</label>
        <input
          type="text"
          placeholder="e.g. Private, Museum, Gallery"
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
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
          <span>Icon</span>
          <InfoTooltip message="Add the icon for this art piece." />
        </div>
        <IconUpload onUpload={setIcon} currentIcon={icon} label="Icon" />
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

      <div className="mt-6">
        {selectedProject ? (
          <div className="bg-transparent text-white p-4 rounded-md border border-gray-300">
            {Array.isArray(selectedProject.images) && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                {selectedProject.images.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt={`imagen ${i}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
            <h4 className="text-lg font-bold font-microextend">{selectedProject.title}</h4>
            <p className="text-sm text-gray-400">{selectedProject.discipline} · {selectedProject.collection}</p>
            <p className="text-gray-300 mt-2">
              {selectedProject.city}, {selectedProject.country}{" "}
              {selectedProject.year && `· ${selectedProject.year}`}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                className="bg-yellow-400 text-black py-1 px-3 rounded-md font-microextend"
                onClick={() => {
                  setTitle(selectedProject.title);
                  setCountry(selectedProject.country);
                  setCity(selectedProject.city);
                  setDiscipline(selectedProject.discipline);
                  setCollection(selectedProject.collection);
                  setYear(selectedProject.year || "");
                  setIcon(selectedProject.icon || "");
                  setImages(selectedProject.images);
                  setPosition(selectedProject.position || 1);
                  setPage(selectedProject.page || 1);
                  setForSale(selectedProject.forSale ?? true);
                  setDescription(selectedProject.description || "");
                  setPrice(selectedProject.price || "");
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
            Select a slot on the map to view project details.
          </div>
        )}
      </div>
    </div>
  );
}
