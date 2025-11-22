# Social SEO Content Generator

An AI-powered web application designed to help creators and marketers generate highly optimized social media content and brand visuals. This application leverages the **Google Gemini API** for text generation and **Imagen** for visual assets, aiming to make content creation "100X more efficient".

## 🚀 Features

### 1. ⚡️ Omni-Channel Content Generator
Generate optimized content for multiple platforms simultaneously from a single input.
- **Platforms**: Twitter (X), LinkedIn, Instagram, Facebook, YouTube.
- **Features**:
    - Platform-specific character limits and formatting.
    - Auto-hashtag generation.
    - "One-click" copy for all assets.

### 2. 🔍 AI Search & GEO (Generative Engine Optimization)
Tools designed specifically to help content rank in AI Overviews (like Google's AI Overviews, Perplexity, etc.).
- **Entity Analysis**: Identifies key entities to include in your content.
- **Schema Markup**: Auto-generates JSON-LD schema for articles and posts.
- **Fact-Check & Citations**: Suggests authoritative sources to boost credibility.

### 3. 🎨 Brand Kit Generator
Create professional visual assets on the fly using the Imagen model.
- **Dynamic Resizing**: Automatically generates logos, banners, and posts in the correct aspect ratios (1:1, 16:9, etc.).
- **Style Consistency**: Maintain a consistent brand voice and visual identity.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Framer Motion (Glassmorphism UI)
- **AI SDK**: `@google/genai`
- **Icons**: Lucide React

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd seo
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    - The app requires a Google GenAI API Key.
    - You can enter this directly in the application UI (stored safely in Local Storage).

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT
# seogen
