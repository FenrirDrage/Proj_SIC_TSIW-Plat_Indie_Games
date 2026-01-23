FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --silent

COPY . .

EXPOSE 4004
ENV NODE_ENV=production
CMD ["node", "src/server.js"]
