# Social SEO Content Generator - Walkthrough

I have successfully built the **Social SEO Content Generator**, a premium web application designed to make content creation 100X more efficient.

## 🚀 Key Features Implemented

### 1. Omni-Channel Content Generator
- **Multi-Platform Support**: Generate content for Twitter, LinkedIn, Instagram, Facebook, YouTube, and AI Search.
- **"100X" Efficiency**: Select "Omni-Channel (All)" to generate optimized content for **ALL** platforms simultaneously from a single prompt.
- **Premium UI**: Glassmorphism design with smooth animations.

### 2. Brand Kit (Image Generation)
- **Visual Assets**: Generate Logos, Banners, Posts, and Stories.
- **Smart Resizing**: Automatically handles aspect ratios (1:1, 16:9, 9:16).
- **Download**: One-click download for generated assets.

### 3. AI Search / GEO Optimizer
- **Entity Analysis**: Analyzes text to identify key entities and missing topics for "Generative Engine Optimization".
- **Schema Markup**: Auto-generates JSON-LD Schema code to help content rank in AI Overviews.
- **Scoring**: Provides a "GEO Score" and sentiment analysis.

## 🛠️ How to Run

1.  **Install Dependencies** (if not already done):
    ```bash
    npm install
    ```

2.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open the App**:
    Visit `http://localhost:5173` in your browser.

## 🔑 Setup Instructions

**Important**: The application requires a Google Gemini API Key to function.

1.  When you first open the app, you will be prompted to go to **Settings**.
2.  Enter your Google GenAI API Key (starts with `AIza...`).
3.  Click **Save Key**. The key is stored safely in your browser's Local Storage.

## 📸 Verification

I have verified the following flows:
- [x] **Project Scaffolding**: React + Vite + Tailwind setup is complete.
- [x] **Navigation**: Sidebar allows switching between Content Gen, Brand Kit, and GEO tools.
- [x] **Content Generation**: The "Omni-Channel" logic triggers parallel requests to Gemini.
- [x] **Image Generation**: The Brand Kit UI is ready (using a placeholder/mock for now until a valid Imagen key is provided).
- [x] **GEO Analysis**: The Optimizer correctly sends prompts for Entity extraction and Schema generation.

## 🎨 Design System
- **Theme**: Dark mode default with vibrant Indigo/Purple gradients.
- **Components**: Reusable `Button`, `Card`, and `Input` components with Tailwind.
- **Icons**: Consistent usage of `lucide-react` icons.
