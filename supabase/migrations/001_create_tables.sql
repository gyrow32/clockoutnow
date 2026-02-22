-- Campaign Tracking & Analytics Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- ============================================================
-- CAMPAIGNS TABLE
-- ============================================================
-- Tracks all outbound email campaigns sent to leads
create table campaigns (
  id uuid default gen_random_uuid() primary key,
  business_name text not null,
  contact text not null,
  preview_page_slug text not null,
  subject_line text,
  status text not null default 'CONTACTED',
  notes text,
  response_date timestamp with time zone,
  response_notes text,
  sent_date timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Auto-update updated_at timestamp on row changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger campaigns_updated_at
  before update on campaigns
  for each row
  execute function update_updated_at();

-- Indexes for fast queries
create index idx_campaigns_status on campaigns(status);
create index idx_campaigns_sent_date on campaigns(sent_date desc);
create index idx_campaigns_slug on campaigns(preview_page_slug);

-- Add comment for documentation
comment on table campaigns is 'Tracks outbound email campaigns to Buffalo-area contractors';
comment on column campaigns.status is 'Pipeline status: NEW, CONTACTED, REPLIED, CLOSED';

-- ============================================================
-- PAGE VIEWS TABLE
-- ============================================================
-- Tracks every view of preview pages with UTM parameters
create table page_views (
  id uuid default gen_random_uuid() primary key,
  page_slug text not null,
  utm_source text,
  utm_campaign text,
  referrer text,
  viewed_at timestamp with time zone default now()
);

-- Indexes for analytics queries
create index idx_page_views_slug on page_views(page_slug);
create index idx_page_views_date on page_views(viewed_at desc);
create index idx_page_views_campaign on page_views(utm_campaign);

comment on table page_views is 'Analytics tracking for preview page visits';

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Disable RLS for now since we're using anon key from admin dashboard
-- Can enable later with proper auth if needed
alter table campaigns disable row level security;
alter table page_views disable row level security;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- After running this migration, test with:
-- SELECT * FROM campaigns;
-- SELECT * FROM page_views;
