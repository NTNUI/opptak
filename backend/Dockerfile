FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .

CMD ["pm2-runtime", "build/app.js"]