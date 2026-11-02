# PatitasGo · Backend (API REST)

API del portal **PatitasGo**, para adopción y rescate de animales. Los refugios publican fichas y gestionan solicitudes, y las personas exploran animales, postulan y siguen su proceso. Corresponde a la **Entrega Parcial 2** de Ingeniería Web y Móvil (Ingeniería en Informática, PUCV).

El frontend (Ionic + React) está en la rama [`frontend`](../../tree/frontend) y consume esta API con Axios.

## Tecnologías

| Capa | Herramienta |
| --- | --- |
| Servidor | Node.js 18+ y Express 4 |
| Base de datos | PostgreSQL 16/17 con el driver `pg` |
| Autenticación | JSON Web Tokens (`jsonwebtoken`) y contraseñas con `bcryptjs` |
| Seguridad | `helmet`, `cors`, `express-rate-limit` y validación propia de entradas |
| Configuración | `dotenv` (variables en `.env`) |
| Desarrollo | `nodemon` |
| Pruebas | Colección de Postman con tests automáticos |

## Estructura del proyecto

```
backend/
├── database/
│   ├── schema.sql          # Modelo relacional (tablas, claves, índices, triggers)
│   └── seed.sql            # Datos de prueba (refugios, usuarios, animales, postulaciones)
├── docs/
│   ├── API.md              # Documentación de todos los endpoints
│   └── evidencias/         # Capturas de las pruebas
├── postman/                # Colección y entorno de Postman
├── src/
│   ├── config/             # Variables de entorno y pool de PostgreSQL
│   ├── routes/             # Definición de rutas por recurso
│   ├── controllers/        # Reciben la petición y arman la respuesta HTTP
│   ├── services/           # Lógica de negocio y consultas SQL
│   ├── middlewares/        # JWT, roles, límite de intentos, sanitización y errores
│   ├── utils/              # Validaciones y clase HttpError
│   ├── app.js              # Configuración de Express
│   └── server.js           # Punto de entrada
├── .env.example
└── package.json
```

La API está organizada en capas: **rutas → controladores → servicios → base de datos**. Los controladores no escriben SQL y los servicios no conocen Express, así cada parte se puede revisar y probar por separado.

## Modelo de datos

El archivo [`database/schema.sql`](database/schema.sql) crea 10 tablas:

| Tabla | Contenido |
| --- | --- |
| `roles` | `USUARIO` y `ADMIN` |
| `refugios` | Refugios y sus datos de contacto |
| `usuarios` | Cuentas, con su rol y, si son admin, su refugio |
| `animales` | Fichas de cada animal y su estado de publicación |
| `postulaciones` | Solicitudes de adopción y su estado |
| `historial_postulaciones` | Cada cambio de estado, con quién y cuándo lo hizo |
| `citas` | Retiros o encuentros coordinados para una postulación (tabla preparada; la Agenda aún no tiene endpoints) |
| `favoritos` | Animales guardados por cada usuario |
| `apadrinamientos` | Aportes únicos o mensuales a un animal (tabla preparada para una próxima entrega) |
| `notificaciones` | Avisos para el usuario cuando cambia su postulación |

Incluye claves foráneas, restricciones `CHECK` en los estados, índices en las columnas de búsqueda y triggers para mantener `actualizado_en`.

## Instalación y ejecución

### Requisitos

- Node.js 18 o superior
- PostgreSQL 16 o 17, con la herramienta `psql`

### Pasos

1. Clonar el repositorio y cambiarse a esta rama:

   ```bash
   git clone https://github.com/Panchiky/Portal-de-adopcion-y-rescate-de-animales.git
   cd Portal-de-adopcion-y-rescate-de-animales
   git checkout backend
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear la base de datos y cargar el modelo y los datos de prueba:

   ```bash
   createdb -U postgres patitasgo
   psql -U postgres -d patitasgo -f database/schema.sql
   psql -U postgres -d patitasgo -f database/seed.sql
   ```

   En Windows (PowerShell), si `psql` no está en el PATH:

   ```powershell
   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d patitasgo -f database/schema.sql
   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d patitasgo -f database/seed.sql
   ```

   `schema.sql` borra y vuelve a crear las tablas, así que también sirve para dejar la base limpia.

4. Copiar `.env.example` como `.env` y completar los valores (ver la tabla siguiente).

5. Levantar la API:

   ```bash
   npm run dev     # desarrollo, se reinicia al guardar cambios
   npm start       # ejecución normal
   ```

   La consola debe mostrar `Conectado a PostgreSQL` y `API PatitasGo escuchando en http://localhost:3000/api`. Para comprobarlo, abre `http://localhost:3000/api/health`.

### Variables de entorno

| Variable | Ejemplo | Descripción |
| --- | --- | --- |
| `PORT` | `3000` | Puerto de la API |
| `CORS_ORIGIN` | `http://localhost:8100,http://localhost:5173` | Orígenes del frontend permitidos, separados por coma |
| `DB_HOST` | `localhost` | Servidor de PostgreSQL |
| `DB_PORT` | `5432` | Puerto de PostgreSQL |
| `DB_NAME` | `patitasgo` | Nombre de la base de datos |
| `DB_USER` | `postgres` | Usuario de PostgreSQL |
| `DB_PASSWORD` | *(tu clave)* | Contraseña de PostgreSQL |
| `JWT_SECRET` | *(texto largo y aleatorio)* | Clave para firmar los tokens |
| `JWT_EXPIRES_IN` | `2h` | Duración del token |

> **Seguridad:** nunca subir secretos al repositorio. El archivo `.env` está en `.gitignore` y solo se versiona `.env.example`, sin valores reales.

Para generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Usuarios de prueba

| Correo | Contraseña | Rol |
| --- | --- | --- |
| `admin@patitasgo.cl` | `Admin123!` | ADMIN, refugio Huellas Felices |
| `admin.puerto@patitasgo.cl` | `Admin123!` | ADMIN, refugio Patitas del Puerto |
| `tomas@ejemplo.cl` | `Usuario123!` | USUARIO |

## Endpoints

Todas las rutas parten de `http://localhost:3000/api`. El detalle de cada endpoint (cuerpos, respuestas, ejemplos y códigos de estado) está en [`docs/API.md`](docs/API.md).

| Recurso | Endpoints | Acceso |
| --- | --- | --- |
| Estado | `GET /health` | Público |
| Autenticación | `POST /auth/registro`, `POST /auth/login`, `GET /auth/perfil` | Público y con token |
| Animales | `GET /animales`, `GET /animales/:id`, `GET /animales/gestion`, `POST /animales`, `PUT /animales/:id`, `PATCH /animales/:id/estado`, `DELETE /animales/:id` | Catálogo público y gestión `ADMIN` |
| Postulaciones | `POST /postulaciones`, `GET /postulaciones/mias`, `GET /postulaciones`, `GET /postulaciones/:id`, `PATCH /postulaciones/:id/estado`, `DELETE /postulaciones/:id` | `USUARIO` y `ADMIN` |
| Favoritos | `GET /favoritos`, `POST /favoritos/:animalId`, `DELETE /favoritos/:animalId` | `USUARIO` |
| Notificaciones | `GET /notificaciones`, `PATCH /notificaciones/:id/leida` | Con token |

## Autenticación y roles

1. El usuario inicia sesión en `POST /auth/login` y recibe un JWT firmado, con su id, rol y refugio, que vence a las 2 horas.
2. El frontend guarda el token y lo envía en cada petición con `Authorization: Bearer <token>`. Esto lo hace un interceptor de Axios.
3. En el backend, `verificarToken` valida el token y `permitirRoles('ADMIN')` o `permitirRoles('USUARIO')` revisa el rol. Además, los servicios comprueban que un admin solo toque datos de su propio refugio.
4. Si el token vence o es inválido, la API responde `401`. El interceptor de respuesta del frontend cierra la sesión y redirige al login.

## Seguridad

- Contraseñas con hash bcrypt, con validación de complejidad, y mensajes de login genéricos que no revelan si el correo existe.
- Consultas SQL parametrizadas en todos los servicios, y transacciones en las operaciones que tocan varias tablas.
- Validación de cada cuerpo de entrada: tipos, largos, enumeraciones, RUT chileno con dígito verificador y URLs.
- Eliminación de `<` y `>` en los textos recibidos, para evitar XSS almacenado.
- `helmet` para cabeceras HTTP seguras, `x-powered-by` desactivado y límite de 1 MB en el JSON.
- CORS restringido a los orígenes definidos en `CORS_ORIGIN`.
- Límite de 10 intentos fallidos cada 15 minutos en login y registro (`429`).
- Manejo centralizado de errores: los errores internos responden un mensaje genérico, sin exponer detalles del servidor.

## Pruebas con Postman

La carpeta [`postman/`](postman) tiene la colección **PatitasGo API** (53 peticiones y 127 tests) y el entorno **PatitasGo local**.

1. Cargar `schema.sql` y `seed.sql`, y levantar la API.
2. En Postman: **Import** → seleccionar los dos archivos de `postman/`.
3. Elegir el entorno **PatitasGo local** y ejecutar la colección con **Run collection**.

La colección prueba los casos correctos y los errores esperados: sin token, rol incorrecto, recurso de otro refugio, validaciones y conflictos. El resultado de la ejecución está en [`docs/evidencias/postman-runner.jpg`](docs/evidencias/postman-runner.jpg).

## Integración con el frontend

La rama [`frontend`](../../tree/frontend) usa un cliente Axios (`src/services/api.ts`) con la URL base en `VITE_API_URL` e interceptores para el token y los errores `401`. Para probar todo junto:

1. Levantar esta API en el puerto 3000.
2. En la rama `frontend`, crear `.env` con `VITE_API_URL=http://localhost:3000/api`, y luego ejecutar `npm install` y `npm run dev`.

## Integrantes y créditos

| Integrante | Aporte en esta entrega |
| --- | --- |
| Kevin Rubilar | Desarrollo completo del backend (modelo de datos, API REST, JWT y roles, seguridad), integración del frontend con Axios, pruebas en Postman y documentación |
| Francisca Ponce | Pantallas base del frontend en Ionic + React (Avance 1), que se reutilizaron y conectaron a la API en esta entrega |
| Elías Bravo | Propuesta inicial del servidor y del modelo de datos, usada como punto de partida para el diseño de la API |
| Tomás Guerra | Diseño UI/UX en Figma y primera corrección del prototipo según la retroalimentación del Avance 1, usado como referencia para las pantallas conectadas |
