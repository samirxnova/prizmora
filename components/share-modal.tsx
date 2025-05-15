"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ZoraCoinCreator from "./zora-coin-creator"
import { useToast } from "@/components/ui/use-toast"

interface ShareModalProps {
  onClose: () => void
  imageUrl: string
  imageTitle?: string
}

export default function ShareModal({ onClose, imageUrl, imageTitle = "AI Fusion Art" }: ShareModalProps) {
  const [caption, setCaption] = useState("")
  const [showZoraCreator, setShowZoraCreator] = useState(false)
  const [zoraImageFile, setZoraImageFile] = useState<File | null>(null)
  const [isPreparingZora, setIsPreparingZora] = useState(false)
  const { toast } = useToast()

  const handleShare = async (platform: string) => {
    if (platform === "twitter") {
      const text = `Just fused this AI artwork using Prizmora! ✨`
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`
      window.open(url, "_blank")
    } else if (platform === "facebook") {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`
      window.open(url, "_blank")
    } else if (platform === "instagram") {
      alert("To share on Instagram, please download the image first and upload it to your Instagram account.")
    } else if (platform === "zora") {
      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Image URL is missing, cannot prepare for Zora coin creation.",
          variant: "destructive",
        })
        return
      }
      setIsPreparingZora(true)
      try {
        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch image for Zora: ${response.statusText}`)
        }
        const blob = await response.blob()
        const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) || "fused-art"
        const fileExtension = blob.type.split('/')[1] || "png"
        const finalFileName = `${fileName.split('.').slice(0, -1).join('.') || fileName}.${fileExtension}`
        
        const file = new File([blob], finalFileName, { type: blob.type })
        setZoraImageFile(file)
        setShowZoraCreator(true)
      } catch (error: any) {
        console.error("Error preparing image for Zora:", error)
        toast({
          title: "Error Preparing Image",
          description: error.message || "Could not fetch image for Zora coin creation.",
          variant: "destructive",
        })
      } finally {
        setIsPreparingZora(false)
      }
    } else {
      console.log(`Sharing to ${platform} with caption: ${caption}`)
      setTimeout(() => {
        onClose()
      }, 500)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl w-full max-w-md mx-auto overflow-hidden shadow-xl border border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <h2 className="text-xl font-bold text-center flex-1">Share Your Creation</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {/* Artwork preview */}
            <div className="w-full aspect-square max-w-[180px] mx-auto mb-4 rounded-lg overflow-hidden border border-gray-200/50 shadow-md">
              <img src={imageUrl || "/placeholder.svg"} alt="Your artwork" className="w-full h-full object-cover" />
            </div>

            {/* Caption input */}
            <div className="mb-4">
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                Caption (optional)
              </label>
              <textarea
                id="caption"
                className="w-full p-3 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] resize-none"
                placeholder="Add a caption to your creation..."
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
            </div>

            {/* Share buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* X (Twitter) */}
              <Button
                onClick={() => handleShare("twitter")}
                className="flex items-center justify-center gap-2 bg-black text-white hover:bg-opacity-80 rounded-lg py-2 transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X (Twitter)</span>
              </Button>

              {/* Instagram */}
              <Button
                onClick={() => handleShare("instagram")}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:opacity-90 rounded-lg py-2 transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram</span>
              </Button>

              {/* Facebook */}
              <Button
                onClick={() => handleShare("facebook")}
                className="flex items-center justify-center gap-2 bg-[#1877F2] text-white hover:bg-opacity-80 rounded-lg py-2 transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </Button>

              {/* Zora */}
              <Button
                onClick={() => handleShare("zora")}
                disabled={isPreparingZora}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90 rounded-lg py-2 transition-all duration-200"
              >
                {isPreparingZora ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <span>Create Zora Coin</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zora Coin Creator Modal */}
      {showZoraCreator && (
        <ZoraCoinCreator
          isOpen={showZoraCreator}
          onClose={() => {
            setShowZoraCreator(false)
            setZoraImageFile(null)
          }}
          imageFile={zoraImageFile}
          imageTitle={imageTitle}
        />
      )}
    </>
  )
}
