# ===== STAGE 1: BUILD =====
FROM node:20-alpine AS builder

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --silent

# Копируем проект
COPY . .

# Сборка Vite (получается папка dist)
RUN npm run build


# ===== STAGE 2: PROD (nginx) =====
FROM nginx:stable-alpine

# Копируем собранный front
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем порт nginx
EXPOSE 80

# Старт nginx
CMD ["nginx", "-g", "daemon off;"]