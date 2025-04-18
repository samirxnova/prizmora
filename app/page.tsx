"use client"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import MascotAnimation from "@/components/mascot-animation"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-[#FFEB3B]">
      <header className="p-4 md:p-6 flex-shrink-0">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">Prizmora</h1>
            <span className="text-xs border border-black rounded-full px-2 py-0.5">EXPERIMENT</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="rounded-full" size="icon">
              <span className="sr-only">Help</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-4 flex flex-col items-center justify-center relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-8 h-8 border-2 border-black rounded-full hidden sm:block"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 text-black hidden sm:block">
          <Sparkles size={48} />
        </div>
        <div className="absolute top-1/4 right-1/4 w-6 h-6 border-2 border-black rotate-45 hidden sm:block"></div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl font-bold text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Prizmora
        </motion.h1>

        <motion.div
          className="max-w-2xl text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg">A prompt-to-image fusion web app that blends creativity, AI, and Web3.</p>
          <div className="mt-4 p-4 bg-black/10 backdrop-blur-sm rounded-lg text-sm">
            <p>
              <strong>Pr</strong>: From "Prompt" — for the text editing functionality.
            </p>
            <p>
              <strong>Im</strong>: From "Image" — core image fusion feature.
            </p>
            <p>
              <strong>Z</strong>: Inspired by "Zora" — hinting at NFT and Web3 creativity.
            </p>
            <p>
              <strong>mora</strong>: Symbolizes fusion, transformation, and AI-driven art.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 md:mb-16">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-black shadow-md">
            <img src="/images/priz-3.png?height=96&width=96" alt="Subject" className="w-full h-full object-cover" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold">+</div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-black shadow-md">
            <img src="/images/priz-2.png?height=96&width=96" alt="Scene" className="w-full h-full object-cover" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold">+</div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-black shadow-md">
            <img src="/images/priz-1.png?height=96&width=96" alt="Style" className="w-full h-full object-cover" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold">=</div>
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-lg overflow-hidden border-2 border-black shadow-md">
            <img src="/images/priz-0.png?height=192&width=192" alt="Result" className="w-full h-full object-cover" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-4xl font-mono tracking-tight text-center mb-6">CREATE SOME MAGIC</h2>

        <Button
          onClick={() => router.push("/app")}
          className="bg-black/90 backdrop-blur-sm text-white hover:bg-gray-800 rounded-xl px-8 py-3 min-w-[140px] text-lg sm:text-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Get Started
          <ArrowRight className="ml-2" />
        </Button>
      </main>

      <footer className="p-4 sm:p-6 text-center flex-shrink-0">
        <p className="text-sm">© 2025 Prizmora. All rights reserved.</p>
      </footer>

      <MascotAnimation />
    </div>
  )
}
