# 1. Usamos la imagen oficial de Node.js
FROM node:18-alpine

# 2. Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de empaquetado e instalamos dependencias
COPY package*.json ./
RUN npm install

# 4. Copiamos todo el código del backend
COPY . .

# 5. Exponemos el puerto de Express
EXPOSE 5000

# 6. Comando para arrancar el servidor
CMD ["npm", "start"]