# Get Your FREE Google Gemini API Key

Google Gemini AI is **100% FREE** with generous limits. Follow these steps:

## Step 1: Get API Key (2 minutes)

1. Go to https://makersuite.google.com/app/apikey
2. Click **"Get API Key"** button
3. Select **"Create API key in new project"** (or use existing project)
4. Copy the API key (starts with `AIza...`)

## Step 2: Add to Your Project

1. Open `/home/jeel/Desktop/Baaz/.env.local`
2. Replace `your_gemini_api_key_here` with your actual key:

```
GEMINI_API_KEY=AIzaSy...your_actual_key_here
DATABASE_PATH=./data/tasks.db
```

3. Save the file

## Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C in terminal)
cd /home/jeel/Desktop/Baaz
npm run dev
```

## Step 4: Test It!

1. Record your tasks with voice
2. Click "Parse Tasks with AI"
3. Watch AI extract and categorize your tasks!

## Free Limits

- **60 requests per minute**
- **1500 requests per day**
- More than enough for this project!

## Troubleshooting

If you see "Gemini API key not configured":
- Make sure you saved `.env.local` file
- Restart the dev server
- Check the key starts with `AIza`

That's it! Completely free, no credit card required! 🎉

