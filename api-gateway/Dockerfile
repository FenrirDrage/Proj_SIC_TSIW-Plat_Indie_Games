# Use official Node LTS
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --silent

COPY . .

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "src/server.js"]
