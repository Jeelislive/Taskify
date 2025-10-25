# Environment Variables Setup

This project requires two API keys - both are **100% FREE** with no credit card required!

## Required Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# Google Gemini AI (for parsing tasks from voice)
GEMINI_API_KEY=your_gemini_key_here

# Supabase (for cloud database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Setup Instructions

### 1. Google Gemini API Key

See `GEMINI_SETUP.md` for detailed instructions on getting your free Gemini API key.

**Quick link:** https://makersuite.google.com/app/apikey

### 2. Supabase Database

See `SUPABASE_SETUP.md` for detailed instructions on setting up your free Supabase database.

**Quick link:** https://supabase.com

## After Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Your app should now be fully functional with:
   - ✅ AI task parsing (Gemini)
   - ✅ Cloud database storage (Supabase)
   - ✅ Real-time data sync

## Troubleshooting

- **"API key not configured"**: Make sure `.env.local` exists and has correct values
- **"Failed to connect to Supabase"**: Check your Supabase URL and anon key
- **Changes not reflecting**: Restart the dev server after updating `.env.local`

