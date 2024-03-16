FROM node:20.11.1

WORKDIR /goit-node-rest-api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]