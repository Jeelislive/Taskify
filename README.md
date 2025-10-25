# Baaz Task Manager

An intelligent, AI-powered task management system with voice input capabilities.

## Features

- 🎙️ **Voice-to-text transcription** using Web Speech API (browser-based, free)
- 🤖 **AI-powered task parsing** using Google Gemini 2.5 Pro (free tier)
- ☁️ **Cloud database storage** using Supabase (PostgreSQL, free tier)
- 🎯 **Smart categorization** (Work, Personal, Health, Errands)
- ⚡ **Impact & priority levels** automatically assigned
- 📅 **Automatic due date detection** from natural language
- ✨ **Beautiful animated UI** with Framer Motion
- 🔄 **Real-time updates** with Supabase
- 💯 **100% FREE** - No credit card, no API costs!

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL with real-time sync)
- **AI Integration**: Google Gemini 2.5 Pro (free)
- **Voice Processing**: Web Speech API (browser-native, free)
- **Drag & Drop**: dnd-kit
- **Date Utilities**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A modern browser with Web Speech API support (Chrome, Edge, Safari)
- Free Google Gemini API key (see `GEMINI_SETUP.md`)
- Free Supabase account (see `SUPABASE_SETUP.md`)

### Installation

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```

2. **Set up your API keys**:
   
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

   📖 See `ENV_SETUP.md` for detailed instructions

3. **Set up Supabase database**:
   
   Follow the instructions in `SUPABASE_SETUP.md` to:
   - Create a free Supabase project
   - Run the SQL schema to create the tasks table
   - Get your API credentials

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Start using the app**:
   - Click the microphone button
   - Allow microphone access when prompted
   - Speak your tasks naturally (e.g., "Schedule meeting tomorrow at 2pm, buy groceries today")
   - Watch AI parse and categorize your tasks automatically!

### Quick Setup Links

- 🔑 Get Gemini API Key: https://makersuite.google.com/app/apikey
- ☁️ Get Supabase Account: https://supabase.com
- 📚 Detailed Setup: See `ENV_SETUP.md`, `GEMINI_SETUP.md`, `SUPABASE_SETUP.md`

## Project Structure

```
baaz-task-manager/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── parse-tasks/         # AI task parsing endpoint
│   │   └── tasks/               # Task CRUD endpoints
│   ├── components/               # React components
│   │   ├── VoiceRecorder.tsx    # Voice input component
│   │   ├── TranscriptionDisplay.tsx
│   │   └── TaskList.tsx         # Task display component
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application page
├── lib/                          # Utility functions and types
│   ├── types.ts                 # TypeScript type definitions
│   ├── constants.ts             # Application constants
│   ├── supabase.ts              # Supabase client and utilities
│   └── speech-recognition.ts    # Web Speech API wrapper
├── GEMINI_SETUP.md              # Guide for Gemini API setup
├── SUPABASE_SETUP.md            # Guide for Supabase setup
├── ENV_SETUP.md                 # Environment variables guide
└── public/                      # Static assets
```

## License

MIT

