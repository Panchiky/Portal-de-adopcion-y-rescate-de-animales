# Portal de Adopción y Rescate Animal (Patitas Conectadas)

Enlace público del prototipo UI/UX en Figma: [Prototipo Figma - Portal Adopción]

---

## 1. Identificación del Equipo y Responsabilidades

| Integrante | Rol | Responsabilidad Principal |
| :--- | :--- | :--- |
| Francisca Ponce | Frontend Developer & UI/UX | Diseño en Figma, configuración de Ionic/React, Vistas de Catálogo y Detalle |
| [Elias Bravo] | Frontend Developer | Implementación de formulario de Reporte de Rescate y Login |
| [Tomas Guerra] | Documentación & Arquitectura | Redacción de requerimientos, proto-personas y flujos de navegación |
| [Kevin Rubilar] | QA & Soporte Frontend | Modularización de componentes Ionic y control de calidad |

---

## 2. Descripción General del Sistema
Patitas Conectadas es una plataforma web y móvil orientada a digitalizar, agilizar y transparentar la gestión de rescates en la vía pública y las postulaciones de adopción responsable. El sistema conecta a rescatistas independientes, adoptantes y administradores de refugios bajo una misma interfaz centralizada.

---

## 3. Problema o Necesidad que Aborda
Actualmente, el rescate y la adopción de animales abandonados se gestiona predominantemente a través de publicaciones dispersas e informales en redes sociales. Esto ocasiona:
* Pérdida de trazabilidad de los casos urgentes (animales atropellados o enfermos).
* Duplicidad de esfuerzos entre rescatistas locales.
* Formularios de postulación extraviados o sin respuesta.
* Ausencia de un historial sanitario consolidado para los animales entregados en adopción.

---

## 4. Objetivos del Proyecto
* **Objetivo General:** Desarrollar una aplicación accesible para la gestión integral de rescates y adopciones de animales domésticos.
* **Objetivos Específicos:**
  * Implementar un sistema de alertas geolocalizadas con niveles de urgencia para animales en riesgo.
  * Diseñar un catálogo interactivo con filtros avanzados y fichas sanitarias actualizables.
  * Gestionar el ciclo de vida de las solicitudes de adopción y asignación de hogares temporales.

---

## 5. Caracterización de Usuarios y Proto-Personas

### Proto-Persona 1: Adoptante / Rescatista Ocasional
* **Rol:** Usuario General / Adoptante.
* **Características:** 22–35 años, usuario recurrente de smartphones.
* **Necesidades:** Reportar un animal herido en la vía pública en pocos pasos o encontrar una mascota que se ajuste a su vivienda.
* **Puntos de Frustración:** Formularios extensos, falta de feedback en trámites y falta de información clara sobre el estado de salud del animal.
* **Dispositivo habitual:** Teléfono móvil (Android / iOS).

### Proto-Persona 2: Administradora de Refugio / Coordinadora
* **Rol:** Administrador / Refugio.
* **Características:** 28–50 años, gestiona múltiples casos simultáneamente.
* **Necesidades:** Centralizar postulaciones, aprobar o rechazar candidatos y actualizar historiales médicos.
* **Puntos de Frustración:** Mensajes desordenados por WhatsApp/Instagram y pérdida de datos de adoptantes previos.
* **Dispositivo habitual:** Computador portátil / Navegador Web de escritorio.

---

## 6. Requerimientos del Sistema

### Requerimientos Funcionales (RF)
* **RF01:** El sistema permitirá a los usuarios publicar reportes de rescate animal incluyendo ubicación, imágenes y nivel de prioridad.
* **RF02:** El sistema dispondrá de un catálogo filtrable de animales por especie, edad, tamaño y estado sanitario.
* **RF03:** El sistema permitirá a usuarios registrados enviar formularios de postulación para la adopción de un animal específico.
* **RF04:** El sistema proveerá un panel de administración para que los gestores aprueben, rechacen o pongan en revisión las postulaciones.
* **RF05:** El sistema permitirá al administrador registrar y actualizar la ficha médica del animal (vacunación, esterilización, tratamientos).
* **RF06:** El sistema notificará a los usuarios sobre cambios en el estado de sus solicitudes de adopción o reportes enviados.
* **RF07:** El sistema permitirá gestionar el registro y asignación de hogares temporales para animales en rehabilitación.

### Requerimientos No Funcionales (RNF)
* **RNF01 (Rendimiento):** Las vistas del catálogo deben procesar y mostrar los datos en menos de 2 segundos.
* **RNF02 (Usabilidad):** Interfaz adaptativa con navegación inferior (`IonTabs`) en móviles y menú lateral (`IonMenu`) en escritorio.
* **RNF03 (Seguridad):** Restricción de acceso a rutas administrativas mediante validación de sesión y roles.
* **RNF04 (Accesibilidad):** Cumplimiento de estándares de contraste visual y legibilidad acordes a pautas WCAG básicas.
* **RNF05 (Compatibilidad):** Compatibilidad garantizada en navegadores modernos (Google Chrome, Mozilla Firefox, Safari, Edge).

---

## 7. Tecnologías y Herramientas Utilizadas
* **Frontend:** Ionic Framework v7+, React, TypeScript.
* **Navegación:** Ionic React Router (`@ionic/react-router`, `react-router-dom`).
* **Iconografía:** Ionicons.
* **Diseño UI/UX:** Figma.
* **Control de Versiones:** Git y GitHub.

---

## 8. Instrucciones de Instalación y Configuración

### Prerrequisitos
* **Node.js** (versión recomendada: v18 LTS o superior).
* **Git** instalado en el sistema.
* **Ionic CLI** instalado globalmente:
  ```bash
  npm install -g @ionic/cli