# Використовуємо офіційний образ Node.js
FROM node:18

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо файли package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код у контейнер
COPY . .

# Відкриваємо порт
EXPOSE 3000

# Команда запуску
CMD ["npm", "start"]

#Збір образа
#docker build -t my-backend ./todolist_backend

#Запуск контейнера
#docker run -p 3000:3000 my-backend

#запуск докера
#docker compose up -d
#docker compose down -v