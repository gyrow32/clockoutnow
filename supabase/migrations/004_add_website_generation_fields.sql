-- Add fields for auto-generating preview websites
-- These fields are populated during lead enrichment phase

-- Core enrichment fields
alter table leads add column owner_name text;
alter table leads add column business_description text;
alter table leads add column tagline text;

-- Social/external links
alter table leads add column facebook_url text;
alter table leads add column google_business_url text;

-- Image tracking
alter table leads add column photos_json jsonb;
alter table leads add column hero_image_url text;

-- Email campaign tracking
alter table leads add column preview_site_url text;
alter table leads add column email_sent_at timestamp with time zone;
alter table leads add column email_opened_at timestamp with time zone;
alter table leads add column preview_site_visited_at timestamp with time zone;

-- Indexes for common queries
create index idx_leads_owner_name on leads(owner_name);
create index idx_leads_email_sent on leads(email_sent_at);

-- Comments
comment on column leads.owner_name is 'Business owner name for personalization';
comment on column leads.business_description is '2-3 sentence about section for the preview site';
comment on column leads.tagline is 'Catchy one-liner for hero section';
comment on column leads.facebook_url is 'Facebook page URL (for research/scraping)';
comment on column leads.google_business_url is 'Google Business profile URL';
comment on column leads.photos_json is 'Array of business photos scraped from Facebook/Google: [{"url": "...", "description": "..."}]';
comment on column leads.hero_image_url is 'Generated or selected hero image for preview site';
comment on column leads.preview_site_url is 'Full URL to the generated preview site';
comment on column leads.email_sent_at is 'When we sent the preview email to this lead';
comment on column leads.email_opened_at is 'When they opened the preview email';
comment on column leads.preview_site_visited_at is 'When they first visited their preview site';
