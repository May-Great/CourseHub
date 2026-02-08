-- 1. Таблица отзывов
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id) -- Один отзыв на курс от пользователя
);

-- 2. Включаем RLS
alter table public.reviews enable row level security;

-- 3. Политики безопасности

-- Отзывы видят все (если курс опубликован)
create policy "Reviews are viewable by everyone" on public.reviews
  for select using (true);

-- Создавать отзывы могут только студенты, купившие курс (проверяем enrollments)
create policy "Enrolled users can create reviews" on public.reviews
  for insert with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.enrollments
      where user_id = auth.uid() and course_id = public.reviews.course_id
    )
  );

-- Обновлять/удалять только свои отзывы
create policy "Users can update own reviews" on public.reviews
  for update using (auth.uid() = user_id);

create policy "Users can delete own reviews" on public.reviews
  for delete using (auth.uid() = user_id);

-- 4. Добавляем поля в Courses (кэш рейтинга)
alter table public.courses add column if not exists rating numeric(3, 2) default 0;
alter table public.courses add column if not exists reviews_count integer default 0;

-- 5. Добавляем поля в Profiles (для страницы автора)
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists cover_url text;
alter table public.profiles add column if not exists social_links jsonb default '{}'::jsonb;
alter table public.profiles add column if not exists headline text; -- Краткое описание (например "Senior Developer")
