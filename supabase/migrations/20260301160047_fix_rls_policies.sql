-- Fix RLS: allow anon role full access (internal admin tool, no public write endpoints)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
