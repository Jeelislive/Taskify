# Baaz Task Manager

An intelligent, AI-powered task management system with voice input capabilities.

## Features

- Voice-to-text transcription using Whisper API
- AI-powered task parsing and categorization using OpenAI
- Drag-and-drop task board with category grouping
- Impact and priority level assignment
- Automatic due date detection
- Beautiful, animated UI with gesture support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3
- **AI Integration**: OpenAI API (GPT-4)
- **Voice Processing**: Whisper API
- **Drag & Drop**: dnd-kit

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
baaz-task-manager/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── components/      # React components
│   └── page.tsx         # Main page
├── lib/                 # Utility functions and types
│   ├── types.ts         # TypeScript type definitions
│   ├── constants.ts     # Application constants
│   └── db.ts           # Database utilities
├── data/                # SQLite database (gitignored)
└── public/             # Static assets
```

## Development Phases

- [x] Phase 1: Project setup and configuration
- [ ] Phase 2: Voice recording and transcription
- [ ] Phase 3: AI task parsing and extraction
- [ ] Phase 4: Backend API and database
- [ ] Phase 5: Drag-and-drop dashboard
- [ ] Phase 6: Polish and animations

## License

MIT

