FROM node:lts-alpine

# устанавливаем переменные среды
ENV LOCAL_BUILD_PORT 8080
ENV MODE "prod_local"
ENV PUBLIC_PATH "/"

# устанавливаем простой HTTP-сервер для статики
RUN npm install -g serve

# делаем каталог 'app' текущим рабочим каталогом
WORKDIR /app

# копируем оба 'package.json' и 'package-lock.json' (если есть)
COPY package*.json ./

# устанавливаем зависимости проекта
RUN npm install

# копируем файлы и каталоги проекта в текущий рабочий каталог (т.е. в каталог 'app')
COPY . .

# собираем приложение для production с минификацией
RUN npm run build

EXPOSE ${LOCAL_BUILD_PORT}
CMD ["sh", "-c", "serve -l ${LOCAL_BUILD_PORT} -s dist"]
