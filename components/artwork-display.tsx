import { Loader2 } from "lucide-react"

interface ArtworkDisplayProps {
  fusedImage: string | null
  isGenerating: boolean
}

export default function ArtworkDisplay({ fusedImage, isGenerating }: ArtworkDisplayProps) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Your Artwork</h2>

      <div className="w-full max-w-3xl mx-auto aspect-square rounded-2xl overflow-hidden border border-gray-700/30 bg-gray-800/80 backdrop-blur-md relative shadow-xl">
        {fusedImage ? (
          <img src={fusedImage || "/placeholder.svg"} alt="Fused artwork" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Artwork will appear here</div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-3" />
              <p className="text-white font-medium">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
