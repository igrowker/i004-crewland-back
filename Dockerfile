# Dockerfile para el backend
FROM node:18-alpine AS build

WORKDIR /app

# Copio package*.json
COPY package*.json ./

# Instalo todas las dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Etapa final
FROM node:18-alpine

WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=build /app /app

EXPOSE 3000
CMD ["npm", "run", "dev"]



######### aditional steps ##########
# Para buildear la imagen y correr un contenedor
# docker build -t crewland-backend-image:latest .
# docker run -p 3000:3000 --name crewland-backend crewland-backend-image

