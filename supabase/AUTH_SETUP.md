# Настройка входа через Google и Яндекс

Код для кнопок уже написан. Теперь нужно связать ваше приложение Supabase с Google и Яндекс.

## 1. Где взять Callback URL?
Перед началом зайдите в панель управления **Supabase**:
1.  Authentication -> URL Configuration.
2.  Скопируйте **Site URL** (обычно это `http://localhost:3000` для тестов).
3.  Там же найдите **Redirect URLs** (или Callback URL). Для OAuth он обычно выглядит как:
    `https://<ваш-проект>.supabase.co/auth/v1/callback`
    *Скопируйте эту ссылку, она понадобится везде.*

---

## 2. Настройка Google

1.  Зайдите в [Google Cloud Console](https://console.cloud.google.com/).
2.  Создайте новый проект (или выберите существующий).
3.  Перейдите в **APIs & Services** -> **OAuth consent screen**.
    *   User Type: **External**.
    *   Заполните обязательные поля (название, email).
4.  Перейдите в **Credentials** -> **Create Credentials** -> **OAuth client ID**.
    *   Application type: **Web application**.
    *   **Authorized redirect URIs**: Вставьте ссылку из Supabase (`.../auth/v1/callback`).
5.  После создания вы получите **Client ID** и **Client Secret**.
6.  В Supabase: Authentication -> Providers -> **Google**.
    *   Вставьте Client ID и Client Secret.
    *   Включите переключатель "Enable Google".

---

## 3. Настройка Яндекс ID

1.  Зайдите на [Yandex OAuth](https://oauth.yandex.ru/).
2.  Нажмите **"Создать приложение"**.
3.  **Название**: CourseHub (или ваше).
4.  **Платформы**: Веб-сервисы.
5.  **Callback URI**: Вставьте ссылку из Supabase (`.../auth/v1/callback`).
6.  **Доступы**:
    *   Поставьте галочки: `login:email`, `login:info`, `login:avatar`.
7.  Создайте приложение.
8.  Вы получите **ID** и **Пароль** (Client Secret).
9.  В Supabase: Authentication -> Providers.
    *   *Если Yandex нет в списке*: В Supabase иногда Яндекс добавляется как "Custom Provider" или через WorkOS.
    *   *Простой вариант*: Если в списке провайдеров нет Yandex, проверьте раздел "WorkOS" или используйте "Bitbucket" (иногда используют как хак), но лучше проверить, поддерживает ли ваш проект Supabase Яндекс нативно (они постоянно обновляют список).
    *   **Важно**: Если нативной кнопки Yandex нет в Supabase Dashboard, напишите мне, я подскажу альтернативный путь через OpenID Connect.

---

## 4. Тестирование
1.  Перезапустите сервер (`npm run dev`).
2.  Нажмите кнопку Google или Яндекс на странице входа.
3.  Вас должно перекинуть на сайт провайдера, а потом вернуть обратно авторизованным.
