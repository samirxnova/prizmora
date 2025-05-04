# 🌀 Prizmora

A **prompt-to-image fusion** web app that blends **creativity**, **AI**, and **Web3**.

---

## ✨ About

**Prizmora** is an innovative platform that enables users to create stunning and surreal artworks by fusing multiple images together using AI and refining them with text prompts.

The name *Prizmora* combines the core elements of the experience:

* **Pr** → from **Prompt**: for the text editing capabilities
* **Im** → from **Image**: image fusion is the heart of the app
* **Z** → inspired by **Zora**: signaling NFT and Web3 culture
* **mora** → symbolizes fusion, transformation, and AI-powered creativity

The “Z” adds a touch of Web3 flair and meme-inspired fun.

---

## 🌈 Features

* 🎨 **Image Fusion**: Upload up to 4 images and fuse them using AI
* ✏️ **Prompt Editing**: Refine and guide the final image with creative prompts
* 🌀 **Fusion Animations**: Enjoy 3D and motion effects while your artwork forms
* 📤 **Social Sharing**: Share your artwork across platforms
* 🐹 **Mascot Interaction**: Meet **Prismo**, the raccoon-hamster mascot
* 🧊 **Glassmorphism UI**: Clean and modern glassy design
* 🪙 **Zora Coin Creation**: Mint your art as a custom Zora coin

---

## 🆕 Latest Changes

### 🪙 Zora Coin Integration

Prizmora now lets users mint their AI-generated artwork as a **Zora Coin** directly from the Share Modal.

* ✅ **New Component**: `ZoraCoinCreator` handles:

  * Coin name and symbol input
  * Description and metadata creation
  * Interaction with the Zora SDK
  * Error/success feedback

* ✅ **ShareModal Updated**:

  * Added a “Create Zora Coin” button
  * Launches the coin creation modal
  * Uses Prizmora’s design language and styling

* ✅ **Styling Enhancements**:

  * Gradient styling consistent with the app
  * Matching modal and button components
  * Responsive layout improvements

**🔧 How it Works**:

1. Generate a fused image
2. Click **Share**
3. Select **Create Zora Coin**
4. Enter name, symbol (auto-uppercase), and description
5. Mint the coin via the Zora SDK

---

## 🧱 Tech Stack

* **Next.js** – Framework for web app architecture
* **TypeScript** – Type-safe coding
* **Tailwind CSS** – Utility-first styling
* **Framer Motion** – Smooth animations and transitions
* **React Three Fiber** – 3D rendering and effects
* **shadcn/ui** – UI components
* **OpenAI API** – Image generation and fusion
* **Zora SDK** – On-chain coin creation

---

## 🔌 API Integration

### 🤖 OpenAI (DALL·E 3)

Used for generating AI-fused images:

1. Users upload up to 4 images
2. They enter a creative prompt
3. Images + prompt are sent to OpenAI
4. Output is displayed after a beautiful fusion animation

### 🔒 Gemini API (Optional)

Structure is in place to support Gemini from Google, but it’s disabled by default.

To enable:

* Set `useGemini = true` in `lib/api-utils.ts`
* Add your `GEMINI_API_KEY` in the environment variables

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with:

```
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key  # Optional
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm or yarn

### Installation

```bash
git clone https://github.com/samirxnova/prizmora.git
cd prizmora
npm install    # or yarn install
```

### Run Development Server

```bash
npm run dev    # or yarn dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🖼️ Usage

1. Upload up to **4 images**
2. Click **Fuse Images** to generate a new artwork
3. Use the **Prompt Editor** to refine output
4. **Download**, **share**, or **mint** your creation as a **Zora Coin**

---

## 🐣 Coming Soon

* 🛒 Zora NFT marketplace integration
* 🗳️ Community voting on top fusions
* 🎭 Prismo character customization
* 🌐 IPFS support for decentralized storage

---

## 🧑‍🎨 Made with 💜 by [@samirxnova](https://github.com/samirxnova)


