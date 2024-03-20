# Etapa 1: Construir la aplicación
FROM node:alpine as builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

RUN npx prisma db push

# Ejecutar el comando de construcción
RUN npm run build

CMD ["node", "dist/index.js"]