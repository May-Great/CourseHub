# Руководство по деплою (Ubuntu + PM2 + Nginx)

Это руководство поможет развернуть приложение на чистом сервере Ubuntu 22.04.

## 1. Подготовка сервера

Установите Node.js 18+, Nginx и Git:

```bash
# Обновляем пакеты
sudo apt update && sudo apt upgrade -y

# Устанавливаем Nginx и Git
sudo apt install nginx git -y

# Устанавливаем Node.js (через nvm или напрямую)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Устанавливаем PM2 глобально
sudo npm install -g pm2
```

## 2. Установка проекта

Клонируем репозиторий в `/var/www/coursehub`:

```bash
# Создаем папку и даем права (замените ubuntu на вашего пользователя)
sudo mkdir -p /var/www/coursehub
sudo chown -R $USER:$USER /var/www/coursehub

# Клонируем (замените URL на ваш репозиторий)
git clone https://github.com/May-Great/CourseHub.git /var/www/coursehub
cd /var/www/coursehub

# Устанавливаем зависимости
npm ci
```

## 3. Настройка переменных окружения

Создайте файл `.env.local`:

```bash
nano .env.local
```

Вставьте минимальный конфиг (если используете Supabase):

```env
NEXT_PUBLIC_SUPABASE_URL=ваш_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_ключ
```

*Если переменных нет, приложение запустится в Demo Mode (с мок-данными).*

## 4. Сборка и запуск

```bash
# Собираем приложение
npm run build

# Запускаем через PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 5. Настройка Nginx

Создайте конфиг сайта:

```bash
sudo nano /etc/nginx/sites-available/coursehub
```

Вставьте следующий конфиг:

```nginx
server {
    listen 80;
    server_name _;  # Или ваш IP/домен

    # Gzip Compression
    gzip on;
    gzip_proxied any;
    gzip_comp_level 4;
    gzip_types text/css application/javascript image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Передача реального IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте сайт и перезапустите Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/coursehub /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Если нужно удалить дефолтный сайт
sudo nginx -t
sudo systemctl restart nginx
```

## 6. Обновление (Update Checklist)

Чтобы обновить приложение одной командой (можно сделать alias):

```bash
cd /var/www/coursehub
git pull
npm ci
npm run build
pm2 restart coursehub
```
