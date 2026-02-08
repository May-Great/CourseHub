-- 1. ENROLLMENTS (Покупки/Записи на курсы)
create table if not exists public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  status text check (status in ('active', 'completed', 'archived')) default 'active',
  progress integer default 0, -- Процент прохождения (0-100)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id) -- Нельзя записаться дважды на один курс
);

alter table public.enrollments enable row level security;

-- Студент видит только свои записи
create policy "Users can view own enrollments" on public.enrollments
  for select using (auth.uid() = user_id);

-- Автор курса видит, кто записан (для аналитики)
create policy "Authors can view enrollments for their courses" on public.enrollments
  for select using (
    exists (
      select 1 from public.courses
      where id = public.enrollments.course_id
      and author_id = auth.uid()
    )
  );

-- Студент может создавать запись (покупка/бесплатный вход)
create policy "Users can enroll themselves" on public.enrollments
  for insert with check (auth.uid() = user_id);

-- 2. STORAGE (Аватарки)
-- ВАЖНО: Этот SQL создает политики, но сам бакет 'avatars' лучше создать через UI Supabase, 
-- так как SQL-команды для Storage API специфичны и иногда требуют расширений.
-- Но мы добавим политики на случай, если бакет уже есть.

-- (Политики для storage.objects нужно добавлять вручную или через API, 
-- ниже пример для понимания, но лучше делать через Dashboard -> Storage -> Policies)

-- 3. ОБНОВЛЕНИЕ COURSES (Если еще нет is_published)
-- (Уже есть в предыдущих миграциях, но для надежности)
-- alter table public.courses add column if not exists is_published boolean default false;
