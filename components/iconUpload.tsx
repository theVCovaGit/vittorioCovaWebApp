"use client";

import { useState } from "react";

interface IconUploadProps {
  onUpload: (url: string) => void;
  currentIcon?: string;
  label?: string;
  uploadEndpoint?: string;
}

const IconUpload = ({
  onUpload,
  currentIcon,
  label = "Icon #1",
  uploadEndpoint = "/api/architecture/icon-upload",
}: IconUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentIcon || "");
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
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to upload icon: ${response.status}`);
      const data = await response.json();
      if (data.url) {
        onUpload(data.url);
        setPreview(data.url);
        setFile(null);
      } else {
        alert("Error uploading icon.");
      }
    } catch (error) {
      console.error("Icon upload error:", error);
      alert("Icon upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-transparent transition hover:border-blue-500">
        {preview ? (
          <img src={preview} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="pointer-events-none flex flex-col items-center justify-center text-center text-gray-300">
            <span className="text-lg font-semibold uppercase tracking-wide">{label}</span>
            <span className="mt-2 text-sm text-gray-400">Drag and drop or click to upload</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>
      {loading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
      {file && !loading && (
        <button
          onClick={handleUpload}
          className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Confirmar icono
        </button>
      )}
    </div>
  );
};

export default IconUpload;

