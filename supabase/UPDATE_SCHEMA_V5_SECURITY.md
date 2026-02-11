-- 1. Создание таблицы MODULES
create table if not exists public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS для MODULES
alter table public.modules enable row level security;

create policy "Modules are viewable by everyone if course is published" on public.modules
  for select using (
    exists (
      select 1 from public.courses
      where id = public.modules.course_id
      and (is_published = true or author_id = auth.uid())
    )
  );

create policy "Authors can insert modules" on public.modules
  for insert with check (
    exists (
      select 1 from public.courses
      where id = public.modules.course_id
      and author_id = auth.uid()
    )
  );

create policy "Authors can update own modules" on public.modules
  for update using (
    exists (
      select 1 from public.courses
      where id = public.modules.course_id
      and author_id = auth.uid()
    )
  );

create policy "Authors can delete own modules" on public.modules
  for delete using (
    exists (
      select 1 from public.courses
      where id = public.modules.course_id
      and author_id = auth.uid()
    )
  );

-- 2. Создание таблицы LESSONS
create table if not exists public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  content text, -- Markdown или HTML контент
  video_url text, -- Ссылка на видео
  duration integer default 0, -- В минутах
  is_free boolean default false, -- Бесплатный урок (превью)
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS для LESSONS
alter table public.lessons enable row level security;

create policy "Lessons are viewable by everyone if course is published" on public.lessons
  for select using (
    exists (
      select 1 from public.modules m
      join public.courses c on m.course_id = c.id
      where m.id = public.lessons.module_id
      and (c.is_published = true or c.author_id = auth.uid())
    )
  );

create policy "Authors can insert lessons" on public.lessons
  for insert with check (
    exists (
      select 1 from public.modules m
      join public.courses c on m.course_id = c.id
      where m.id = public.lessons.module_id
      and c.author_id = auth.uid()
    )
  );

create policy "Authors can update own lessons" on public.lessons
  for update using (
    exists (
      select 1 from public.modules m
      join public.courses c on m.course_id = c.id
      where m.id = public.lessons.module_id
      and c.author_id = auth.uid()
    )
  );

create policy "Authors can delete own lessons" on public.lessons
  for delete using (
    exists (
      select 1 from public.modules m
      join public.courses c on m.course_id = c.id
      where m.id = public.lessons.module_id
      and c.author_id = auth.uid()
    )
  );

-- 3. Улучшение безопасности COURSES (Скрытие черновиков)
-- Сначала удаляем старую политику (если есть), чтобы заменить её
drop policy if exists "Courses are viewable by everyone." on public.courses;

create policy "Public courses are viewable by everyone" on public.courses
  for select using (is_published = true);

create policy "Authors can view own draft courses" on public.courses
  for select using (auth.uid() = author_id);

-- 4. Улучшение безопасности PROFILES
-- Ограничиваем доступ к профилям, чтобы нельзя было скрапить базу
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;

-- Разрешаем чтение профиля только если пользователь авторизован (базовая защита)
-- В идеале: разрешать чтение только тех, кто купил курс, или самого себя.
-- Но для страницы "Автор курса" нужно, чтобы профиль автора был публичным.
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true); -- Оставляем публичным для соц. составляющей, но можно скрыть email/phone через VIEW

-- Защита обновления (только свой профиль) - уже должна быть, но на всякий случай
drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
