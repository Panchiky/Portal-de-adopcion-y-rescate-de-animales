# Imagen de la API de PatitasGo (Node.js + Express)
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Primero solo las dependencias: Docker reutiliza esta capa si solo cambia el código
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

# No se ejecuta como root dentro del contenedor
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
