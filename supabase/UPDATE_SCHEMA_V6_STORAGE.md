-- Включаем расширение для работы с хранилищем (обычно включено по умолчанию)
-- Создаем бакет 'course-content' для публичных файлов (обложки, видео превью)
insert into storage.buckets (id, name, public)
values ('course-content', 'course-content', true)
on conflict (id) do nothing;

-- Создаем бакет 'secure-content' для приватных материалов уроков (PDF, полные видео)
-- Пока сделаем публичным для простоты MVP, но в будущем лучше false
insert into storage.buckets (id, name, public)
values ('secure-content', 'secure-content', true)
on conflict (id) do nothing;

-- Политики доступа (RLS) для Storage

-- 1. Чтение: Все могут читать (публичный контент)
create policy "Public Access"
on storage.objects for select
using ( bucket_id in ('course-content', 'secure-content') );

-- 2. Загрузка: Только авторизованные авторы
create policy "Authors can upload"
on storage.objects for insert
with check (
  auth.role() = 'authenticated' AND
  bucket_id in ('course-content', 'secure-content')
);

-- 3. Обновление/Удаление: Только свои файлы (владелец)
create policy "Authors can update own files"
on storage.objects for update
using ( auth.uid() = owner );

create policy "Authors can delete own files"
on storage.objects for delete
using ( auth.uid() = owner );
