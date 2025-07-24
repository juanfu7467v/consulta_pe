# Usa una imagen base de Node.js que sea compatible con Puppeteer
# node:18-slim es una buena opción ya que es ligera pero basada en Debian/Ubuntu
FROM node:18-slim

# Instala las dependencias de sistema necesarias para Puppeteer/Chromium
# Estas son las librerías que Chromium necesita para funcionar en un entorno "headless"
RUN apt-get update && apt-get install -y \
    chromium \
    # Librerías comunes para Puppeteer
    libnss3 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm-dev \
    libxkbcommon-x11-0 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    # Limpia el cache de apt para reducir el tamaño de la imagen
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json (si lo tienes)
# Esto permite que Docker use el cache de la capa si las dependencias no cambian
COPY package*.json ./

# Instala las dependencias de Node.js
# --omit=dev asegura que las dependencias de desarrollo no se instalen en producción
RUN npm install --omit=dev

# Copia el resto de los archivos de tu aplicación al contenedor
COPY . .

# Expone el puerto en el que tu aplicación Express escucha
# Asegúrate de que coincida con el puerto que usas en index.js (process.env.PORT o 3000)
EXPOSE 3000

# Comando para iniciar tu aplicación cuando el contenedor se ejecute
CMD ["npm", "run", "start"]
