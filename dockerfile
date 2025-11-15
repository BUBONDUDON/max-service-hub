# Базовый образ Node
FROM node:18

# Рабочая директория
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем всё приложение
COPY . .

# Сборка TypeScript
RUN npm run build

# HEALTHCHECK — проверяет, жив ли процесс
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD pgrep node > /dev/null || exit 1


# Команда запуска
CMD ["npm", "start"]
