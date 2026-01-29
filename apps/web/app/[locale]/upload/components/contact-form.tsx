"use client";

import { useState } from "react";
import { getUploadUrl } from "../actions/contact"; // Adjust path

export const ContactForm = ({ dictionary }: { dictionary: any }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    try {
      // 1. Get the secure URL from our Server Action
      const { url, key } = await getUploadUrl(file.name, file.type);

      // 2. Upload the file directly to R2
      await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      alert("Upload successful! File key: " + key);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-4">
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <button type="submit" disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload to R2"}
      </button>
    </form>
  );
};