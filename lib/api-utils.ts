// Flag to switch between OpenAI and Gemini
export const useGemini = false

// Function to create a text description of the uploaded images
export function createImageDescription(images: string[]): string {
  if (images.length === 0) return ""

  if (images.length === 1) {
    return "The uploaded image contains visual elements that should be incorporated into the generated artwork. Use it as a reference for style, content, and composition."
  } else if (images.length === 2) {
    return "The two uploaded images contain different visual elements that should be creatively combined. Merge the subjects, styles, and compositions from both images."
  } else {
    return `The ${images.length} uploaded images contain different visual elements that should be creatively combined into a single cohesive artwork. Take inspiration from all images for color palette, style, and subject matter.`
  }
}

// Helper function to encode image to base64 (for Gemini API)
export async function encodeImageToBase64(imageUrl: string): Promise<string> {
  try {
    // For data URLs, extract the base64 part
    if (imageUrl.startsWith("data:")) {
      const base64Data = imageUrl.split(",")[1]
      return base64Data
    }

    // For URLs, fetch and convert to base64
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string
        resolve(base64data.split(",")[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Error encoding image:", error)
    throw new Error("Failed to encode image")
  }
}

// Helper function to prepare images for Gemini API
export async function prepareImagesForGemini(images: string[]): Promise<any[]> {
  try {
    const preparedImages = []

    for (const imageUrl of images) {
      const base64Data = await encodeImageToBase64(imageUrl)
      preparedImages.push({
        inlineData: {
          data: base64Data,
          mimeType: imageUrl.startsWith("data:image/png") ? "image/png" : "image/jpeg",
        },
      })
    }

    return preparedImages
  } catch (error) {
    console.error("Error preparing images for Gemini:", error)
    throw new Error("Failed to prepare images for Gemini API")
  }
}

// Helper function to format Gemini API request
export function formatGeminiRequest(prompt: string, preparedImages: any[]) {
  return {
    contents: [
      {
        parts: [{ text: prompt }, ...preparedImages],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 2048,
    },
  }
}
