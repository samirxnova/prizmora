"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-[#FFEB3B] border-b border-black/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button className="mr-2 md:hidden">
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">Prizmora</span>
              <span className="text-xs border border-black rounded-full px-2 py-0.5">EXPERIMENT</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" className="rounded-full" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </Button>
            <Button variant="ghost" className="rounded-full" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </Button>
            <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
              <img src="/placeholder.svg?height=32&width=32" alt="User avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
