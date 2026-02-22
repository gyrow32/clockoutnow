-- Leads Table for Prospect Tracking
-- Stores businesses we're targeting before we send them emails

create table leads (
  id uuid default gen_random_uuid() primary key,
  company_name text not null,
  industry text,
  city_region text,
  location text,
  service_area text,
  services_offered text,
  phone text,
  email text,
  website text,
  craigslist_url text,
  has_website boolean default false,
  business_strength text,
  landing_page_notes text,
  status text default 'NEW',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Auto-update updated_at
create trigger leads_updated_at
  before update on leads
  for each row
  execute function update_updated_at();

-- Indexes
create index idx_leads_company_name on leads(company_name);
create index idx_leads_status on leads(status);
create index idx_leads_industry on leads(industry);

-- Comments
comment on table leads is 'Prospect businesses from Craigslist for outbound campaigns';
comment on column leads.status is 'Lead status: NEW, RESEARCHING, READY, CONTACTED, SKIPPED';

-- Disable RLS (same as campaigns)
alter table leads disable row level security;
