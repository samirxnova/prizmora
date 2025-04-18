"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Plus, Sparkles, Download, Share2, AlertCircle } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import GenerateModal from "@/components/generate-modal"
import FusionAnimation from "@/components/fusion-animation"
import ShareModal from "@/components/share-modal"
import MascotAnimation from "@/components/mascot-animation"

export default function AppPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [fusedImage, setFusedImage] = useState<string | null>(null)
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear animation timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      if (uploadedImages.length + files.length > 4) {
        alert("Maximum of 4 images allowed")
        return
      }

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFuseImages = () => {
    if (uploadedImages.length < 1) {
      alert("Please upload at least 1 image to fuse")
      return
    }

    setError(null)
    setIsGenerating(true)
    setShowAnimation(true)
  }

  const handleAnimationComplete = (fusedImageUrl: string | null, cloudinaryImageUrl: string | null) => {
    setShowAnimation(false)
    setIsGenerating(false)

    if (fusedImageUrl) {
      setFusedImage(fusedImageUrl)
      setCloudinaryUrl(cloudinaryImageUrl)
    } else {
      setError("Failed to generate image. Please try again with different images or prompt.")
    }
  }

  const handleEditWithPrompt = () => {
    setShowGenerateModal(true)
  }

  const handleGenerateWithPrompt = () => {
    setShowGenerateModal(false)
    setError(null)
    setIsGenerating(true)
    setShowAnimation(true)
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  // Update the handleDownload function to ensure it works with the Azure Blob URL
  const handleDownload = () => {
    if (!fusedImage && !cloudinaryUrl) return

    // Use the original Azure Blob URL for downloading
    const imageUrl = fusedImage

    if (!imageUrl) return

    // Create a temporary anchor element
    const a = document.createElement("a")
    a.href = imageUrl
    a.download = "prizmora-fusion.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow flex flex-col">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left sidebar */}
          <div className="w-full lg:w-64 bg-[#FFEB3B]/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-[#FFEB3B]/50">
            <div className="space-y-6">
              <h3 className="font-bold text-lg mb-4 text-center lg:text-left">Upload Images (Max 4)</h3>

              {/* Image upload blocks */}
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto lg:max-w-none">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="relative">
                    <div
                      className={`aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        uploadedImages[index] ? "border-transparent" : "border-black"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadedImages[index] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={uploadedImages[index] || "/placeholder.svg"}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                          />
                          <button
                            className="absolute top-1 right-1 bg-yellow-300/90 backdrop-blur-sm rounded-full p-1 transition-all duration-200 hover:bg-yellow-400"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveImage(index)
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <Plus size={24} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png"
                multiple
                onChange={handleImageUpload}
              />

              <Button
                onClick={handleFuseImages}
                disabled={uploadedImages.length < 1 || isGenerating}
                className="w-full bg-black/90 backdrop-blur-sm text-white hover:bg-gray-800 mt-4 py-3 min-h-[48px] rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Fuse Images
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {error && (
              <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{error}</p>
                  <p className="text-sm mt-1">
                    This could be due to API limitations or server issues. You can try again with different images or a
                    simpler prompt.
                  </p>
                </div>
              </div>
            )}

            {fusedImage ? (
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-2xl aspect-square rounded-lg overflow-hidden border-2 border-gray-200/50 shadow-lg">
                  <img
                    src={fusedImage || "/placeholder.svg"}
                    alt="Generated image"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                  <Button
                    onClick={handleEditWithPrompt}
                    disabled={isGenerating}
                    className="bg-[#FFEB3B]/90 backdrop-blur-sm text-black hover:bg-[#FDD835] min-w-[140px] py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Edit with Prompt
                  </Button>

                  <Button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="bg-black/90 backdrop-blur-sm text-white hover:bg-gray-800 min-w-[140px] py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>

                  <Button
                    onClick={handleShare}
                    disabled={isGenerating}
                    className="bg-gray-100/90 backdrop-blur-sm text-black hover:bg-gray-200 min-w-[140px] py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center h-[400px] sm:h-[500px] border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50/50 backdrop-blur-sm">
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-lg mb-2 text-center">Upload images to start</p>
                <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                  Upload up to 4 images to fuse them into a unique creation
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#FFEB3B]/90 backdrop-blur-sm text-black hover:bg-[#FDD835] min-w-[140px] py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Select Images
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {showGenerateModal && (
        <GenerateModal
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerateWithPrompt}
          prompt={prompt}
          setPrompt={setPrompt}
        />
      )}

      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          imageUrl={cloudinaryUrl || fusedImage || "/placeholder.svg"}
        />
      )}

      {showAnimation && (
        <FusionAnimation images={uploadedImages} prompt={prompt} onComplete={handleAnimationComplete} />
      )}

      <MascotAnimation />
    </div>
  )
}
