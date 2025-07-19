"use client"

import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractFramesFromGIF } from "@/lib/gif-utils";

interface GifUploadProps {
  uploadedFrames: string[];
  onFramesExtracted: (frames: string[]) => void;
  onRemove: () => void;
  onFuse: () => void;
}

export default function GifUpload({ uploadedFrames, onFramesExtracted, onRemove, onFuse }: GifUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    setError(null);
    setLoading(true);
    // Only accept GIFs
    const gifFile = files.find((file) => file.type === "image/gif");
    if (!gifFile) {
      setError("Only GIF files are allowed");
      setLoading(false);
      return;
    }
    if (gifFile.size > 20 * 1024 * 1024) {
      setError("GIF must be less than 20MB");
      setLoading(false);
      return;
    }
    try {
      const frames = await extractFramesFromGIF(gifFile);
      if (frames.length === 0) {
        setError("No frames extracted from GIF");
      } else {
        onFramesExtracted(frames);
      }
    } catch (err) {
      setError("Failed to extract frames from GIF");
    }
    setLoading(false);
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Upload GIF</h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-purple-500 bg-purple-500/10 backdrop-blur-sm"
            : "border-gray-600/70 hover:border-purple-500 hover:bg-gray-800/30 backdrop-blur-sm"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-lg mb-2">Drag & drop a GIF or click to select</p>
          <p className="text-sm text-gray-400">GIF (max 20MB)</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/gif"
            onChange={handleFileInput}
          />
        </div>
      </div>
      {loading && <div className="mt-3 text-purple-400 text-sm">Extracting frames...</div>}
      {error && <div className="mt-3 text-red-400 text-sm">{error}</div>}
      {uploadedFrames.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Extracted Frames</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {uploadedFrames.map((frame, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-700/30 bg-gray-800/50 backdrop-blur-sm shadow-md">
                  <img
                    src={frame || "/placeholder.svg"}
                    alt={`Frame ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={onRemove} className="bg-gray-700/80 text-white px-6 py-2 rounded-md font-medium">Remove GIF</Button>
            <Button onClick={onFuse} disabled={uploadedFrames.length < 2} className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg">Fuse Frames</Button>
          </div>
        </div>
      )}
    </section>
  );
}
