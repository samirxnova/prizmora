"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PromptEditorProps {
  prompt: string
  setPrompt: (prompt: string) => void
  onGenerate: () => void
  disabled: boolean
}

export default function PromptEditor({ prompt, setPrompt, onGenerate, disabled }: PromptEditorProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate()
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Edit with Prompt</h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="text"
          placeholder="Enter a prompt to edit the artwork"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={disabled}
          className="flex-grow bg-gray-800/80 backdrop-blur-sm border-gray-700/50 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 transition-all duration-200"
        />

        <Button
          type="submit"
          disabled={disabled || !prompt.trim()}
          className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Generate
        </Button>
      </form>

      <p className="mt-2 text-sm text-gray-400">Try prompts like "Make it more vibrant" or "Add a surreal effect"</p>
    </section>
  )
}
