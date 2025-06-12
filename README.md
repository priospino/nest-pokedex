<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Temas
- Validaciones
- CRUD contra base de datos MongoDB con mongoose
- Docker y Docker Compose
- Conectar contenedor con filesystem (para mantener la data de la base de datos)
- Schemas
- Modelos
- DTOs y sus extensiones
- Respaldar a Github
- Pipe Personalizado


# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```

5. Levantar la aplicación
```
yarn start:dev

```

6. Llenar la BD
```
http://localhost:3000/api/v2/seed/llenar

```



## Stack usado
* MongoDB
* Nest 
  * Mongoose para conectar a la BD Mongo
      yarn add @nestjs/mongoose mongoose
  * Axios: cliente HTTP para para realizar peticiones a servicios externos, ya sea APIs REST, microservicios u otros endpoints.
      yarn add @nestjs/axios axios 