-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS (Profiles)
-- Extends Supabase Auth (auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text check (role in ('author', 'buyer')) default 'buyer',
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

-- 2. COURSES
create table public.courses (
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

-- Enable RLS
alter table public.courses enable row level security;

-- Policies for Courses
create policy "Courses are viewable by everyone." on public.courses
  for select using (true); -- Or only published ones: using (is_published = true or auth.uid() = author_id)

create policy "Authors can create courses." on public.courses
  for insert with check (auth.uid() = author_id);

create policy "Authors can update own courses." on public.courses
  for update using (auth.uid() = author_id);

create policy "Authors can delete own courses." on public.courses
  for delete using (auth.uid() = author_id);

-- 3. MODULES (Sections within a course)
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.modules enable row level security;

-- Policies for Modules (Inherit from Course ownership)
create policy "Modules viewable by everyone" on public.modules for select using (true);
create policy "Authors can manage modules" on public.modules using (
  exists (select 1 from public.courses where id = modules.course_id and author_id = auth.uid())
);

-- 4. LESSONS
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  content text, -- Markdown or JSON content
  video_url text,
  type text check (type in ('video', 'text', 'quiz')) default 'text',
  "order" integer default 0,
  is_free boolean default false, -- Preview lesson
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;

-- Policies for Lessons
create policy "Lessons viewable by everyone" on public.lessons for select using (true);
create policy "Authors can manage lessons" on public.lessons using (
  exists (
    select 1 from public.modules m
    join public.courses c on m.course_id = c.id
    where m.id = lessons.module_id and c.author_id = auth.uid()
  )
);

-- 5. ENROLLMENTS (Purchases)
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "Users can view own enrollments" on public.enrollments 
  for select using (auth.uid() = user_id);

create policy "Authors can view enrollments for their courses" on public.enrollments 
  for select using (
    exists (select 1 from public.courses where id = enrollments.course_id and author_id = auth.uid())
  );

-- Trigger to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'buyer'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
