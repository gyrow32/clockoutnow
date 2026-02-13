-- Run this SQL in your Supabase dashboard (SQL Editor) to create the required tables
-- Dashboard: https://app.supabase.com → Your Project → SQL Editor

-- Bookings table for the contact/booking form
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from the website form)
CREATE POLICY "Allow anonymous inserts" ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Only allow authenticated users to read (you'll read from dashboard)
CREATE POLICY "Allow authenticated reads" ON bookings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Contacts table (alternative simple contact form)
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous contact inserts" ON contacts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated contact reads" ON contacts
  FOR SELECT
  USING (auth.role() = 'authenticated');
