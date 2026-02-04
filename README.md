# CourseHub

Современная LMS-платформа для создания и прохождения курсов.

## 🚀 Особенности

*   **Для авторов:** Создание курсов, управление модулями и уроками, загрузка видео.
*   **Для студентов:** Удобный плеер, прохождение тестов, отслеживание прогресса.
*   **Технологии:** Next.js 16, Supabase, Tailwind CSS, TypeScript.

## 🛠 Установка и запуск

1.  Клонируйте репозиторий:
    ```bash
    git clone https://github.com/your-username/course-platform.git
    cd course-platform
    ```

2.  Установите зависимости:
    ```bash
    npm install
    ```

3.  Настройте переменные окружения:
    Создайте файл `.env.local` и добавьте ключи Supabase (см. `supabase/README.md`):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=ваш_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_ключ
    ```

4.  Запустите сервер разработки:
    ```bash
    npm run dev
    ```

## 🏗 Архитектура

Подробное описание архитектуры и базы данных можно найти в файлах:
*   [ARCHITECTURE.md](./ARCHITECTURE.md)
*   [ROADMAP.md](./ROADMAP.md)
*   [supabase/README.md](./supabase/README.md)

## 📄 Лицензия

MIT
