"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareModalProps {
  onClose: () => void
  imageUrl: string
}

export default function ShareModal({ onClose, imageUrl }: ShareModalProps) {
  const [caption, setCaption] = useState("")

  // Update the handleShare function to use cloudinaryUrl
  const handleShare = (platform: string) => {
    if (platform === "twitter") {
      const text = `Just fused this AI artwork using Prizmora! ✨`
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`
      window.open(url, "_blank")
    } else if (platform === "facebook") {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`
      window.open(url, "_blank")
    } else if (platform === "instagram") {
      // Instagram doesn't have a direct sharing URL, but we can inform the user
      alert("To share on Instagram, please download the image first and upload it to your Instagram account.")
    } else {
      // In a real app, this would share to the actual platform
      console.log(`Sharing to ${platform} with caption: ${caption}`)
      // Close modal after sharing
      setTimeout(() => {
        onClose()
      }, 500)
    }
  }

  return (
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

            {/* Farcaster */}
            <Button
              onClick={() => handleShare("farcaster")}
              className="flex items-center justify-center gap-2 bg-[#8A63D2] text-white hover:bg-opacity-80 rounded-lg py-2 transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.66 8.83c0-1.12.918-2.024 2.045-2.024 1.128 0 2.045.905 2.045 2.024 0 1.12-.917 2.023-2.045 2.023-1.127 0-2.045-.904-2.045-2.023zm6.782 6.346c0 1.119-.918 2.023-2.045 2.023-1.128 0-2.045-.904-2.045-2.023 0-1.12.917-2.024 2.045-2.024 1.127 0 2.045.905 2.045 2.024zm-6.782 0c0 1.119-.918 2.023-2.045 2.023-1.128 0-2.045-.904-2.045-2.023 0-1.12.917-2.024 2.045-2.024 1.127 0 2.045.905 2.045 2.024z" />
              </svg>
              <span>Farcaster</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
