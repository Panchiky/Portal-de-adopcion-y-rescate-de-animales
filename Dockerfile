# Imagen del frontend de PatitasGo (Ionic + React compilado con Vite y servido con Nginx)

# Etapa 1: compilar la aplicación
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN CYPRESS_INSTALL_BINARY=0 npm ci
COPY . .
# La URL de la API queda incluida en el código compilado
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Etapa 2: servir solo los archivos estáticos (imagen final liviana, sin Node ni código fuente)
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
