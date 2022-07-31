FROM node:16-alpine

WORKDIR /app

RUN npm install pm2 -g
RUN npm install typescript -g
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=8080
ENV DB_URI=${DB_URI}
EXPOSE 8080

CMD ["pm2-runtime", "build/app.js"]