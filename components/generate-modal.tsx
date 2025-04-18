"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GenerateModalProps {
  onClose: () => void
  onGenerate: () => void
  prompt: string
  setPrompt: (prompt: string) => void
}

export default function GenerateModal({ onClose, onGenerate, prompt, setPrompt }: GenerateModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    onGenerate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-[#FFEB3B]/90 backdrop-blur-md rounded-2xl w-full max-w-lg mx-auto overflow-hidden shadow-xl border border-[#FFEB3B]/50 transition-all duration-300">
        <div className="flex items-center justify-between p-4 border-b border-black/10">
          <h2 className="text-xl font-bold text-center flex-1">GENERATE IMAGE</h2>
          <button onClick={onClose} className="text-black transition-colors hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <textarea
            className="w-full h-24 sm:h-32 p-4 border border-black/20 rounded-lg bg-[#FFF9C4]/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/30 resize-none transition-all duration-200"
            placeholder="Describe what you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>

          <div className="mt-2 text-sm text-gray-700">
            <p>Examples:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Make it more vibrant and colorful</li>
              <li>Transform into a watercolor painting</li>
              <li>Add a surreal, dreamlike quality</li>
              <li>Combine in the style of Van Gogh</li>
            </ul>
          </div>
        </div>

        <div className="p-4 flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-black/90 backdrop-blur-sm text-white hover:bg-gray-800 rounded-full px-8 py-3 min-w-[140px] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isGenerating ? "Generating..." : "GENERATE"}
          </Button>
        </div>
      </div>
    </div>
  )
}
