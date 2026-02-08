-- 1. Таблица прогресса уроков
create table if not exists public.lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  is_completed boolean default false,
  last_watched_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id) -- Один прогресс на урок для пользователя
);

-- 2. Включаем RLS
alter table public.lesson_progress enable row level security;

-- 3. Политики безопасности

-- Пользователь видит только свой прогресс
create policy "Users can view own progress" on public.lesson_progress
  for select using (auth.uid() = user_id);

-- Пользователь может создавать/обновлять свой прогресс
create policy "Users can update own progress" on public.lesson_progress
  for all using (auth.uid() = user_id);

-- Автор курса может видеть прогресс своих студентов (для аналитики)
create policy "Authors can view student progress" on public.lesson_progress
  for select using (
    exists (
      select 1 from public.lessons l
      join public.modules m on l.module_id = m.id
      join public.courses c on m.course_id = c.id
      where l.id = public.lesson_progress.lesson_id
      and c.author_id = auth.uid()
    )
  );
