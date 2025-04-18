import { type NextRequest, NextResponse } from "next/server"
import { createImageDescription, useGemini } from "@/lib/api-utils"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { prompt, images } = await req.json()

    if (!prompt && images.length === 0) {
      return NextResponse.json({ error: "Either prompt or images are required" }, { status: 400 })
    }

    // Use OpenAI by default, or Gemini if flag is set
    try {
      return useGemini ? await generateWithGemini(prompt, images) : await generateWithOpenAI(prompt, images)
    } catch (apiError: any) {
      console.error("API error:", apiError)

      // If OpenAI fails and we weren't already using Gemini, try Gemini as fallback
      if (!useGemini) {
        console.log("Attempting fallback to Gemini API...")
        try {
          return await generateWithGemini(prompt, images)
        } catch (fallbackError: any) {
          console.error("Fallback to Gemini also failed:", fallbackError)
          return NextResponse.json(
            {
              error: "Both image generation services failed. Please try again later.",
              details: fallbackError.message,
            },
            { status: 503 },
          )
        }
      }

      return NextResponse.json(
        {
          error: "Image generation failed. Please try again later.",
          details: apiError.message,
        },
        { status: apiError.status || 500 },
      )
    }
  } catch (error: any) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: error.status || 500 })
  }
}

async function generateWithOpenAI(prompt: string, images: string[]) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
  }

  try {
    // Create a comprehensive prompt that includes descriptions of the uploaded images
    const imageDescription = createImageDescription(images)

    // Build a more detailed prompt that describes how to combine the images
    let fullPrompt = prompt || "Create a unique artistic image"

    if (imageDescription) {
      if (images.length === 1) {
        fullPrompt += `. Use this context: ${imageDescription}. Create a variation of the uploaded image.`
      } else {
        fullPrompt += `. Use this context: ${imageDescription}. Combine elements from all ${images.length} uploaded images into one cohesive artwork.`
      }
    }

    // Ensure prompt is not too long (DALL-E has limits)
    if (fullPrompt.length > 1000) {
      fullPrompt = fullPrompt.substring(0, 997) + "..."
    }

    // Prepare the API request for DALL-E 3
    const requestBody = {
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    }

    console.log("Sending request to OpenAI:", JSON.stringify(requestBody, null, 2))

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API error:", errorData)

      // Extract the error message and status
      const errorMessage = errorData.error?.message || "Failed to generate image with OpenAI"
      const errorStatus = response.status

      // For demonstration purposes, return a mock image URL if in development
      if (process.env.NODE_ENV === "development") {
        console.log("Using mock image URL for development")
        return NextResponse.json({
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1064&auto=format&fit=crop",
          isMock: true,
        })
      }

      const error = new Error(errorMessage) as any
      error.status = errorStatus
      throw error
    }

    const data = await response.json()

    // Return the generated image URL
    return NextResponse.json({ imageUrl: data.data[0].url })
  } catch (error: any) {
    console.error("Error in OpenAI image generation:", error)

    // For demonstration purposes, return a mock image URL if in development
    if (process.env.NODE_ENV === "development") {
      console.log("Using mock image URL for development due to error")
      return NextResponse.json({
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1064&auto=format&fit=crop",
        isMock: true,
      })
    }

    throw error
  }
}

async function generateWithGemini(prompt: string, images: string[]) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
  }

  try {
    // Create a comprehensive prompt that includes descriptions of the uploaded images
    const imageDescription = createImageDescription(images)

    // Build a more detailed prompt that describes how to combine the images
    let fullPrompt = prompt || "Create a unique artistic image"

    if (imageDescription) {
      if (images.length === 1) {
        fullPrompt += `. Use this context: ${imageDescription}. Create a variation of the uploaded image.`
      } else {
        fullPrompt += `. Use this context: ${imageDescription}. Combine elements from all ${images.length} uploaded images into one cohesive artwork.`
      }
    }

    console.log("Would call Gemini API with prompt:", fullPrompt)

    // For demonstration purposes, return a mock image URL
    return NextResponse.json({
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1064&auto=format&fit=crop",
      isMock: true,
    })
  } catch (error: any) {
    console.error("Error in Gemini image generation:", error)
    throw error
  }
}
