# Архитектура Базы Данных и Безопасности (Project Mentor Harbor)

Для обеспечения безопасности данных и масштабируемости проекта рекомендуется переход с `localStorage` на реальную базу данных (PostgreSQL) с использованием **Row Level Security (RLS)**.

Мы рекомендуем использовать **Supabase** как Backend-as-a-Service, так как он идеально интегрируется с Next.js и предоставляет Auth + DB из коробки.

## 1. Схема Базы Данных (PostgreSQL)

### Таблица: `profiles` (Профили пользователей)
Расширяет стандартную таблицу `auth.users`.
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('author', 'buyer')),
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Таблица: `courses` (Курсы)
```sql
create table courses (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references profiles(id) not null,
  title text not null,
  description text,
  price integer default 0,
  status text check (status in ('draft', 'published', 'archived')),
  created_at timestamp with time zone default now()
);
```

### Таблица: `enrollments` (Покупки/Записи)
Связывает студентов с курсами.
```sql
create table enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  course_id uuid references courses(id) not null,
  status text default 'active',
  created_at timestamp with time zone default now(),
  unique(user_id, course_id)
);
```

### Таблица: `lessons` (Уроки)
Контент курса.
```sql
create table lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) not null,
  title text not null,
  content text, -- или ссылка на видео
  is_free boolean default false, -- для промо-просмотра
  order_index integer
);
```

---

## 2. Политики Безопасности (RLS - Row Level Security)

RLS — это "файервол" внутри базы данных. Даже если API взломают, хакер не сможет прочитать чужие данные, так как база ему их не отдаст.

### Правила для `profiles`
*   **SELECT (Чтение)**: Разрешено всем (публичные профили).
*   **UPDATE (Изменение)**: Только если `auth.uid() == id` (пользователь меняет сам себя).

### Правила для `courses`
*   **SELECT**:
    *   Если `status = 'published'` — видно всем.
    *   Если `status = 'draft'` — видно только автору (`auth.uid() == author_id`).
*   **INSERT/UPDATE/DELETE**: Только автор (`auth.uid() == author_id`).

### Правила для `lessons` (Критически важно! 🛡️)
*   **SELECT**: Разрешено ТОЛЬКО если:
    1.  Пользователь — автор курса (`courses.author_id == auth.uid()`).
    2.  ИЛИ Пользователь купил курс (есть запись в `enrollments` где `user_id == auth.uid()`).
    3.  ИЛИ Урок помечен как бесплатный (`is_free = true`).

```sql
-- Пример политики для уроков
create policy "Lessons are visible to author or enrolled students"
on lessons for select
using (
  exists (
    select 1 from courses
    where courses.id = lessons.course_id
    and courses.author_id = auth.uid()
  )
  or
  exists (
    select 1 from enrollments
    where enrollments.course_id = lessons.course_id
    and enrollments.user_id = auth.uid()
  )
  or
  is_free = true
);
```

## 3. Защита Контента (Видео)
Прямые ссылки на MP4 небезопасны (их можно скачать).
**Решение**: Использовать Signed URLs (Подписанные ссылки).
1.  Видео хранятся в приватном бакете (S3/Supabase Storage).
2.  При загрузке урока сервер проверяет права (через RLS).
3.  Если права есть, сервер генерирует временную ссылку (действует 1 час).
4.  Клиент получает ссылку вида `https://cdn.site.com/video.mp4?token=xyz...`.

## 4. Следующие шаги
1.  Создать проект в Supabase.
2.  Настроить переменные окружения (`NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY`).
3.  Заменить текущий `store.ts` на вызовы `supabase.from('...').select()`.
