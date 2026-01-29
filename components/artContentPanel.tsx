"use client";
import { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";
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
  collectionDescription?: string;
  year?: string;
  images: string[];
  icon?: string;
  position?: number;
  page?: number;
  forSale?: boolean;
  materials?: string;
  dimensions?: string;
  price?: string;
}

export default function ArtContentPanel({ isActive }: { isActive: boolean }) {
  const [title, setTitle] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [collection, setCollection] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
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
  const [materials, setMaterials] = useState<string>("");
  const [dimensions, setDimensions] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

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
    setDiscipline("");
    setCollection("");
    setCollectionDescription("");
    setYear("");
    setIcon("");
    setImages([]);
    setPosition(1);
    setPage(1);
    setEditingId(null);
    setCurrentPage(1);
    setForSale(true);
    setMaterials("");
    setDimensions("");
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

  // When collection changes, keep selected project in sync with current collection + position (art: positions are per collection)
  useEffect(() => {
    if (!collection.trim()) {
      setSelectedProject(null);
      return;
    }
    const collectionKey = collection.trim().toLowerCase();
    const inCollection = projects.filter(
      (p) => (p.collection ?? "").trim().toLowerCase() === collectionKey
    );
    const match = inCollection.find(
      (p) => p.position === position && (p.page || 1) === page
    );
    setSelectedProject(match ?? null);
  }, [collection, projects, position, page]);

  // Extract unique collections from projects
  const existingCollections = Array.from(
    new Set(
      projects
        .map((p) => p.collection)
        .filter((c): c is string => Boolean(c && c.trim()))
    )
  ).sort();

  // Projects in the current collection only (for position grid – so user sees which of the 4 spots are taken in this collection)
  const collectionKey = collection.trim().toLowerCase();
  const projectsInCollection = collectionKey
    ? projects.filter(
        (p) => (p.collection ?? "").trim().toLowerCase() === collectionKey
      )
    : [];

  // POST or PUT
  const handleSubmit = async () => {
    if (!title || !discipline || !collection || images.length === 0) {
      alert("Faltan campos obligatorios");
      return;
    }
    
    const project: ArtProject = {
      id: editingId ?? Date.now(),
      title,
      country: "", // Keep for backward compatibility
      city: "", // Keep for backward compatibility
      discipline,
      collection,
      collectionDescription,
      year,
      images,
      icon,
      position,
      page,
      forSale,
      materials,
      dimensions,
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
        let errMessage = "Error al guardar el proyecto";
        try {
          const err = await res.json();
          errMessage = (err && (err.error || err.message)) || errMessage;
          console.error("API error:", err);
        } catch {
          console.error(`Request failed with status ${res.status}`);
        }
        alert(errMessage);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Submit error:", message, err);
      alert("Error inesperado: " + (message || "Error desconocido"));
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
      <h2 className="text-[#FFF3DF] text-xl font-microextend font-bold">
        {editingId ? "Edit project" : "Add new art project"}
      </h2>
      <div className="bg-[#554943] p-4 mt-4 text-black">
        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Collection</label>
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="e.g. Private, Museum, Gallery"
            value={collection}
            onChange={(e) => {
              setCollection(e.target.value);
              setShowCollectionDropdown(true);
            }}
            onFocus={() => setShowCollectionDropdown(true)}
            onBlur={() => {
              // Delay hiding dropdown to allow click on option
              setTimeout(() => setShowCollectionDropdown(false), 200);
            }}
            className="w-full p-2 border border-gray-400 rounded-md"
          />
          {showCollectionDropdown && existingCollections.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-[#554943] border border-gray-400 rounded-md shadow-lg max-h-60 overflow-auto">
              {existingCollections
                .filter((col) =>
                  collection
                    ? col.toLowerCase().includes(collection.toLowerCase())
                    : true
                )
                .map((col, index, filteredArray) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCollection(col);
                      setShowCollectionDropdown(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-600 text-[#FFF3DF] font-minecraft text-sm ${
                      index < filteredArray.length - 1 ? 'border-b border-gray-400' : ''
                    }`}
                  >
                    {col}
                  </div>
                ))}
            </div>
          )}
        </div>

        {collection.trim() && (
          <>
            <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Collection Description</label>
            <textarea
              placeholder="Enter a description for this collection..."
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-md mb-2 min-h-[80px] resize-y"
              rows={3}
            />

            <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Title</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Materials</label>
        <input
          type="text"
          placeholder="e.g. Oil on canvas, Bronze, Mixed media"
          value={materials}
          onChange={(e) => setMaterials(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Dimensions</label>
        <input
          type="text"
          placeholder="e.g. 120 x 80 cm, 30 x 20 x 15 inches"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md mb-2"
        />

        <div className="mb-4">
          <label className="block mb-2 font-minecraft text-sm text-[#FFF3DF]">For Sale</label>
          <div className="flex items-center gap-3">
            <Switch
              checked={forSale}
              onChange={setForSale}
              className={`${
                forSale ? "bg-teal-500" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  forSale ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className="text-sm text-[#FFF3DF] font-minecraft">
              {forSale ? "For Sale" : "Not For Sale"}
            </span>
          </div>
        </div>

        <label className="block mb-1 font-minecraft text-sm text-[#FFF3DF]">Price</label>
        <input
          type="text"
          placeholder="e.g. $9,800.00 or Price on Request"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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
              <InfoTooltip message="Choose where this project appears within its collection. Positions show which of the 4 spots are taken in that collection." />
            </div>
            <ProjectPosition 
              slotsPerPage={4}
              minimalSlots
              onPositionSelect={(selectedPos) => {
                setPosition(selectedPos);
                const associated = projectsInCollection.find(
                  (proj) =>
                    proj.position === selectedPos && (proj.page || 1) === page
                );
                setSelectedProject(associated ?? null);
              }}
              currentPosition={position}
              currentPage={page}
              onPageChange={(newPage) => {
                setPage(newPage);
                const associated = projectsInCollection.find(
                  (proj) =>
                    proj.position === position && (proj.page || 1) === newPage
                );
                setSelectedProject(associated ?? null);
              }}
              projects={projectsInCollection}
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
          </>
        )}
      </div>

      <div className="mt-6">
        {selectedProject ? (
          <div className="bg-transparent text-white p-4 rounded-md border border-gray-300">
            {(selectedProject.icon || selectedProject.images?.[0]) && (
              <div className="mb-3 w-full max-w-[120px]">
                <img
                  src={selectedProject.icon || selectedProject.images?.[0]}
                  alt={selectedProject.title}
                  className="w-full aspect-square object-cover object-center rounded-md"
                />
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
                  setDiscipline(selectedProject.discipline);
                  setCollection(selectedProject.collection);
                  setCollectionDescription(selectedProject.collectionDescription || "");
                  setYear(selectedProject.year || "");
                  setIcon(selectedProject.icon || "");
                  setImages(selectedProject.images);
                  setPosition(selectedProject.position || 1);
                  setPage(selectedProject.page || 1);
                  setForSale(selectedProject.forSale ?? true);
                  setMaterials(selectedProject.materials || "");
                  setDimensions(selectedProject.dimensions || "");
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
