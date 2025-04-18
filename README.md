# Prizmora

A prompt-to-image fusion web app that blends creativity, AI, and Web3.

## About

Prizmora is an innovative platform that allows users to create unique artworks by fusing multiple images together using AI. The name "Prizmora" represents the core aspects of the application:

- **Pr**: From "Prompt" — for the text editing functionality.
- **Im**: From "Image" — core image fusion feature.
- **Z**: Inspired by "Zora" — hinting at NFT and Web3 creativity.
- **mora**: Symbolizes fusion, transformation, and AI-driven art.

The "Z" also adds a touch of meme-culture and Web3 flair to the brand.

## Features

- **Image Fusion**: Upload up to 4 images and fuse them together using AI
- **Prompt Editing**: Refine your creations with text prompts
- **Stunning Animations**: Enjoy beautiful fusion animations with 3D effects
- **Social Sharing**: Share your creations directly to social media platforms
- **Mascot Interaction**: Meet Prismo, our friendly raccoon-hamster mascot
- **Glassmorphism UI**: Modern, sleek interface with glassmorphism effects

## Tech Stack

- **Next.js**: React framework for building the web application
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **Framer Motion**: For smooth animations and transitions
- **React Three Fiber**: For 3D effects and animations
- **shadcn/ui**: For UI components
- **OpenAI API**: For image generation and fusion

## API Integration

### OpenAI Integration

This application uses OpenAI's DALL-E 3 model to generate fused images based on uploaded images and text prompts. The integration works by:

1. Accepting user-uploaded images (up to 4)
2. Taking a text prompt from the user
3. Sending the prompt and image context to the OpenAI API
4. Displaying the generated image after the fusion animation

### Gemini API (Disabled by Default)

The application also includes code structure for Google's Gemini API, but it is disabled by default. To use Gemini instead of OpenAI:

1. Set `useGemini = true` in `lib/api-utils.ts`
2. Add your Gemini API key to the environment variables

## Environment Variables

The application requires the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `GEMINI_API_KEY`: Your Google Gemini API key (only needed if using Gemini)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/samirxnova/prizmora.git
   cd prizmora
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your API keys:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Upload up to 4 images using the upload section
2. Click "Fuse Images" to combine them
3. Use the prompt editor to refine your creation
4. Download or share your artwork

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Special thanks to the AI and Web3 communities for inspiration
- Prismo mascot design by [Designer Name]
