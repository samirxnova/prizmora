import { NextResponse } from "next/server"
import { createHash } from "crypto"

export const runtime = "nodejs" // Use Node.js runtime

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Check if we're in development/preview mode or if credentials are placeholders
    const isDevMode =
      process.env.NODE_ENV === "development" ||
      !isValidCloudinaryConfig(
        process.env.CLOUDINARY_CLOUD_NAME,
        process.env.CLOUDINARY_API_KEY,
        process.env.CLOUDINARY_API_SECRET,
      )

    // For development or when credentials aren't properly set, return the original URL
    if (isDevMode) {
      console.log("Using original image URL as Cloudinary is not properly configured")
      return NextResponse.json({
        success: true,
        cloudinaryUrl: imageUrl,
        message: "Using original URL as Cloudinary is not properly configured",
        isDevelopment: true,
      })
    }

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    }

    const imageBlob = await imageResponse.blob()

    // Convert blob to base64 for Cloudinary upload
    const base64Data = await blobToBase64(imageBlob)

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(base64Data, imageBlob.type || "image/png")

    return NextResponse.json({
      success: true,
      cloudinaryUrl,
      message: "Successfully uploaded to Cloudinary",
    })
  } catch (error) {
    console.error("Error in upload handler:", error)

    // For any error, fall back to the original URL in development
    if (process.env.NODE_ENV === "development") {
      const { imageUrl } = await request.json()
      return NextResponse.json({
        success: true,
        cloudinaryUrl: imageUrl,
        message: "Using original URL due to Cloudinary error (development fallback)",
        error: error instanceof Error ? error.message : String(error),
        isDevelopment: true,
      })
    }

    return NextResponse.json(
      {
        error: "Failed to process image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Helper function to check if Cloudinary config is valid (not placeholder values)
function isValidCloudinaryConfig(cloudName?: string, apiKey?: string, apiSecret?: string): boolean {
  if (!cloudName || !apiKey || !apiSecret) return false

  // Check if any of the values are placeholder values
  const placeholders = [
    "your-cloud-name",
    "your-api-key",
    "your-api-secret",
    "your_cloud_name",
    "your_api_key",
    "your_api_secret",
  ]
  return !placeholders.includes(cloudName) && !placeholders.includes(apiKey) && !placeholders.includes(apiSecret)
}

// Helper function to convert blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64data = reader.result as string
      // Extract the base64 part if it's a data URL
      const base64 = base64data.includes("base64,") ? base64data.split("base64,")[1] : base64data
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Function to upload to Cloudinary using signed upload
async function uploadToCloudinary(base64Image: string, mimeType: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME is not configured")
  }

  const apiKey = process.env.CLOUDINARY_API_KEY
  if (!apiKey) {
    throw new Error("CLOUDINARY_API_KEY is not configured")
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!apiSecret) {
    throw new Error("CLOUDINARY_API_SECRET is not configured")
  }

  // Check if any of the credentials are placeholder values
  if (!isValidCloudinaryConfig(cloudName, apiKey, apiSecret)) {
    throw new Error("Cloudinary credentials contain placeholder values. Please update with actual credentials.")
  }

  // Generate timestamp for the signature
  const timestamp = Math.floor(Date.now() / 1000).toString()

  // Generate the signature string
  const signatureString = `timestamp=${timestamp}${apiSecret}`
  const signature = createHash("sha1").update(signatureString).digest("hex")

  // Create form data for Cloudinary upload
  const formData = new FormData()
  formData.append("file", `data:${mimeType};base64,${base64Image}`)
  formData.append("api_key", apiKey)
  formData.append("timestamp", timestamp)
  formData.append("signature", signature)
  formData.append("folder", "prizmora") // Optional: organize uploads in a folder

  // Upload to Cloudinary
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Cloudinary API error response:", errorData)
    throw new Error(`Cloudinary upload failed: ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()
  return data.secure_url
}
