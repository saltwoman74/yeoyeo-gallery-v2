-- YEOYEO Gallery - Videos Table Setup
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access (anyone can view videos)
CREATE POLICY "Allow public read access" ON videos
  FOR SELECT
  USING (true);

-- 4. Allow public insert (anyone can add videos via admin panel)
CREATE POLICY "Allow public insert" ON videos
  FOR INSERT
  WITH CHECK (true);

-- 5. Allow public delete (anyone can delete videos via admin panel)
CREATE POLICY "Allow public delete" ON videos
  FOR DELETE
  USING (true);

-- 6. Create index for faster queries
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);

-- Verify table was created
SELECT * FROM videos;
