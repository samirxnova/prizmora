"use client"

import { Button } from "@/components/ui/button"
import { Download, Facebook, Twitter, Instagram } from "lucide-react"

interface ShareButtonsProps {
  disabled: boolean
  imageUrl: string | null
}

export default function ShareButtons({ disabled, imageUrl }: ShareButtonsProps) {
  const handleDownload = () => {
    if (!imageUrl) return

    // Create a temporary anchor element
    const a = document.createElement("a")
    a.href = imageUrl
    a.download = "prizmora-fusion.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Update the handleShare function to use the Cloudinary URL for Twitter sharing
  const handleShare = (platform: string) => {
    if (!imageUrl) return

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
    }
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Download & Share</h2>

      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={handleDownload}
          disabled={disabled || !imageUrl}
          className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-white flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>

        <Button
          onClick={() => handleShare("twitter")}
          disabled={disabled || !imageUrl}
          className="bg-[#1DA1F2]/90 backdrop-blur-sm hover:bg-[#1a94df] text-white flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>

        <Button
          onClick={() => handleShare("facebook")}
          disabled={disabled || !imageUrl}
          className="bg-[#4267B2]/90 backdrop-blur-sm hover:bg-[#3b5998] text-white flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>

        <Button
          onClick={() => handleShare("instagram")}
          disabled={disabled || !imageUrl}
          className="bg-gradient-to-r from-[#833AB4]/90 via-[#FD1D1D]/90 to-[#FCAF45]/90 backdrop-blur-sm hover:opacity-90 text-white flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </Button>
      </div>
    </section>
  )
}
