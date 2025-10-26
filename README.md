# 🚀 Baaz - AI-Powered Task Manager

A modern, voice-enabled task management system powered by Google Gemini AI. Simply speak your tasks and let AI organize them intelligently.

![Baaz Dashboard](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-purple?style=for-the-badge)

## ✨ Features

### 🎤 Voice-Powered Task Creation
- Record tasks using your voice
- AI automatically extracts and categorizes multiple tasks from speech
- Smart due date parsing ("tomorrow", "next Monday", etc.)

### 🤖 Intelligent AI Task Parsing
- Powered by Google Gemini 2.0 Flash
- Automatic categorization (Work, Personal, Health, Errands)
- Priority assignment (P1, P2, P3)
- Impact level detection (Low, Medium, High)

### 📊 Advanced Dashboard
- Drag-and-drop task management
- Real-time search with debouncing
- Task completion tracking
- Category-based organization

### 📈 Analytics & Reporting
- Task completion statistics
- Category distribution charts
- Downloadable PDF reports
- Activity logs with pagination

### 🎨 Modern UI/UX
- Ultra-dark minimalistic theme
- Smooth animations with Framer Motion
- Responsive design
- Icon-based interface using Lucide React

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **dnd-kit** - Drag-and-drop functionality
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - PostgreSQL database
- **Google Gemini 2.0 Flash** - AI task parsing

### APIs & Services
- **Web Speech API** - Voice recording
- **Google Generative AI** - Natural language processing

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))
- **Supabase Account** (Free tier available at [supabase.com](https://supabase.com))

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Baaz
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase Database

Create a new Supabase project and run this SQL to create the tasks table:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  due_date TIMESTAMP NOT NULL,
  impact_level TEXT NOT NULL,
  priority_level TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get Your API Keys:**
- **Gemini API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Supabase Keys**: Project Settings → API in your Supabase dashboard

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 📖 Usage Guide

### Creating Tasks with Voice

1. Click the microphone icon on the dashboard
2. Speak your tasks naturally, for example:
   - "Buy groceries tomorrow"
   - "Team meeting next Monday at 3 PM"
   - "Go to the gym this evening"
3. Click "Parse Tasks" to let AI process your speech
4. Review and save the extracted tasks

### Managing Tasks

- **Drag & Drop**: Move tasks between categories
- **Edit**: Click the edit icon to modify task details
- **Complete**: Mark tasks as done with the checkmark
- **Delete**: Remove tasks you no longer need
- **Search**: Use the search bar to find specific tasks

### Viewing Reports

1. Navigate to "Reports" in the sidebar
2. Filter tasks by status (All, Completed, Pending)
3. Adjust pagination (5, 10, 25, 50, 100 rows per page)
4. Download reports as HTML for offline viewing

## 🗂️ Project Structure

```
Baaz/
├── app/
│   ├── api/
│   │   ├── parseTasks/         # AI task parsing endpoint
│   │   └── tasks/              # CRUD operations for tasks
│   ├── components/
│   │   ├── layout/             # Sidebar, TopBar, RightPanel
│   │   ├── modals/             # EditTask, ViewTask modals
│   │   ├── views/              # Analytics, Calendar, Reports, Completed
│   │   ├── ui/                 # Reusable components (Badge, Button, Card)
│   │   ├── CategoryColumn.tsx  # Task column by category
│   │   ├── TaskCard.tsx        # Individual task card
│   │   ├── VoiceRecorder.tsx   # Voice recording component
│   │   └── TranscriptionDisplay.tsx
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main dashboard
├── lib/
│   ├── supabase.ts             # Supabase client & helpers
│   ├── types.ts                # TypeScript type definitions
│   └── constants.ts            # App constants & colors
├── .env.local                  # Environment variables (create this)
├── package.json
└── README.md
```

## 🎯 Key Features Explained

### AI Task Parsing
The AI understands natural language and automatically:
- Extracts individual tasks from speech
- Assigns appropriate categories
- Determines priority based on urgency
- Calculates impact levels
- Parses dates intelligently

### Task Management
- **Categories**: Work, Personal, Health, Errands
- **Priority Levels**: P1 (urgent), P2 (important), P3 (normal)
- **Impact Levels**: High, Medium, Low
- **Drag & Drop**: Move tasks between categories seamlessly

### Smart Search
- Real-time search with 300ms debounce
- Searches across task titles and descriptions
- Instant filtering without page reload

### Data Persistence
- All tasks stored in Supabase PostgreSQL
- Real-time updates with API calls
- Automatic timestamp tracking

## 🔧 Configuration

### Changing AI Model
Edit `app/api/parseTasks/route.ts`:
```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp' // Change to gemini-1.5-flash-002 for stable version
});
```

### Customizing Categories
Edit `lib/constants.ts`:
```typescript
export const TASK_CATEGORIES = ['Work', 'Personal', 'Health', 'Errands', 'YourCategory'];
```

### Theme Customization
Edit `app/globals.css` to change colors:
```css
body {
  background: #0a0a0a; /* Ultra-dark background */
  color: #e5e5e5;      /* Light text */
}
```

## 🐛 Troubleshooting

### Voice Recording Not Working
- Ensure you're using HTTPS or localhost
- Grant microphone permissions in your browser
- Check browser compatibility (Chrome, Edge recommended)

### API Errors
- Verify your Gemini API key is correct
- Check Supabase credentials in `.env.local`
- Ensure your Supabase project is active

### Database Issues
- Confirm the tasks table exists in Supabase
- Check table permissions (enable RLS if needed)
- Verify API keys have correct access

## 📚 API Documentation

### POST /api/parseTasks
Parse voice transcription into structured tasks.

**Request:**
```json
{
  "transcription": "Buy groceries tomorrow and schedule dentist appointment"
}
```

**Response:**
```json
{
  "tasks": [
    {
      "title": "Buy groceries",
      "category": "Errands",
      "dueDate": "2025-10-27",
      "priorityLevel": "P2",
      "impactLevel": "Medium"
    }
  ],
  "success": true
}
```

### GET /api/tasks
Fetch all tasks with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 1000)

### POST /api/tasks
Create new tasks.

### PATCH /api/tasks/[id]
Update a specific task.

### DELETE /api/tasks/[id]
Delete a task.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI Language Model
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [Lucide](https://lucide.dev/) - Icon Library

## 📧 Support

For support, email [your-email@example.com] or open an issue in the repository.

---

**Built with ❤️ using Next.js, Google Gemini AI, and Supabase**
