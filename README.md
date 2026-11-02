# PatitasGo — Portal de Adopción y Rescate de Animales

Portal web y aplicación móvil que centraliza la adopción responsable de animales rescatados: los refugios publican fichas y gestionan solicitudes, y las personas interesadas exploran animales, postulan y siguen el estado de su postulación.

Proyecto semestral de **Ingeniería Web y Móvil**, Ingeniería en Informática, PUCV.

## Integrantes

| Integrante | Rol principal |
|---|---|
| Francisca Ponce | Frontend (Ionic + React): estructura inicial del proyecto y pantallas base |
| Kevin Rubilar | Backend (API REST, base de datos, JWT y seguridad), integración del frontend con la API, pruebas en Postman y documentación |
| Elías Bravo | Integración de archivos del frontend, rutas en `App.tsx` y propuesta inicial del servidor y del modelo de datos |
| Tomás Guerra | Diseño UI/UX en Figma: pantallas móvil y web, prototipo navegable y corrección del diseño según la retroalimentación del Avance 1 |

La distribución detallada de responsabilidades está en el README de cada rama:

- [Rama `frontend`](../../tree/frontend#distribución-de-responsabilidades): Avance 1 e integración con la API del Avance 2.
- [Rama `backend`](../../tree/backend#integrantes-y-créditos): Avance 2 (API REST y base de datos).

## Organización del repositorio

| Rama | Contenido |
|---|---|
| [`main`](../../tree/main) | Este README general del proyecto. |
| [`frontend`](../../tree/frontend) | Aplicación Ionic + React + TypeScript, requerimientos funcionales y no funcionales, arquitectura de navegación e instrucciones de instalación y ejecución. |
| [`backend`](../../tree/backend) | API RESTful con Node.js + Express, conexión a PostgreSQL, autenticación con JWT y archivos `.sql` de la base de datos, colección de Postman y documentación de endpoints (Entrega Parcial 2). |

## Tecnologías

- **Frontend:** Ionic Framework, React, TypeScript, React Router, Axios, Capacitor y Vite.
- **Backend:** Node.js, Express.js, PostgreSQL, JWT, bcrypt y Helmet.
- **Pruebas:** Postman.
- **Diseño:** Figma, con prototipo manual en versión móvil y web.

## Enlaces

- [Documentación completa y requerimientos (rama frontend)](../../tree/frontend#patitasgo--portal-de-adopción-y-rescate-de-animales)
- [Documentación de la API y del backend (rama backend)](../../tree/backend#patitasgo--backend-api-rest)
- [Documentación de los endpoints](../../blob/backend/docs/API.md)
- [Instalación del frontend](../../tree/frontend#instalación-y-ejecución)
- [Instalación del backend](../../tree/backend#instalación-y-ejecución)
- [Prototipo navegable en Figma](https://www.figma.com/proto/FWPPEeLuI3yQqZCnTdKkN4/EP1.3-PatigasGo?page-id=0%3A1&starting-point-node-id=1%3A7&scaling=min-zoom&content-scaling=fixed&show-proto-sidebar=1)
- [Archivo de diseño en Figma](https://www.figma.com/design/FWPPEeLuI3yQqZCnTdKkN4/EP1.3-PatigasGo)

## Ejecución rápida

La aplicación necesita las dos ramas funcionando al mismo tiempo, cada una en su propia carpeta y terminal.

**1. Backend (API en `http://localhost:3000/api`)**

```bash
git clone -b backend https://github.com/Panchiky/Portal-de-adopcion-y-rescate-de-animales.git patitas-backend
cd patitas-backend
npm install
# crear la base de datos y el archivo .env según el README de la rama backend
npm run dev
```

**2. Frontend (en otra terminal)**

```bash
git clone -b frontend https://github.com/Panchiky/Portal-de-adopcion-y-rescate-de-animales.git patitas-frontend
cd patitas-frontend
npm install
cp .env.example .env
npm run dev
```

Los usuarios de prueba están en el README de cada rama.
