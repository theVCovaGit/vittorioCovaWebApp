"use client";
import { useState } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  type?: "product" | "blog"; // ✅ Add type to distinguish between products and blogs
}

const ImageUpload = ({ onUpload, currentImage, type = "product" }: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");
  const [file, setFile] = useState<File | null>(null); // ✅ Store the file instead of uploading immediately

  // ✅ Handle file selection but don't upload yet
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // ✅ Show preview without uploading
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // ✅ Revoke object URL to avoid memory leaks
    return () => URL.revokeObjectURL(objectUrl);
  };

  // ✅ Upload manually on confirmation
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint = type === "product" ? "/api/products" : "/api/blog-upload";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        onUpload(data.url); // ✅ Pass uploaded URL to parent component
        setPreview(data.url);
        setFile(null); // ✅ Clear the stored file after successful upload
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
      <div
        className="w-full h-40 border border-gray-300 rounded-md flex items-center justify-center relative cursor-pointer hover:border-blue-500 transition"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
        ) : (
          <span className="text-gray-400">Drag and drop or click to upload</span>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange} // ✅ Only update preview, don't upload yet
          disabled={loading}
        />
      </div>

      {/* ✅ Show loading state */}
      {loading && <p className="text-gray-500 text-sm mt-2">Uploading...</p>}

      {/* ✅ Show confirmation button */}
      {file && !loading && (
        <button
          onClick={handleUpload} // ✅ Trigger upload manually
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
        >
          Confirmar imagen
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
