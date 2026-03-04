-- Client image gallery management
-- Stores metadata for images uploaded via the client portal

create table if not exists client_images (
  id uuid default gen_random_uuid() primary key,
  client_slug text not null,
  filename text not null,
  storage_path text not null,
  url text not null,
  alt_text text not null default '',
  display_order integer not null default 0,
  created_at timestamptz default now()
);

create index idx_client_images_slug on client_images (client_slug);
create index idx_client_images_order on client_images (client_slug, display_order);

-- Public read access (gallery visitors), no RLS restrictions needed
-- since we use service role for writes and anon key for reads
alter table client_images disable row level security;
