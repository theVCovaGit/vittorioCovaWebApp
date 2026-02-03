"use client";
import { useEffect, useMemo, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  type?: "product" | "blog" | "icon";
}


interface MultipleImagesUploadProps {
  onUpload: (urls: string[]) => void;
  currentImages?: string[];
  type?: "product" | "blog";
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const ImageUpload = ({ onUpload, currentImage, type = "product" }: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      let endpoint = "/api/products"; // default

      if (type === "blog") endpoint = "/api/blog";
      if (type === "icon") endpoint = "/api/architecture/icon-upload";
        const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to upload image: ${response.status}`);
      const data = await response.json();
      if (data.url) {
        onUpload(data.url);
        setPreview(data.url);
        setFile(null);
      } else {
        alert("Error uploading file.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="w-full h-40 border border-gray-300 rounded-md flex items-center justify-center relative cursor-pointer hover:border-blue-500 transition">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
        ) : (
          <span className="text-gray-400">Drag and drop or click to upload</span>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>
      {loading && <p className="text-gray-500 text-sm mt-2">Uploading...</p>}
      {file && !loading && (
        <button
          onClick={handleUpload}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
        >
          Confirmar imagen
        </button>
      )}
    </div>
  );
};

function swapSlots<T>(arr: T[], i: number, j: number): T[] {
  if (i === j) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

const MultipleImagesUpload = ({ onUpload, currentImages = [] }: MultipleImagesUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const TOTAL_SLOTS = 15;
  const [files, setFiles] = useState<(File | null)[]>(Array(TOTAL_SLOTS).fill(null));

  const createPreviewArray = (images: string[]): (string | null)[] =>
    Array.from({ length: TOTAL_SLOTS }, (_, index) => images[index] ?? null);

  const [previews, setPreviews] = useState<(string | null)[]>(createPreviewArray(currentImages));

  const displayOrder = useMemo(() => {
    const order: number[] = [];
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const originalIndex = row + col * 5;
        if (originalIndex < TOTAL_SLOTS) {
          order.push(originalIndex);
        }
      }
    }
    return order;
  }, [TOTAL_SLOTS]);

  useEffect(() => {
    setPreviews(createPreviewArray(currentImages));
  }, [currentImages]);

  const handleSwap = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newPreviews = swapSlots(previews, fromIndex, toIndex);
    const newFiles = swapSlots(files, fromIndex, toIndex);
    setPreviews(newPreviews);
    setFiles(newFiles);
    const newCurrentImages = newPreviews.filter(
      (p): p is string => !!p && currentImages.includes(p)
    );
    onUpload(newCurrentImages);
    setDragFromIndex(null);
    setDragOverIndex(null);
  };

  const handleDelete = (slotIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newPreviews = [...previews];
    const newFiles = [...files];
    newPreviews[slotIndex] = null;
    newFiles[slotIndex] = null;
    setPreviews(newPreviews);
    setFiles(newFiles);
    const newCurrentImages = newPreviews.filter(
      (p): p is string => !!p && currentImages.includes(p)
    );
    onUpload(newCurrentImages);
  };

  const clearDragState = () => {
    setDragFromIndex(null);
    setDragOverIndex(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!event.target.files?.[0]) return;

    const file = event.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    const updatedPreviews = [...previews];
    updatedPreviews[index] = objectUrl;

    const updatedFiles = [...files];
    updatedFiles[index] = file;

    setPreviews(updatedPreviews);
    setFiles(updatedFiles);
  };

  const handleUpload = async () => {
    if (files.every((file) => file === null)) return;
    setLoading(true);

    try {
      const uploadedUrls: string[] = [...currentImages];
      for (const file of files) {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          const endpoint = "/api/products";
          const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error(`Failed to upload image: ${response.status}`);
          const data = await response.json();
          if (data.urls) uploadedUrls.push(...data.urls);
        }
      }

      onUpload(uploadedUrls);
      setPreviews(createPreviewArray(uploadedUrls));
      setFiles(Array(TOTAL_SLOTS).fill(null));
      alert("Imágenes subidas correctamente!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <p className="text-[#FFF3DF]/80 text-xs mb-2 font-minecraft">
        Drag an image onto another slot to swap their positions. Click Update below to save.
      </p>
      <div className="relative h-64 w-full rounded-md border border-gray-300">
        <div className="grid h-full grid-cols-3 grid-rows-5 gap-1">
          {displayOrder.map((slotIndex) => {
            const preview = previews[slotIndex];
            const displayNumber = slotIndex + 1;
            const isDragging = dragFromIndex === slotIndex;
            const isDropTarget = dragOverIndex === slotIndex && dragFromIndex !== null;

            return (
            <div
              key={slotIndex}
              draggable
              onDragStart={() => setDragFromIndex(slotIndex)}
              onDragEnd={clearDragState}
              onDragEnter={() => setDragOverIndex(slotIndex)}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverIndex(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragFromIndex !== null) handleSwap(dragFromIndex, slotIndex);
              }}
              className={`relative h-full w-full overflow-hidden rounded-md border-2 bg-transparent cursor-grab active:cursor-grabbing transition-colors ${
                isDropTarget
                  ? "border-[#FFF3DF] bg-[#FFF3DF]/20 ring-2 ring-[#FFF3DF]"
                  : "border-gray-300"
              } ${isDragging ? "opacity-50 ring-2 ring-[#FFF3DF]" : ""}`}
            >
              {isDropTarget && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#FFF3DF]/30 rounded-md">
                  <span className="text-sm font-minecraft font-bold text-[#19333F]">Drop here</span>
                </div>
              )}
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt={`Image ${displayNumber}`}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
                    draggable={false}
                  />
                  <button
                    type="button"
                    onClick={(e) => handleDelete(slotIndex, e)}
                    className="absolute top-1 right-1 z-20 p-0.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    title="Remove image"
                    aria-label="Remove image"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-gray-500 select-none">
                  <span className="text-xl font-semibold">#{displayNumber}</span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 z-0 h-full w-full cursor-pointer opacity-0"
                onChange={(e) => handleFileChange(e, slotIndex)}
                disabled={loading}
              />
            </div>
            );
          })}
        </div>
        {loading && <p className="text-gray-500 text-sm mt-2">Uploading...</p>}
      </div>
      {files.some((file) => file !== null) && !loading && (
        <button
          onClick={handleUpload}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
        >
          Confirmar imágenes
        </button>
      )}
    </div>
  );
};

export { ImageUpload, MultipleImagesUpload };
