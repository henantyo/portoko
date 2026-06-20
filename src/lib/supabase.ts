import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables or localStorage
export function getSupabaseCredentials() {
  if (typeof window === 'undefined') {
    return { url: '', anonKey: '' };
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem('neo_supabase_url') || '';
  const localKey = localStorage.getItem('neo_supabase_anon_key') || '';

  return {
    url: envUrl || localUrl,
    anonKey: envKey || localKey,
  };
}

export function isSupabaseConfigured(): boolean {
  // Prefer env first (stable), fallback to localStorage.
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) return true;

  const { url, anonKey } = getSupabaseCredentials();
  return !!url && !!anonKey;
}


export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;
  
  try {
    return createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

// SQL Script to create tables in Supabase (for presentation/reference)
export const SUPABASE_SQL_SETUP = `-- 1. CREATE PROFILE TABLE
CREATE TABLE IF NOT EXISTS profile (
  id text PRIMARY KEY,
  name text NOT NULL,
  title text NOT NULL,
  bio text,
  about_long text,
  school text,
  major text,
  avatar text,
  cv_url text,
  email text,
  whatsapp text,
  github text,
  linkedin text,
  instagram text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CREATE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  image text,
  tech_stack text[] DEFAULT '{}'::text[],
  demo_url text,
  github_url text,
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL, -- 'Frontend', 'Backend', 'Tools', 'Other'
  level integer DEFAULT 80,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS experiences (
  id text PRIMARY KEY,
  role text NOT NULL,
  company text NOT NULL,
  period text NOT NULL,
  description text,
  current boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) or keep policies public for simplicity in portfolio
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create public select policies
CREATE POLICY "Allow public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read experiences" ON experiences FOR SELECT USING (true);

-- Create public write policies (or restrict to authenticated - for portfolio, public write is easiest if not using auth)
CREATE POLICY "Allow public insert/update/delete profile" ON profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update/delete projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update/delete skills" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update/delete experiences" ON experiences FOR ALL USING (true) WITH CHECK (true);
`;
