# Get Your FREE Supabase Account & Database

Supabase provides a free PostgreSQL database with generous limits - perfect for our task manager!

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with your GitHub account (recommended) or email
4. **No credit card required!** ✅

## Step 2: Create a New Project

1. Click **"New Project"**
2. Enter:
   - **Name**: `baaz-task-manager` (or any name you like)
   - **Database Password**: Create a strong password and **save it**
   - **Region**: Choose the closest one to you
   - **Pricing Plan**: Select **Free** (includes 500MB database, 2GB bandwidth, 50,000 monthly active users)
3. Click **"Create new project"**
4. Wait 2-3 minutes for your database to be set up

## Step 3: Get Your API Keys

1. In your project dashboard, click the **"Settings"** icon (⚙️) on the left sidebar
2. Go to **"API"**
3. You'll see two important values:
   - **Project URL** (looks like: `https://abcdefghij.supabase.co`)
   - **anon/public key** (looks like: `eyJhbGc...` - a long string)

## Step 4: Add Keys to Your Project

1. Open `/home/jeel/Desktop/Baaz/.env.local` file
2. Add these lines (replace with YOUR values):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Example:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjQzMjAwMCwiZXhwIjoxOTMxNzkyMDAwfQ.abcdefghijklmnopqrstuvwxyz123456789
```

## Step 5: Create the Database Table

1. In Supabase dashboard, click **"SQL Editor"** on the left sidebar
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  due_date DATE NOT NULL,
  impact_level VARCHAR(20) NOT NULL,
  priority_level VARCHAR(10) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
-- In production, you'd want more restrictive policies
CREATE POLICY "Enable all operations for all users" ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see "Success. No rows returned" ✅

## Step 6: Verify Setup

1. Go to **"Table Editor"** in the left sidebar
2. You should see the `tasks` table
3. Click on it to see the columns

## You're All Set! 🎉

Your Supabase database is ready! The app will now save tasks to the cloud automatically.

## What's Included in Free Tier?

- ✅ 500 MB database space
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth per month
- ✅ 50,000 monthly active users
- ✅ 500,000 Edge Function invocations
- ✅ Real-time subscriptions
- ✅ Auto-generated APIs

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)

