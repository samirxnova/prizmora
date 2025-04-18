"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  uploadedImages: string[]
  onUpload: (images: string[]) => void
  onRemove: (index: number) => void
  onFuse: () => void
}

export default function ImageUpload({ uploadedImages, onUpload, onRemove, onFuse }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      processFiles(files)
    }
  }

  const processFiles = (files: File[]) => {
    setError(null)

    // Check file types
    const validFiles = files.filter((file) => file.type === "image/jpeg" || file.type === "image/png")

    if (validFiles.length !== files.length) {
      setError("Only JPG and PNG images are allowed")
      return
    }

    // Check file sizes
    const validSizeFiles = validFiles.filter((file) => file.size <= 10 * 1024 * 1024) // 10MB

    if (validSizeFiles.length !== validFiles.length) {
      setError("Images must be less than 10MB each")
      return
    }

    // Check total number of images
    if (uploadedImages.length + validSizeFiles.length > 4) {
      setError("Maximum of 4 images allowed")
      return
    }

    // Convert files to data URLs
    validSizeFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          onUpload([...uploadedImages, e.target.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Update the return statement to include glassmorphism styling
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Upload Images</h2>

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
          <p className="text-lg mb-2">Drag & drop up to 4 images or click to select</p>
          <p className="text-sm text-gray-400">JPG, PNG (max 10MB each)</p>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg, image/png"
            multiple
            onChange={handleFileInput}
          />
        </div>
      </div>

      {error && <div className="mt-3 text-red-400 text-sm">{error}</div>}

      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Uploaded Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-700/30 bg-gray-800/50 backdrop-blur-sm shadow-md">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(index)
                  }}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={onFuse}
              disabled={uploadedImages.length < 2}
              className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Fuse Images
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
