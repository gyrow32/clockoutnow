-- Add preview_page_slug to leads table
-- This links leads to their preview pages

alter table leads add column preview_page_slug text;

-- Add index for faster lookups
create index idx_leads_preview_page on leads(preview_page_slug);

-- Add comment
comment on column leads.preview_page_slug is 'Slug for the preview page (e.g., "buffalo-plumbing-services")';
