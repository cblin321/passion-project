FROM node:latest

WORKDIR /app
COPY . .

RUN rm .env

RUN mv /app/deployment/* .

RUN rmdir app/deployment

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start-dev"]
