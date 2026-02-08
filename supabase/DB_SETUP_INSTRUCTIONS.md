# Инструкция по настройке Базы Данных (Supabase)

Чтобы регистрация и вход работали, вам нужно создать таблицы в базе данных.

## 1. Откройте SQL Editor
1. Зайдите в [Supabase Dashboard](https://supabase.com/dashboard).
2. Выберите свой проект.
3. В левом меню нажмите на иконку **SQL Editor**.

## 2. Запустите скрипт
Скопируйте весь код ниже и вставьте его в редактор, затем нажмите **RUN**.

```sql
-- Включаем расширение для генерации UUID
create extension if not exists "uuid-ossp";

-- 1. Таблица ПРОФИЛЕЙ (Связанная с пользователями)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text check (role in ('author', 'buyer', 'admin')) default 'buyer',
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Включаем защиту данных (RLS)
alter table public.profiles enable row level security;

-- Политики доступа
create policy "Профили видны всем" on public.profiles for select using (true);
create policy "Пользователь может менять свой профиль" on public.profiles for update using (auth.uid() = id);

-- 2. Триггер для автоматического создания профиля при регистрации
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

-- Удаляем триггер если он был, чтобы пересоздать
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Дополнительные таблицы (если их нет)
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;
create policy "Курсы видны всем" on public.courses for select using (true);
create policy "Авторы управляют своими курсами" on public.courses for all using (auth.uid() = author_id);
```

## 3. Проверьте настройки URL
1. Перейдите в **Authentication -> URL Configuration**.
2. **Site URL**: `http://77.232.128.86` (или ваш домен)
3. **Redirect URLs**: Добавьте `http://77.232.128.86/auth/callback`

Теперь регистрация должна работать!
