-- PROTOTYPE SUPABASE SETUP SCRIPT
-- This script sets up all necessary tables, storage, and RLS policies for the Portfolio project.

-- ==========================================
-- 0. HELPER FUNCTIONS
-- ==========================================

-- Function to automatically update 'updated_at' timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ==========================================
-- 1. SETUP STORAGE BUCKETS
-- ==========================================

-- Create storage bucket for images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- ==========================================
-- 2. SETUP STORAGE POLICIES
-- ==========================================

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

-- ==========================================
-- 3. TABLES DEFINITIONS
-- ==========================================

-- HOME_CONTENT TABLE
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

-- CONTACT_CONTENT TABLE
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

-- TIMELINE_CONTENT TABLE
create table if not exists public.timeline_content (
  id uuid default gen_random_uuid() primary key,
  type text not null, -- 'education', 'experience'
  title text not null,
  organization text,
  period text,
  description text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ABOUT_CONTENT TABLE
create table if not exists public.about_content (
  id uuid default gen_random_uuid() primary key,
  heading text,
  description text,
  activities text[],
  quote text,
  quote_author text,
  skill_bars jsonb default '{"frontend": [], "backend": [], "tools": []}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROJECTS TABLE
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  technologies text[],
  img_path text,
  gh_link text,
  demo_link text,
  is_blog boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CERTIFICATES TABLE
create table if not exists public.certificates (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  issuer text,
  date date,
  img_path text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SKILLS TABLE
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon_name text,
  category text, -- 'frontend', 'backend', 'tools'
  display_order integer default 999,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RESUME TABLE
create table if not exists public.resume (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  file_name text,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- APP_STATS TABLE
create table if not exists public.app_stats (
  id text primary key, -- use 'portfolio' as identifier
  views integer default 0
);

-- MESSAGES TABLE (Contact Form)
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. PERFORMANCE INDICES
-- ==========================================

create index if not exists idx_projects_created_at on public.projects(created_at desc);
create index if not exists idx_certificates_created_at on public.certificates(created_at desc);
create index if not exists idx_timeline_created_at on public.timeline_content(created_at desc);
create index if not exists idx_skills_display_order on public.skills(display_order asc);
create index if not exists idx_messages_created_at on public.messages(created_at desc);

-- ==========================================
-- 5. UPDATED_AT TRIGGERS
-- ==========================================

create trigger tr_home_updated_at before update on public.home_content for each row execute function public.handle_updated_at();
create trigger tr_about_updated_at before update on public.about_content for each row execute function public.handle_updated_at();
create trigger tr_contact_updated_at before update on public.contact_content for each row execute function public.handle_updated_at();
create trigger tr_projects_updated_at before update on public.projects for each row execute function public.handle_updated_at();

-- ==========================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table public.home_content enable row level security;
alter table public.contact_content enable row level security;
alter table public.timeline_content enable row level security;
alter table public.about_content enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.skills enable row level security;
alter table public.resume enable row level security;
alter table public.app_stats enable row level security;
alter table public.messages enable row level security;

-- ==========================================
-- 7. RLS POLICIES
-- ==========================================

-- Helper macro-like approach for Public Read policies
DO $$
BEGIN
    -- Public Read Policies
    EXECUTE 'create policy "Allow Public Read Home" on public.home_content for select to anon, authenticated using (true)';
    EXECUTE 'create policy "Allow Public Read Contact" on public.contact_content for select to anon, authenticated using (true)';
    EXECUTE 'create policy "Allow Public Read Timeline" on public.timeline_content for select to anon, authenticated using (true)';
    EXECUTE 'create policy "Allow Public Read About" on public.about_content for select to anon, authenticated using (true)';
    EXECUTE 'create policy "Allow Public Read Projects" on public.projects for select to anon, authenticated using (true)';
    EXECUTE 'create policy "Allow Public Read Certificates" on public.certificates for select to anon, authenticated using (true)';
    EXECUTE 'create policy "Allow Public Read Skills" on public.skills for select to anon, authenticated using (true)';
    EXECUTE 'create policy "Allow Public Read Resume" on public.resume for select to anon, authenticated using (true)';
    EXECUTE 'create policy "Allow Public Read Stats" on public.app_stats for select to anon, authenticated using (true)';
    
    -- Authenticated Update Policies (Owner/Admin)
    EXECUTE 'create policy "Allow Authenticated Update Home" on public.home_content for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "Allow Authenticated Update Contact" on public.contact_content for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "Allow Authenticated Update Timeline" on public.timeline_content for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "Allow Authenticated Update About" on public.about_content for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "Allow Authenticated Update Projects" on public.projects for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "Allow Authenticated Update Certificates" on public.certificates for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "Allow Authenticated Update Skills" on public.skills for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "Allow Authenticated Update Resume" on public.resume for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "Allow Authenticated Update Stats" on public.app_stats for update to authenticated using (true) with check (true)';

    -- Authenticated Manage Policies (Insert/Delete)
    EXECUTE 'create policy "Allow Authenticated Insert Home" on public.home_content for insert to authenticated with check (true)';
    EXECUTE 'create policy "Allow Authenticated Insert Contact" on public.contact_content for insert to authenticated with check (true)';
    EXECUTE 'create policy "Allow Authenticated Insert Timeline" on public.timeline_content for insert to authenticated with check (true)';
    EXECUTE 'create policy "Allow Authenticated Insert About" on public.about_content for insert to authenticated with check (true)';
    EXECUTE 'create policy "Allow Authenticated Insert Projects" on public.projects for insert to authenticated with check (true)';
    EXECUTE 'create policy "Allow Authenticated Insert Certificates" on public.certificates for insert to authenticated with check (true)';
    EXECUTE 'create policy "Allow Authenticated Insert Skills" on public.skills for insert to authenticated with check (true)';
    EXECUTE 'create policy "Allow Authenticated Insert Resume" on public.resume for insert to authenticated with check (true)';
    EXECUTE 'create policy "Allow Authenticated Delete Timeline" on public.timeline_content for delete to authenticated using (true)';
    EXECUTE 'create policy "Allow Authenticated Delete Projects" on public.projects for delete to authenticated using (true)';
    EXECUTE 'create policy "Allow Authenticated Delete Certificates" on public.certificates for delete to authenticated using (true)';
    EXECUTE 'create policy "Allow Authenticated Delete Skills" on public.skills for delete to authenticated using (true)';

    -- Public Submit Policy for Messages
    EXECUTE 'create policy "Allow Public Submit Message" on public.messages for insert to anon, authenticated with check (true)';
    -- Authenticated Read Messages
    EXECUTE 'create policy "Allow Authenticated Read Messages" on public.messages for select to authenticated using (true)';
    -- Authenticated Delete Messages
    EXECUTE 'create policy "Allow Authenticated Delete Messages" on public.messages for delete to authenticated using (true)';

EXCEPTION WHEN duplicate_object THEN
    -- Ignore errors if policies already exist
    NULL;
END $$;

-- ==========================================
-- 8. INITIAL SEED DATA
-- ==========================================

-- Default stats
insert into public.app_stats (id, views)
values ('portfolio', 0)
on conflict (id) do nothing;

-- Default Home Content
insert into public.home_content (heading, name, intro_title, intro_body)
values ('Hi There!', 'Rajashekhar V N', 'Welcome To My Workspace', 'I am a Full Stack Developer passionate about building robust and scalable web applications.')
on conflict do nothing;

-- Default Contact Content
insert into public.contact_content (email, phone, location)
values ('rajashekhar.naduvinahalli@gmail.com', '+91 8050961805', 'Karnataka, India')
on conflict do nothing;

-- Default About Content
insert into public.about_content (heading, description, quote, quote_author)
values ('KNOW WHO I''M', 'I am a passionate Full Stack Developer with a knack for creating interactive and high-performance web applications.', 'Strive to build things that make a difference!', 'Rajashekhar')
on conflict do nothing;
