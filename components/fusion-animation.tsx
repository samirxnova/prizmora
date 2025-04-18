"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import type * as THREE from "three"
import { X } from "lucide-react"

interface FusionAnimationProps {
  images: string[]
  prompt: string
  onComplete: (fusedImageUrl: string | null, cloudinaryUrl: string | null) => void
}

function Stars({ count = 5000 }) {
  const [sphere] = useState(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 3
      positions[i3 + 1] = (Math.random() - 0.5) * 3
      positions[i3 + 2] = (Math.random() - 0.5) * 3
    }
    return positions
  })

  useFrame((state, delta) => {
    const mesh = state.scene.children[0] as THREE.Points
    mesh.rotation.x -= delta / 10
    mesh.rotation.y -= delta / 15
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#FFEB3B" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  )
}

export default function FusionAnimation({ images, prompt, onComplete }: FusionAnimationProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const minAnimationTime = 3000 // Minimum time to show animation in ms

  // Generate the fused image using the API
  useEffect(() => {
    const startTime = Date.now()
    let animationCompleted = false

    // Update the generateFusedImage function to properly handle Cloudinary upload
    const generateFusedImage = async () => {
      try {
        // Default prompt if none provided
        const userPrompt = prompt || "Create a unique artistic fusion of these images"

        // Step 1: Generate the image
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userPrompt,
            images: images,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate image")
        }

        // Step 2: Upload to Cloudinary for sharing
        let cloudinaryUrl = null
        try {
          const cloudinaryResponse = await fetch("/api/upload-to-cloudinary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageUrl: data.imageUrl,
            }),
          })

          const cloudinaryData = await cloudinaryResponse.json()

          if (cloudinaryResponse.ok && cloudinaryData.cloudinaryUrl) {
            cloudinaryUrl = cloudinaryData.cloudinaryUrl
            console.log("Image uploaded to Cloudinary:", cloudinaryUrl)

            // If we're in development mode and using the original URL, log this
            if (cloudinaryData.isDevelopment) {
              console.log("Note: Using original URL as Cloudinary fallback in development mode")
            }
          } else {
            console.warn("Cloudinary upload issue:", cloudinaryData.error || "Unknown error")
            // Continue with the original URL if Cloudinary upload fails
          }
        } catch (cloudinaryError) {
          console.error("Error uploading to Cloudinary:", cloudinaryError)
          // Continue with the original URL if Cloudinary upload fails
        }

        // Calculate how much time has passed
        const elapsedTime = Date.now() - startTime

        // If we haven't reached the minimum animation time, wait
        if (elapsedTime < minAnimationTime) {
          await new Promise((resolve) => setTimeout(resolve, minAnimationTime - elapsedTime))
        }

        // Only complete if animation hasn't been manually closed
        if (!animationCompleted) {
          // Check if this is a mock image and log it
          if (data.isMock) {
            console.log("Using mock image due to API limitations")
          }
          onComplete(data.imageUrl, cloudinaryUrl || data.imageUrl)
        }
      } catch (err: any) {
        console.error("Error generating image:", err)
        setError(err.message || "Failed to generate image")

        // Wait at least the minimum time before completing with error
        const elapsedTime = Date.now() - startTime
        if (elapsedTime < minAnimationTime) {
          await new Promise((resolve) => setTimeout(resolve, minAnimationTime - elapsedTime))
        }

        // Only complete if animation hasn't been manually closed
        if (!animationCompleted) {
          onComplete(null, null)
        }
      }
    }

    // Start the generation process
    generateFusedImage()

    // Cleanup function
    return () => {
      animationCompleted = true
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [images, prompt, onComplete])

  // Cycle through all images
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 800) // Slightly slower for smoother transitions

    return () => clearInterval(interval)
  }, [images])

  // Handle manual close
  const handleClose = () => {
    onComplete(null, null)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden"
        ref={containerRef}
      >
        <div className="relative w-full h-full">
          <Canvas camera={{ position: [0, 0, 1] }}>
            <Stars />
          </Canvas>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFEB3B] to-[#FFC107] opacity-30 blur-md sm:blur-xl" />

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
                  <AnimatePresence mode="wait">
                    {images.length > 0 && (
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 0.8, rotateY: -15, z: -50 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotateY: 15, z: -50 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.19, 1, 0.22, 1], // Custom cubic bezier for smooth motion
                        }}
                        className="absolute inset-0"
                      >
                        <img
                          src={images[currentImageIndex] || "/placeholder.svg"}
                          alt={`Image ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover rounded-lg shadow-2xl"
                          style={{
                            boxShadow: "0 0 30px rgba(255, 235, 59, 0.3)",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
              {error ? (
                <p className="text-red-400 text-base sm:text-lg font-medium">{error}</p>
              ) : (
                <>
                  <p className="text-base sm:text-lg font-medium">Creating magical fusion...</p>
                  <div className="mt-2 flex justify-center space-x-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gradient-to-r from-[#FFEB3B] to-[#FFC107] rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200"
          onClick={handleClose}
          aria-label="Close animation"
        >
          <X size={24} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
