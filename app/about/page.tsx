import Header from "@/components/header"
import Footer from "@/components/footer"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About ImageFusionAI
          </h1>

          <div className="space-y-6 text-gray-300">
            <p>
              ImageFusionAI is a cutting-edge web application that harnesses the power of artificial intelligence to
              create unique, stunning artworks by fusing multiple images together.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">How It Works</h2>
            <p>
              Our advanced AI algorithms analyze the visual elements, patterns, colors, and compositions of your
              uploaded images, then intelligently blend them to create something entirely new and captivating.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload up to four images to combine into a single artwork</li>
              <li>Edit your creation with text prompts to refine the result</li>
              <li>Download your artwork in high resolution</li>
              <li>Share your creations directly to social media</li>
              <li>No account required - your privacy is our priority</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">Privacy</h2>
            <p>
              We value your privacy. ImageFusionAI does not permanently store any of your uploaded images or generated
              artworks. All data is processed temporarily and deleted after your session ends.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">Technology</h2>
            <p>
              Built with Next.js, TypeScript, Tailwind CSS, and Three.js, ImageFusionAI represents the cutting edge of
              web application development combined with state-of-the-art AI image processing.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
