-- Enable the storage schema if not already managed (usually enabled by default in Supabase)
-- create extension if not exists "storage";

-- 1. SETUP STORAGE BUCKET
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- 2. SETUP STORAGE POLICIES
-- Allow public access to view files in the 'portfolio-images' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'portfolio-images' );

-- Allow authenticated users to upload files to 'portfolio-images' bucket
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'portfolio-images' );

-- Allow authenticated users to update files in 'portfolio-images' bucket
create policy "Authenticated Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'portfolio-images' );

-- Allow authenticated users to delete files in 'portfolio-images' bucket
create policy "Authenticated Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'portfolio-images' );


-- 3. SETUP HOME_CONTENT TABLE
create table if not exists public.home_content (
  id uuid default gen_random_uuid() primary key,
  heading text,
  name text,
  intro_title text,
  intro_body text,
  github_link text,
  linkedin_link text,
  instagram_link text,
  avatar_url text,
  main_img_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.home_content enable row level security;

-- 4. SETUP HOME_CONTENT POLICIES

-- Allow public read access
create policy "Allow Public Read"
on public.home_content
for select
to anon, authenticated
using (true);

-- Allow authenticated update access
create policy "Allow Authenticated Update"
on public.home_content
for update
to authenticated
using (true)
with check (true);

-- Allow authenticated insert access (needed if the row doesn't exist yet)
create policy "Allow Authenticated Insert"
on public.home_content
for insert
to authenticated
with check (true);

-- Optional: Insert a default row if table is empty
insert into public.home_content (heading, name, intro_title, intro_body)
select 'Hi There!', 'My Name', 'Welcome', 'This is my portfolio.'
where not exists (select 1 from public.home_content);

-- 5. SETUP CONTACT_CONTENT TABLE
create table if not exists public.contact_content (
  id uuid default gen_random_uuid() primary key,
  email text,
  phone text,
  location text,
  github text,
  linkedin text,
  instagram text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_content enable row level security;

-- 6. SETUP CONTACT_CONTENT POLICIES

-- Allow public read access
create policy "Allow Public Read Contact"
on public.contact_content
for select
to anon, authenticated
using (true);

-- Allow authenticated update access
create policy "Allow Authenticated Update Contact"
on public.contact_content
for update
to authenticated
using (true)
with check (true);

-- Allow authenticated insert access
create policy "Allow Authenticated Insert Contact"
on public.contact_content
for insert
to authenticated
with check (true);

-- Optional: Insert a default row if table is empty
insert into public.contact_content (email, phone, location)
select 'your_email@example.com', '+1234567890', 'City, Country'
where not exists (select 1 from public.contact_content);

-- 7. SETUP TIMELINE_CONTENT TABLE
create table if not exists public.timeline_content (
  id uuid default gen_random_uuid() primary key,
  type text not null, -- 'education', 'experience', 'achievement', 'certification'
  title text not null,
  organization text,
  period text,
  description text,
  icon text, -- 'fas fa-graduation-cap', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.timeline_content enable row level security;

-- 8. SETUP TIMELINE_CONTENT POLICIES

-- Allow public read access
create policy "Allow Public Read Timeline"
on public.timeline_content
for select
to anon, authenticated
using (true);

-- Allow authenticated insert
create policy "Allow Authenticated Insert Timeline"
on public.timeline_content
for insert
to authenticated
with check (true);

-- Allow authenticated update
create policy "Allow Authenticated Update Timeline"
on public.timeline_content
for update
to authenticated
using (true)
with check (true);

-- Allow authenticated delete
create policy "Allow Authenticated Delete Timeline"
on public.timeline_content
for delete
to authenticated
using (true);

-- Optional: Seed default timeline data if empty
insert into public.timeline_content (type, title, organization, period, description, icon)
select 'education', 'Bachelor''s in Computer Science', 'University Name', '2020 - 2024', 'Focused on software development, algorithms, and web technologies.', 'fas fa-graduation-cap'
where not exists (select 1 from public.timeline_content);
