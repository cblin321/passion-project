FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0"]



