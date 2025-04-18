"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function MascotAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    // Show mascot after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Show message when hovered
    if (isHovered) {
      setShowMessage(true)
    } else {
      const timer = setTimeout(() => {
        setShowMessage(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isHovered])

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="relative">
            {/* Speech bubble */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg max-w-[200px] text-sm"
                  style={{
                    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                    transformOrigin: "bottom right",
                  }}
                >
                  <p>Hi! I'm Prismo! Welcome to Prizmora. Upload some images and let's create something magical!</p>
                  <div
                    className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white/90 transform rotate-45"
                    style={{ backdropFilter: "blur(8px)" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.5 },
              }}
              whileTap={{ scale: 0.9 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="cursor-pointer"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-visible">
                <Image
                  src="/images/prizmo.png"
                  alt="Prismo mascot"
                  width={80}
                  height={80}
                  className="rounded-full"
                  style={{
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
