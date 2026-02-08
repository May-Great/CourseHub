-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS (Profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text check (role in ('author', 'buyer', 'admin')) default 'buyer',
  is_admin boolean default false,
  last_seen_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Admin Policy: Admins can update anyone
create policy "Admins can update all profiles" on public.profiles
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 2. ANALYTICS EVENTS
create table if not exists public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  event_name text not null, -- 'page_view', 'registration', 'login'
  user_id uuid references auth.users(id) on delete set null,
  path text,
  metadata jsonb default '{}'::jsonb,
  ip_hash text, -- Anonymized IP for spam check
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.analytics_events enable row level security;

-- Allow inserts from authenticated and anon users (for tracking visits)
create policy "Anyone can insert analytics" on public.analytics_events
  for insert with check (true);

-- Only admins can view analytics
create policy "Admins can view analytics" on public.analytics_events
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 3. COURSES (Existing)
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  price decimal(10, 2) default 0,
  cover_url text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;
create policy "Courses are viewable by everyone." on public.courses for select using (true);
create policy "Authors can create courses." on public.courses for insert with check (auth.uid() = author_id);
create policy "Authors can update own courses." on public.courses for update using (auth.uid() = author_id);
create policy "Authors can delete own courses." on public.courses for delete using (auth.uid() = author_id);

-- 4. TRIGGER FOR NEW USERS
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
