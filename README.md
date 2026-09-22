# PatitasGo — Portal de Adopción y Rescate de Animales
## Presentado por
- Francisca Ponce
- Elias Bravo
- Tomas Guerra
- Kevin Rubilar

## Índice
1. [Justificación del problema](#justificación-del-problema)
2. [Usuarios](#usuarios-objetivo-quién-usará-la-aplicación)
    - [Roles](#roles-del-sistema)
    - [Proto-personas](#proto-personas)
3. [Requerimientos](#requerimientos)
4. [Arquitectura de la Información/UX](#arquitectura-de-navegación)
    - [Diferenciación por roles](#diferenciación-de-acceso-según-roles)
    - [Flujos principales de tareas](#flujos-de-tareas)
    - [Puntos críticos de interacción](#puntos-críticos-de-interacción)
    - [Justificación técnica](#justificación-técnica)
5. [Bocetos UX/UI](#bocetos-uiux)
6. [Frontend con Ionic-React](#librerías-usadas-con-react-ionic)

## Justificación del problema
El abandono de animales de compañía constituye una problemática que afecta su bienestar, incrementa la presencia de animales sin supervisión en espacios públicos y exige una respuesta permanente de municipalidades, fundaciones, refugios y rescatistas independientes. La legislación chilena reconoce expresamente la necesidad de prevenir el abandono, promover la reubicación y fomentar la tenencia responsable de mascotas y animales de compañía.

En la práctica, una parte importante de la difusión de animales rescatados se realiza mediante publicaciones distribuidas en distintas redes sociales. Aunque estos medios permiten alcanzar a potenciales adoptantes, la información suele quedar fragmentada entre publicaciones, historias, formularios externos y conversaciones privadas. Esta dispersión dificulta mantener actualizados el estado de cada animal, sus antecedentes médicos y las postulaciones recibidas.

Para una persona interesada en adoptar, el proceso puede requerir revisar numerosas publicaciones sin filtros uniformes, consultar repetidamente si el animal continúa disponible y entregar información mediante canales diferentes. También puede resultar difícil conocer el avance de una postulación o recibir oportunamente una respuesta del refugio.

Para los administradores de refugios, la dependencia de mensajes, planillas y publicaciones separadas dificulta comparar solicitudes, conservar un historial de decisiones, actualizar fichas y comunicar cambios de estado. La falta de un canal centralizado aumenta el trabajo manual y el riesgo de presentar información desactualizada o incompleta.

En este contexto, se propone **PatitasGo**, un portal web y móvil que centraliza:

- La publicación de fichas de animales rescatados.
- La búsqueda mediante filtros de especie, tamaño, ubicación y distancia.
- La consulta de antecedentes relevantes para una adopción informada.
- El envío y seguimiento de postulaciones.
- La gestión administrativa de solicitudes y estados.
- El registro del historial médico.
- El apadrinamiento económico para apoyar el cuidado de los animales.
- La notificación de las decisiones adoptadas por el refugio.

La experiencia de exploración móvil podrá inspirarse en el patrón visual de aplicaciones de tarjetas, similar a Tinder, para destacar la fotografía y la información esencial del animal. Sin embargo, ningún gesto enviará automáticamente una postulación. Adoptar requiere una decisión informada, por lo que el Usuario deberá ingresar a la ficha, seleccionar explícitamente **“Postular”**, completar el formulario y confirmar su envío.

La plataforma no pretende reemplazar la evaluación realizada por el refugio ni aprobar adopciones de forma automática. Su propósito es proporcionar un canal organizado, trazable y accesible que apoye la adopción responsable y reduzca la fragmentación de la información.

La caracterización inicial del problema se apoya en fuentes secundarias oficiales:

- [Ley N.º 21.020 sobre Tenencia Responsable de Mascotas y Animales de Compañía](https://www.bcn.cl/leychile/Navegar?idNorma=1106037), Biblioteca del Congreso Nacional de Chile.
- [Programa de Tenencia Responsable de Animales de Compañía](https://www.subdere.gov.cl/), Subsecretaría de Desarrollo Regional y Administrativo.
- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/), World Wide Web Consortium.

---

## Usuarios objetivo (Quién usará la aplicación)

La aplicación considera dos roles principales: **Usuario** y **Administrador**. Adicionalmente, una persona que aún no inicia sesión podrá navegar como **Visitante**, condición de acceso público que no constituye un tercer rol almacenado.

### Usuarios interesados en adoptar o apadrinar

Corresponden a personas que desean conocer animales rescatados, evaluar responsablemente si pueden incorporarlos a su hogar o aportar económicamente a su cuidado.

Dentro de este grupo pueden existir personas que:

- Acceden principalmente desde un teléfono móvil.
- Desean buscar perros o gatos según especie, tamaño, región, comuna o distancia desde una ubicación elegida.
- Necesitan información clara sobre edad, comportamiento, compatibilidad y salud.
- Revisan diferentes perfiles antes de tomar una decisión.
- Requieren conocer si un animal continúa disponible.
- Desean enviar una postulación mediante un proceso formal.
- Necesitan consultar el estado de sus propias solicitudes.
- Quieren recibir una notificación cuando el refugio resuelva su postulación.
- Necesitan saber qué ocurre cuando su postulación es aceptada para continuar el proceso y cómo se coordina la entrevista.
- Desean realizar un aporte único o mensual para el cuidado de un animal.

#### Necesidades principales

- Encontrar animales compatibles con criterios básicos de búsqueda.
- Saber qué refugio publica cada animal, en qué comuna y región se encuentra y a qué distancia aproximada está.
- Comprender rápidamente la información más importante de cada ficha.
- Diferenciar claramente explorar, guardar interés, postular y apadrinar.
- Completar formularios con instrucciones y validaciones comprensibles.
- Consultar el estado actualizado de sus postulaciones.
- Recibir información de una aceptación en proceso, una cita, una adopción completada o un rechazo sin revisar constantemente el portal.
- Entregar datos de identificación y contacto mediante un formulario protegido.
- Coordinar una fecha, hora y lugar de entrevista cuando una postulación sea aceptada para continuar el proceso.
- Recibir una notificación cuando la postulación sea preseleccionada y, desde ese momento, coordinar una entrevista propuesta por el refugio, pudiendo confirmarla o solicitar otro horario.
- Utilizar las funciones esenciales tanto desde móvil como desde navegador web.
- Confiar en que sus datos personales solo serán utilizados para el proceso correspondiente.

### Administradores o trabajadores del refugio

Corresponden a integrantes autorizados del refugio responsables de mantener la información de los animales y gestionar los procesos de adopción.

Dentro de este grupo pueden existir personas que:

- Trabajan principalmente desde un computador del refugio.
- Administran varios animales y postulaciones simultáneamente.
- Reciben solicitudes mediante canales diferentes.
- Necesitan actualizar rápidamente la disponibilidad de cada animal.
- Mantienen antecedentes de vacunas, desparasitaciones y condiciones médicas.
- Requieren registrar quién modificó una solicitud o ficha.
- Disponen de tiempo limitado para tareas administrativas.
- Necesitan evitar que información interna o sensible se publique por error.

#### Necesidades principales

- Centralizar las fichas y postulaciones recibidas.
- Filtrar y revisar solicitudes sin depender de conversaciones dispersas.
- Cambiar estados mediante reglas consistentes y conservar trazabilidad.
- Crear, editar, publicar y archivar fichas de animales.
- Registrar antecedentes médicos por fecha y tipo.
- Diferenciar la información sanitaria pública de las observaciones internas.
- Contactar al postulante aceptado en proceso, programar la entrevista y registrar su resultado.
- Verificar presencialmente la identidad antes de cerrar una adopción.
- Consultar los apadrinamientos confirmados sin acceder a credenciales financieras.
- Utilizar una interfaz eficiente y con mayor densidad de información en escritorio.

---

## Roles del Sistema

- **Usuario:** Persona autenticada que puede explorar animales, aplicar filtros, consultar fichas públicas, enviar postulaciones, revisar sus propias solicitudes, apadrinar animales y recibir sus propias notificaciones.
- **Administrador:** Trabajador autorizado del refugio que puede gestionar fichas de animales, antecedentes médicos y postulaciones, además de consultar registros de apadrinamiento sin acceder a información financiera completa.
- **Visitante:** Estado de acceso no autenticado. Puede consultar el catálogo y las fichas públicas, pero debe registrarse o iniciar sesión para postular o apadrinar. No se almacena como rol del sistema.

### Definición de conceptos

**Rol:** Define las acciones y los datos a los que puede acceder una cuenta autenticada dentro del sistema.

**Proto-persona:** Representa un perfil hipotético de usuario, incluyendo características, necesidades, objetivos, dificultades y contexto probable de uso. No equivale a una persona entrevistada ni constituye evidencia de investigación primaria.

**Postulación activa:** Solicitud de adopción cuyo estado es `PENDIENTE`, `EN_REVISION` o `ACEPTADA_EN_PROCESO`.

**Postulación resuelta:** Solicitud cuyo estado terminal es `ADOPCION_COMPLETADA` o `RECHAZADA`.

**Ficha pública:** Información del animal que puede consultar un Visitante o Usuario. Excluye notas médicas y administrativas marcadas como internas.

**Apadrinamiento:** Aporte económico único o mensual destinado al cuidado del animal seleccionado. No equivale a una adopción ni otorga prioridad en el proceso.

**Ubicación de búsqueda:** Comuna ingresada manualmente o posición aproximada autorizada por la persona, utilizada únicamente para ordenar o filtrar animales por distancia. El rango podrá ser de 10, 25, 50, 100 km o todo Chile.

**Coordinación de adopción:** Proceso que se habilita después de que el refugio decide continuar con una postulación y esta pasa a `ACEPTADA_EN_PROCESO`, estado que la interfaz presentará al Usuario como **“Preseleccionada”**. El Administrador propone una fecha y hora de entrevista, y el Usuario puede confirmarla o solicitar otro horario. La coordinación puede quedar `POR_CONFIRMAR`, `CONFIRMADA`, `CAMBIO_SOLICITADO`, `CANCELADA`, `NO_ASISTIO` o `REALIZADA`.

**Animal reservado:** Animal asociado a una postulación `ACEPTADA_EN_PROCESO` y a una coordinación activa. No se mostrará como disponible para nuevas postulaciones mientras dicha coordinación continúe vigente.

**Adopción completada:** Resultado registrado por el Administrador después de realizar la entrevista, verificar presencialmente la identidad, formalizar la entrega responsable y confirmar que el animal fue entregado. Solo entonces la postulación cambia a `ADOPCION_COMPLETADA` y el animal a `ADOPTADO`.

**Por ejemplo:**

*Rol:* Usuario

*Proto-persona:* Persona de 27 años que utiliza principalmente su teléfono móvil, desea adoptar un perro mediano y necesita comparar información confiable antes de enviar una postulación.

---

## Proto-personas

Las siguientes proto-personas corresponden a **perfiles hipotéticos** construidos a partir del análisis del problema, las funciones previstas y fuentes secundarias sobre tenencia responsable y accesibilidad digital. **No representan personas encuestadas o entrevistadas**, ni deben presentarse como resultados de investigación con usuarios reales.

### Proto-persona 1: Persona interesada en una adopción responsable

**Nombre ficticio:** Valentina Rojas

**Tipo de usuario o rol:** Usuario

#### Características generales

Valentina tiene 27 años, trabaja y vive en un departamento arrendado. Utiliza principalmente su teléfono móvil durante trayectos y pausas, aunque completa trámites extensos desde su computador portátil.

Está interesada en adoptar un animal, pero quiere evaluar responsablemente aspectos como tamaño, comportamiento, compatibilidad con su vivienda, necesidades médicas y tiempo que deberá dedicarle. Actualmente encuentra publicaciones en distintas redes sociales y suele perder la referencia de cuáles continúan vigentes.

#### Necesidades principales

- Explorar animales disponibles desde el teléfono.
- Filtrar por especie, tamaño, comuna y radio de distancia.
- Identificar el nombre y la ubicación general del refugio antes de abrir una ficha.
- Comparar información básica sin leer publicaciones desordenadas.
- Consultar comportamiento, compatibilidad e historial sanitario público.
- Guardar interés sin iniciar accidentalmente una postulación.
- Completar un formulario claro y recibir confirmación del envío.
- Ser informada cuando su postulación sea preseleccionada y, posteriormente, revisar y responder una propuesta de fecha y hora de entrevista enviada por el refugio.
- Revisar el estado actualizado de su solicitud.
- Recibir una alerta cuando exista una decisión.
- Conocer los pasos posteriores a una aceptación en proceso y coordinar la entrevista con el refugio.

#### Objetivos de uso

Encontrar un animal compatible con su hogar, conocer sus antecedentes relevantes, completar una postulación responsable y realizar seguimiento sin depender de mensajes enviados por diferentes redes sociales.

#### Dificultades o puntos de frustración

Puede experimentar frustración cuando:

- Una publicación no indica si el animal continúa disponible.
- Debe repetir sus datos en diferentes canales.
- No puede excluir animales ubicados demasiado lejos.
- La ficha no identifica al refugio ni su comuna o región.
- No sabe si su solicitud fue recibida.
- Un gesto o botón no explica claramente sus consecuencias.
- No existe información sobre el avance de la postulación.
- Su postulación es aceptada en proceso, pero no encuentra instrucciones para confirmar o cambiar la cita.
- La versión móvil oculta campos o acciones importantes.

#### Funcionalidades de la aplicación que utilizaría

- Registro e inicio de sesión.
- Catálogo y filtros.
- Tarjetas de exploración.
- Ficha detallada del animal.
- Formulario de postulación.
- Mis postulaciones.
- Alertas y notificaciones.
- Coordinación de entrevista y seguimiento de la adopción.
- Apadrinamiento.
- Perfil de Usuario.

#### Dispositivo y contexto probable de acceso

Utilizaría principalmente un **teléfono móvil** para explorar perfiles y recibir alertas. Podría usar un **computador portátil** para revisar información extensa y completar el formulario con mayor comodidad.

---

### Proto-persona 2: Administradora de refugio con tiempo operativo limitado

**Nombre ficticio:** Daniela Muñoz

**Tipo de usuario o rol:** Administrador

#### Características generales

Daniela tiene 36 años y colabora en la coordinación de un refugio. Combina el cuidado directo de los animales con tareas administrativas, por lo que dispone de períodos breves para revisar solicitudes, actualizar fichas y registrar controles sanitarios.

Actualmente parte de la información se encuentra en publicaciones, conversaciones y planillas. Necesita distinguir con rapidez qué postulaciones están pendientes, cuáles se encuentran en revisión y qué animales requieren actualizar antecedentes antes de continuar publicados.

#### Necesidades principales

- Visualizar un resumen operativo del refugio.
- Revisar y filtrar postulaciones por estado, animal y fecha.
- Consultar todos los datos entregados por el postulante.
- Registrar decisiones mediante transiciones de estado controladas.
- Mantener fichas y fotografías actualizadas.
- Registrar vacunas, desparasitaciones y condiciones médicas.
- Ocultar notas internas de las vistas públicas.
- Evitar aprobar dos solicitudes para el mismo animal.
- Conservar evidencia de quién efectuó cada modificación.
- Programar y confirmar entregas presenciales sin depender de conversaciones externas dispersas.

#### Objetivos de uso

Centralizar el trabajo administrativo del refugio, mantener información confiable de los animales y resolver postulaciones de forma ordenada, consistente y trazable.

#### Dificultades o puntos de frustración

Puede experimentar frustración cuando:

- Debe revisar múltiples conversaciones para reconstruir una solicitud.
- El sistema exige pasos repetitivos para una operación frecuente.
- No puede identificar rápidamente los casos pendientes.
- Una edición elimina información histórica.
- Las acciones de aprobar, rechazar o eliminar no solicitan confirmación.
- Una aceptación en proceso no reserva al animal ni genera una tarea de coordinación.
- La interfaz móvil y web utilizan términos diferentes.
- Los errores no explican cómo corregir los datos.

#### Funcionalidades de la aplicación que utilizaría

- Inicio de sesión administrativo.
- Resumen del refugio.
- Gestión de postulaciones.
- Detalle y cambio de estado de solicitudes.
- Coordinación y cierre de entregas responsables.
- Listado de animales.
- Creación, edición, publicación y archivado de fichas.
- Gestión del historial médico.
- Consulta de apadrinamientos confirmados.
- Perfil y cierre de sesión.

#### Dispositivo y contexto probable de acceso

Utilizaría principalmente un **computador de escritorio o portátil** dentro del refugio para trabajar con tablas y formularios. Desde el **teléfono móvil** realizaría consultas o actualizaciones urgentes de menor complejidad.

## Requerimientos

Los requerimientos fueron redactados como capacidades observables del sistema. Los primeros siete requerimientos funcionales satisfacen el mínimo exigido para el dominio de adopción y rescate; se incorpora un octavo requerimiento para completar la entrevista y el cierre posterior a una aceptación inicial. Registro, inicio de sesión y control de acceso se documentan separadamente como funcionalidades transversales y no se contabilizan dentro de estos RF.

## Requerimientos Funcionales por Rol

Un requerimiento funcional (RF) describe qué debe hacer el sistema. Representa una funcionalidad, servicio, comportamiento o acción que la aplicación debe proporcionar a uno o más roles.

| ID | Requerimiento funcional | Rol |
|---|---|---|
| **RF-01** | El sistema deberá permitir al Visitante y al Usuario consultar exclusivamente animales publicados con estado `DISPONIBLE`; buscar por nombre; y combinar filtros de especie (`PERRO` o `GATO`), tamaño (`PEQUEÑO`, `MEDIANO` o `GRANDE`), región, comuna y radio desde una ubicación elegida (`10`, `25`, `50`, `100 km` o `TODO_CHILE`). La ubicación podrá ingresarse manualmente o provenir del dispositivo con autorización explícita. Los resultados deberán cumplir simultáneamente todos los criterios, podrán ordenarse por cercanía y mostrarán fotografía, nombre, edad aproximada, tamaño, nombre del refugio, comuna, región y distancia aproximada cuando pueda calcularse. Si no se autoriza la ubicación, el catálogo seguirá operativo mediante región o comuna manual. La dirección exacta de encuentro no se publicará en el catálogo. | Visitante / Usuario |
| **RF-02** | El sistema deberá permitir al Usuario autenticado postular desde la ficha de un animal disponible mediante tres pasos: **Datos**, **Motivación** y **Confirmación**. En Datos solicitará nombre, apellido, RUT chileno válido, correo, teléfono y domicilio o comuna de residencia. En Motivación solicitará antecedentes pertinentes para evaluar la tenencia responsable, incluyendo motivación para adoptar y condiciones relevantes del hogar, mediante preguntas comprensibles y proporcionales al proceso. En Confirmación mostrará el resumen del animal y refugio, los datos ingresados y las respuestas entregadas, y exigirá aceptar el tratamiento de datos y la declaración de tenencia responsable. Antes de crear la solicitud se comprobará nuevamente que el animal continúe disponible y que no exista una postulación activa duplicada. Una postulación válida se registrará una sola vez con identificador, fecha y estado inicial `PENDIENTE`. Tras un envío exitoso, la interfaz deberá proporcionar retroalimentación visual progresiva: el botón **“Enviar postulación”** cambiará a **“Enviado”**, el contenido del formulario se ocultará de forma sutil, el indicador de progreso completará el estado **“Confirmar”** y dará paso a una vista de **“Postulación enviada”**. El RUT, teléfono y domicilio solo estarán disponibles para personal autorizado. | Usuario |
| **RF-03** | El sistema deberá permitir al Administrador consultar y filtrar postulaciones por estado, animal, refugio y fecha; revisar respuestas y datos protegidos; y efectuar únicamente las transiciones `PENDIENTE → EN_REVISION`, `PENDIENTE → RECHAZADA`, `EN_REVISION → ACEPTADA_EN_PROCESO`, `EN_REVISION → RECHAZADA`, `ACEPTADA_EN_PROCESO → ADOPCION_COMPLETADA` o `ACEPTADA_EN_PROCESO → RECHAZADA`. Todo rechazo exigirá un motivo y cada transición registrará estado anterior, estado nuevo, fecha y Administrador responsable. Al pasar a `ACEPTADA_EN_PROCESO`, el animal cambiará a `RESERVADO` y se iniciará la coordinación de la entrevista según RF-08; todavía no se marcará como `ADOPTADO`. | Administrador |
| **RF-04** | El sistema deberá permitir al Administrador crear, consultar, editar, publicar y archivar fichas de animales, incluyendo nombre, especie, sexo, edad aproximada, tamaño, raza opcional, refugio responsable, región, comuna, punto geográfico aproximado, comportamiento, compatibilidad y entre una y cinco fotografías válidas. Una ficha nueva se guardará como `BORRADOR`; solo podrá publicarse como `DISPONIBLE` si contiene los datos obligatorios, un refugio activo, una ubicación general válida y al menos una fotografía. La ficha pública mostrará nombre del refugio, comuna y región, pero reservará la dirección exacta para una coordinación autorizada. | Administrador |
| **RF-05** | El sistema deberá permitir al Administrador registrar y actualizar eventos médicos asociados a un animal, incluyendo vacunas, desparasitaciones, esterilización, condiciones diagnosticadas y tratamientos, con fecha, resultado y próxima fecha de control opcional. El Administrador visualizará el historial completo; la ficha pública mostrará solo el resumen sanitario autorizado y nunca las notas internas. | Administrador / consulta pública |
| **RF-06** | El sistema deberá permitir al Usuario autenticado seleccionar un animal habilitado, escoger un aporte `ÚNICO` o `MENSUAL`, ingresar un monto igual o superior al mínimo configurado y continuar al proveedor externo de pago. El apadrinamiento solo deberá quedar `CONFIRMADO` después de una respuesta exitosa del proveedor y no deberá crear una postulación ni conceder prioridad de adopción. Asimismo, permitirá al Administrador consultar el registro de apadrinamientos confirmados asociados a cada animal. | Usuario / Administrador |
| **RF-07** | El sistema deberá crear una notificación interna no leída y realizar un intento de correo cuando una postulación cambie a `ACEPTADA_EN_PROCESO` —presentada al Usuario como **“Preseleccionada”**—, `ADOPCION_COMPLETADA` o `RECHAZADA`, y cuando una cita sea propuesta, confirmada, rechazada con solicitud de otro horario, reprogramada, cancelada, marcada como inasistencia o realizada. Cada notificación interna deberá mostrar un resumen del evento e identificar animal, refugio, estado y acción siguiente. Cuando exista una vista relacionada, al seleccionar la notificación deberá dirigir al detalle correspondiente. Una notificación de preselección dirigirá al seguimiento o coordinación de la postulación; una notificación de entrevista confirmada dirigirá directamente a la vista **“Entrevista confirmada”**, mostrando fecha, hora, lugar o modalidad e instrucciones autorizadas. La comunicación no expondrá notas internas, RUT completo ni datos de otras personas. Un fallo del correo no deberá revertir el estado ni eliminar la notificación interna. Adicionalmente, el sistema deberá destacar o generar una alerta en el panel del Administrador cuando una cita pase a `CAMBIO_SOLICITADO` para que este proponga un nuevo horario. | Usuario / Administrador |
| **RF-08** | El sistema deberá coordinar la entrevista y eventual entrega entre el Usuario con postulación `ACEPTADA_EN_PROCESO` y el Administrador. Al avanzar a este estado, la interfaz informará al Usuario que su postulación fue **preseleccionada** y el animal pasará a `RESERVADO`. El Administrador deberá proponer una fecha y hora de entrevista, además de modalidad (`RETIRO_EN_REFUGIO` o `ENCUENTRO_COORDINADO`), lugar e instrucciones cuando corresponda. El Usuario podrá **Confirmar asistencia** o **Solicitar otro horario**; en este último caso la cita quedará `CAMBIO_SOLICITADO`, se mostrará la etiqueta **“Propuesta rechazada · nuevo horario pendiente”** y la postulación continuará `ACEPTADA_EN_PROCESO`. La interfaz deberá distinguir `CITA_POR_CONFIRMAR`, `CITA_CONFIRMADA` y `CAMBIO_SOLICITADO`. Cuando la cita quede confirmada, el Usuario podrá acceder a una vista específica **“Entrevista confirmada”** desde el detalle de su postulación o desde la notificación asociada. Durante este proceso el animal permanecerá `RESERVADO`. Después de la entrevista, el Administrador registrará uno de dos resultados: si la adopción y entrega se concretan, la postulación cambiará a `ADOPCION_COMPLETADA` y el animal a `ADOPTADO`; si se rechaza o no se concreta, registrará el motivo, la postulación cambiará a `RECHAZADA` y el animal volverá a `DISPONIBLE`. Si se registra `NO_ASISTIO`, podrá reprogramarse una vez dentro de 48 horas; vencido ese plazo sin una nueva cita confirmada, el sistema cerrará la postulación como `RECHAZADA`, liberará al animal y notificará a ambas partes. | Usuario / Administrador |

### Criterios de consistencia y verificación

- Un gesto sobre una tarjeta podrá avanzar, retroceder o guardar interés, pero nunca creará una postulación.
- Un Usuario podrá mantener como máximo una postulación activa para el mismo animal.
- La postulación no solicitará una fecha de entrevista. La coordinación se habilitará únicamente cuando la solicitud pase a `ACEPTADA_EN_PROCESO` y el Administrador genere una propuesta de cita.
- Toda propuesta de entrevista realizada por el Administrador deberá corresponder a una fecha y hora futuras habilitadas por el refugio.
- `ACEPTADA_EN_PROCESO` no será un estado terminal: indicará que la evaluación continúa mediante entrevista y coordinación.
- `ADOPCION_COMPLETADA` y `RECHAZADA` serán estados terminales de la postulación.
- No podrá existir más de una postulación `ACEPTADA_EN_PROCESO` para un mismo animal.
- Al aceptar una postulación para continuar el proceso, el animal cambiará a `RESERVADO` y dejará de admitir nuevas postulaciones.
- Solo el Administrador podrá cambiar el animal de `RESERVADO` a `ADOPTADO`, después de confirmar la entrega presencial y la verificación de identidad.
- Solo podrá existir una coordinación de adopción activa por animal.
- Solicitar otro horario cambiará el estado de la cita, pero mantendrá la postulación `ACEPTADA_EN_PROCESO` y el animal `RESERVADO` mientras exista plazo para reprogramar.
- Si el Administrador registra `NO_ASISTIO`, el Usuario podrá reprogramar una vez dentro de 48 horas; si el plazo vence sin una nueva cita confirmada, la postulación pasará a `RECHAZADA` y el animal volverá a `DISPONIBLE`.
- Si la entrevista termina sin adopción, el Administrador deberá registrar un motivo, cerrar la postulación como `RECHAZADA` y devolver el animal a `DISPONIBLE` dentro de la misma operación.
- La ficha y el catálogo mostrarán el nombre del refugio, la comuna y la región; la dirección exacta de retiro o encuentro solo se revelará a las partes autorizadas durante una coordinación activa.
- El filtro por distancia requerirá una comuna manual o permiso de ubicación; rechazar ese permiso no impedirá usar el catálogo.
- El RUT deberá almacenarse normalizado y validarse mediante su dígito verificador; en listados y notificaciones deberá mostrarse enmascarado.
- Cuando una ficha tenga postulaciones, apadrinamientos o registros médicos asociados, deberá archivarse en vez de eliminarse físicamente.
- La próxima fecha de control médico no podrá ser anterior a la fecha del evento.
- Los datos financieros completos deberán permanecer bajo responsabilidad del proveedor de pago.
- Cada RF será comprobado mediante casos con resultado esperado, datos válidos, datos inválidos y permisos insuficientes.

### Estados coordinados de postulación, cita y animal

Estos estados pertenecen a entidades diferentes y no deben tratarse como un único campo. La tabla evita que “aceptada” se confunda con “adoptado”.

| Momento del proceso | Estado de la postulación | Estado de la cita | Estado del animal | Consecuencia |
|---|---|---|---|---|
| Solicitud recién enviada | `PENDIENTE` | Sin coordinación | `DISPONIBLE` | El refugio todavía no inicia la evaluación y el animal puede recibir otras postulaciones. |
| Evaluación administrativa | `EN_REVISION` | Sin coordinación | `DISPONIBLE` | El Administrador revisa antecedentes y no existe reserva. |
| Evaluación aceptada para continuar | `ACEPTADA_EN_PROCESO` (UI: “Preseleccionada”) | `CITA_POR_CONFIRMAR` | `RESERVADO` | El refugio propone una fecha y hora de entrevista; se bloquean nuevas postulaciones para ese animal. |
| Usuario solicita otro horario | `ACEPTADA_EN_PROCESO` | `CAMBIO_SOLICITADO` | `RESERVADO` | La interfaz muestra “Propuesta rechazada · nuevo horario pendiente”. Rechazar el horario no rechaza la postulación; el refugio debe proponer una nueva cita. |
| Ambas partes aceptan el horario | `ACEPTADA_EN_PROCESO` | `CITA_CONFIRMADA` | `RESERVADO` | La entrevista queda programada y se muestran los datos autorizados de encuentro. |
| Inasistencia dentro del plazo | `ACEPTADA_EN_PROCESO` | `NO_ASISTIO` | `RESERVADO` | Puede reprogramarse una vez dentro de 48 horas. |
| Inasistencia sin reprogramación, cancelación definitiva o evaluación negativa | `RECHAZADA` | `CANCELADA` o `REALIZADA` | `DISPONIBLE` | Se registra el motivo, se cierra la postulación y el animal vuelve al catálogo. |
| Entrevista y entrega concretadas | `ADOPCION_COMPLETADA` | `REALIZADA` | `ADOPTADO` | Se registra la entrega, se conserva auditoría y el animal deja de mostrarse como disponible. |

---

### Funcionalidades Transversales

Las siguientes funcionalidades son necesarias para el funcionamiento general de la aplicación, pero no forman parte de los siete requerimientos funcionales principales del dominio.

- **FT-01:** El sistema deberá permitir que una persona cree una cuenta de Usuario mediante nombre, correo electrónico único, contraseña y aceptación del tratamiento de datos.
- **FT-02:** El sistema deberá permitir a Usuarios y Administradores iniciar sesión mediante credenciales válidas.
- **FT-03:** El sistema deberá permitir cerrar una sesión activa y eliminar localmente los datos que permitan reutilizarla.
- **FT-04:** El sistema deberá restringir vistas, rutas y operaciones de acuerdo con el rol autenticado, comprobando la autorización nuevamente en el backend.
- **FT-05:** El sistema deberá permitir solicitar la recuperación de una contraseña mediante un enlace temporal enviado al correo de la cuenta.
- **FT-06:** El sistema deberá permitir al Usuario autenticado agregar y eliminar animales de **Mis favoritos** sin crear una postulación. Si un animal guardado deja de estar disponible, deberá conservarse identificado con su estado actualizado y no permitirá iniciar una nueva postulación mientras no vuelva a `DISPONIBLE`.
- **FT-07:** El sistema deberá permitir al Usuario editar los datos personales habilitados de su cuenta, validando los campos modificados antes de almacenarlos.
- **FT-08:** El sistema deberá permitir al Usuario cambiar su contraseña desde una sesión autenticada, verificando las condiciones de seguridad definidas y sin exponer la contraseña actual o nueva en texto plano.
- **FT-09:** El sistema deberá permitir al Usuario seleccionar y conservar las preferencias de apariencia disponibles en la aplicación.
- **FT-10:** El sistema deberá proporcionar una vista de privacidad de datos que explique las categorías de información personal tratadas por PatitasGo, sus finalidades dentro del proceso de adopción y las opciones de gestión disponibles para la cuenta.

---

## Requerimientos No Funcionales

Los siguientes criterios desarrollan las condiciones de calidad del sistema. Posteriormente se consolidan en los cinco requerimientos no funcionales evaluables de EP 1.1.

### UX y Usabilidad

#### RNF-UX-01 — Diseño adaptable

La interfaz deberá adaptarse a dispositivos móviles y de escritorio, manteniendo accesibles las funciones principales y evitando pérdida de información, superposición de componentes o desplazamiento horizontal de la página.

#### RNF-UX-02 — Navegación consistente

La versión móvil del Usuario deberá mantener cuatro destinos principales: **Explorar, Postulaciones, Alertas y Perfil**. La versión móvil administrativa deberá mantener: **Resumen, Solicitudes, Animales y Perfil**. La ubicación del contenido podrá adaptarse en web, pero las etiquetas y funciones deberán conservar su significado.

#### RNF-UX-03 — Acciones explícitas

Las operaciones de postular, aceptar para entrevista, confirmar o rechazar una propuesta de cita, registrar inasistencia, cerrar una adopción, archivar, eliminar o confirmar un aporte deberán depender de botones identificados y, cuando produzcan consecuencias relevantes, incluir una confirmación. No deberán depender exclusivamente de gestos.

#### RNF-UX-04 — Retroalimentación al usuario

Las acciones deberán comunicar estados de carga, éxito, error y ausencia de resultados. Los formularios deberán mostrar el error junto al campo correspondiente y explicar cómo corregirlo. Si la persona rechaza el permiso de ubicación, la interfaz deberá ofrecer inmediatamente la selección manual de región o comuna.

#### RNF-UX-05 — Formularios recuperables

Cuando ocurra un error de validación o de comunicación, el sistema deberá conservar los datos válidos ya ingresados, excepto contraseñas y datos controlados por proveedores externos.

---

### Accesibilidad

#### RNF-ACC-01 — Contraste y uso del color

Los textos y controles deberán respetar una relación mínima de contraste de `4.5:1` para texto normal y `3:1` para texto grande. La información no deberá transmitirse exclusivamente mediante color.

#### RNF-ACC-02 — Navegación y foco

Las funciones web deberán poder operarse mediante teclado, mantener un orden de foco lógico y mostrar un indicador visible en cada control enfocado.

#### RNF-ACC-03 — Formularios comprensibles

Cada campo deberá poseer una etiqueta programática, instrucciones comprensibles y mensajes de error asociados. Los elementos obligatorios deberán identificarse sin depender únicamente de un símbolo o color.

#### RNF-ACC-04 — Alternativas para imágenes y gestos

Las fotografías informativas deberán incluir texto alternativo significativo. Cada gesto de arrastre o deslizamiento deberá tener una acción equivalente mediante botón.

---

### Seguridad

#### RNF-SEG-01 — Protección de contraseñas

Las contraseñas deberán almacenarse mediante un algoritmo de hash seguro con sal y nunca en texto plano.

#### RNF-SEG-02 — Comunicación cifrada

Todo intercambio de datos en un ambiente desplegado deberá utilizar HTTPS con TLS 1.2 o superior. Las solicitudes HTTP deberán redirigirse a HTTPS.

#### RNF-SEG-03 — Autenticación y autorización

El acceso a funciones protegidas requerirá una sesión válida. El backend deberá comprobar el rol y la pertenencia del recurso antes de ejecutar cada operación; ocultar controles en el frontend no será suficiente.

#### RNF-SEG-04 — Privacidad de la información

Un Usuario solo podrá consultar sus propias postulaciones, coordinaciones, apadrinamientos y notificaciones. Las notas internas, el RUT completo, el teléfono, la dirección exacta de entrega y los datos de otros postulantes no deberán estar disponibles en respuestas destinadas a Usuarios no autorizados o Visitantes. El catálogo solo expondrá refugio, comuna, región y distancia aproximada. Los listados administrativos deberán mostrar el RUT enmascarado y revelar su valor completo únicamente en el detalle protegido cuando sea necesario para verificar la identidad.

#### RNF-SEG-05 — Validación de datos

Los datos recibidos deberán validarse en frontend para apoyar al usuario y nuevamente en backend antes de ser procesados o almacenados.

#### RNF-SEG-06 — Protección de secretos y pagos

Claves, tokens, cadenas de conexión y secretos no deberán almacenarse en el código fuente ni publicarse en el repositorio. PatitasGo no deberá almacenar números completos de tarjetas ni códigos de seguridad.

#### RNF-SEG-07 — Minimización de datos de identificación

El RUT, teléfono y dirección exacta de entrega deberán solicitarse y utilizarse exclusivamente para evaluar la postulación, contactar al Usuario aceptado, coordinar la entrevista o entrega y verificar la identidad. La ubicación del dispositivo se utilizará solo con autorización para calcular distancias y no se conservará como dirección personal en la ficha pública ni en registros de analítica. Estos datos no deberán mostrarse en fichas públicas, catálogos o correos generales.

---

### Rendimiento

#### RNF-REN-01 — Consulta del catálogo

El primer conjunto de resultados del catálogo filtrado, incluidos los filtros geográficos y el orden por cercanía, deberá mostrarse en un máximo de cinco segundos en al menos el 95 % de las mediciones realizadas bajo las condiciones de prueba definidas.

#### RNF-REN-02 — Paginación y transferencia

El frontend deberá solicitar solo los datos necesarios para la vista actual. Los listados deberán utilizar paginación o carga incremental, evitando transferir todas las fichas y fotografías en una sola respuesta.

#### RNF-REN-03 — Carga de fotografías

Las imágenes deberán utilizar tamaños optimizados y carga diferida cuando no estén inicialmente visibles, sin bloquear los controles de búsqueda y navegación.

### RNF principales y evaluables

Los siguientes son los **cinco RNF principales y evaluables** de EP 1.1. Los criterios anteriores detallan cómo deberán implementarse y comprobarse.

| ID | Categoría | Requerimiento y criterios de verificación |
|---|---|---|
| **RNF-01** | Tiempo de respuesta del catálogo | El 95 % de las búsquedas y combinaciones de filtros, incluidos región, comuna, radio y orden por cercanía, deberá presentar el primer conjunto de resultados en un máximo de **5 segundos** desde la confirmación de los criterios.<br><br>La prueba se realizará con al menos 5.000 fichas, de las cuales 1.000 estarán publicadas y disponibles, una primera página máxima de 25 resultados, una conexión estable de 10 Mbps o superior y latencia igual o inferior a 100 ms.<br><br>Se ejecutarán 20 mediciones representativas después de una ejecución de calentamiento; al menos 19 deberán cumplir el límite y ninguna podrá devolver animales incompatibles con los filtros o fuera del radio seleccionado. |
| **RNF-02** | Usabilidad y adaptación responsive | Los flujos críticos deberán completarse en una vista móvil de `360 × 800 px` y una vista web de `1366 × 768 px` sin desplazamiento horizontal, superposición, contenido inaccesible ni pérdida de acciones.<br><br>Los controles táctiles principales deberán medir al menos `44 × 44 px`.<br><br>Los formularios deberán mantener etiquetas, instrucciones y errores visibles en ambas resoluciones.<br><br>La prueba manual deberá cubrir autenticación, búsqueda por ubicación o radio, catálogo, detalle con refugio y ubicación, postulación en tres pasos (Datos, Motivación y Confirmación), confirmación visual de envío, preselección, propuesta y confirmación de entrevista, reprogramación, entrevista, cierre y liberación del animal cuando no se concrete. |
| **RNF-03** | Seguridad y privacidad | El despliegue deberá utilizar HTTPS con TLS 1.2 o superior.<br><br>Las contraseñas deberán almacenarse mediante hash seguro; los secretos deberán proporcionarse mediante variables de entorno.<br><br>El backend deberá validar autenticación, rol y propiedad del recurso en cada operación protegida.<br><br>Las pruebas deberán confirmar que un Usuario no puede acceder a solicitudes o coordinaciones ajenas, al RUT o teléfono de otras personas, a ubicaciones exactas no autorizadas ni a rutas administrativas; también deberán confirmar que un Administrador no recibe credenciales financieras completas.<br><br>Una revisión del repositorio no deberá encontrar secretos o credenciales reales. |
| **RNF-04** | Compatibilidad | La versión web deberá ejecutar los flujos críticos en la versión estable vigente y en la versión mayor inmediatamente anterior de Google Chrome, Mozilla Firefox, Safari y Opera.<br><br>La evidencia de prueba deberá registrar fecha, sistema operativo y versión exacta del navegador.<br><br>Se aceptarán diferencias visuales menores propias del navegador solo cuando no oculten información ni impidan completar una acción. |
| **RNF-05** | Accesibilidad | Los flujos críticos deberán satisfacer los criterios aplicables de nivel AA de WCAG 2.2 para contraste, teclado, foco visible, etiquetas, identificación de errores y alternativas textuales.<br><br>El contraste mínimo será `4.5:1` para texto normal y `3:1` para texto grande.<br><br>La paleta utilizará `#28CC3E` como color de marca con texto oscuro. Cuando se requiera texto blanco sobre verde deberá utilizarse una variante más oscura que alcance el contraste mínimo, propuesta inicialmente como `#158528`.<br><br>Una auditoría automática no deberá presentar errores críticos y una revisión manual deberá confirmar la operación por teclado y la existencia de alternativas a los gestos. |

---

## Arquitectura de Navegación

### 1. Rutas principales y secundarias

La aplicación considera rutas públicas y rutas protegidas. Las rutas protegidas deberán comprobar la sesión y el rol tanto en el frontend como en el backend.

#### Rutas públicas

| Ruta | Vista | Descripción |
|---|---|---|
| `/login` | Inicio de sesión | Permite ingresar mediante credenciales y redirige a la experiencia correspondiente al rol. |
| `/registro` | Registro | Permite crear una cuenta con rol Usuario. |
| `/catalogo` | Explorar animales | Presenta animales disponibles, nombre y ubicación general del refugio, selector de ubicación y filtros por radio. |
| `/animales/:id` | Detalle del animal | Presenta la ficha pública, información sanitaria autorizada, refugio responsable, comuna, región, distancia aproximada y acciones disponibles. |

#### Rutas protegidas del Usuario

| Ruta | Vista | Descripción |
|---|---|---|
| `/animales/:id/postular` | Formulario de postulación | Permite completar Datos, Motivación y Confirmación. |
| `/usuario/postulaciones` | Mis postulaciones | Presenta las solicitudes propias y su estado actual. |
| `/usuario/postulaciones/:id` | Detalle de postulación | Presenta el seguimiento de una solicitud propia. |
| `/usuario/postulaciones/:id/coordinar` | Coordinación de entrevista | Permite al Usuario con postulación aceptada en proceso consultar si la cita está por confirmar, confirmada o requiere otro horario, y responder a la propuesta. |
| `/usuario/postulaciones/:id/entrevista` | Entrevista confirmada | Presenta el resumen de una cita confirmada con animal, refugio, fecha, hora, modalidad, lugar e instrucciones autorizadas. |
| `/animales/:id/apadrinar` | Apadrinar | Permite seleccionar frecuencia y monto antes de continuar al proveedor de pago. |
| `/usuario/apadrinamientos` | Mis apadrinamientos | Presenta aportes confirmados y renovaciones mensuales propias. |
| `/usuario/alertas` | Alertas | Presenta las notificaciones de la cuenta; las notificaciones accionables permiten acceder directamente a la postulación, coordinación o entrevista relacionada. |
| `/usuario/perfil` | Perfil | Presenta los datos básicos y accesos a favoritos, edición de información, contraseña, apariencia, privacidad y cierre de sesión. |
| `/usuario/favoritos` | Mis favoritos | Presenta los animales guardados por el Usuario sin crear una postulación. |
| `/usuario/perfil/editar` | Editar información | Permite actualizar datos personales editables de la cuenta. |
| `/usuario/perfil/contrasena` | Cambiar contraseña | Permite modificar la contraseña desde una sesión autenticada mediante validaciones de seguridad. |
| `/usuario/perfil/apariencia` | Apariencia | Permite seleccionar y conservar preferencias visuales disponibles de la interfaz. |
| `/usuario/perfil/privacidad` | Privacidad de datos | Informa qué datos personales utiliza PatitasGo, sus finalidades y las opciones de gestión disponibles para la cuenta. |

#### Rutas protegidas del Administrador

| Ruta | Vista | Descripción |
|---|---|---|
| `/admin/resumen` | Resumen | Presenta indicadores operativos y accesos a tareas frecuentes. |
| `/admin/postulaciones` | Gestión de solicitudes | Permite listar y filtrar las postulaciones recibidas. |
| `/admin/postulaciones/:id` | Detalle de solicitud | Permite revisar respuestas y efectuar una transición válida. |
| `/admin/postulaciones/:id/coordinar` | Coordinación, entrevista y cierre | Permite confirmar o proponer horario, registrar asistencia y resultado, verificar la identidad y cerrar la adopción o liberar al animal. |
| `/admin/animales` | Gestión de animales | Permite consultar y mantener las fichas del refugio. |
| `/admin/animales/nuevo` | Nueva ficha | Permite registrar un animal en estado borrador. |
| `/admin/animales/:id/editar` | Editar ficha | Permite modificar, publicar o archivar una ficha existente. |
| `/admin/animales/:id/salud` | Historial médico | Permite consultar y registrar eventos médicos. |
| `/admin/apadrinamientos` | Aportes confirmados | Permite consultar los aportes asociados a animales del refugio. |
| `/admin/perfil` | Perfil administrativo | Presenta los datos de cuenta y la opción de cerrar sesión. |

### 2. Relaciones jerárquicas entre vistas

La aplicación se organiza jerárquicamente según el estado de autenticación y el rol de la cuenta.

```text

Aplicación

│

├── Rutas públicas

│   ├── Inicio de sesión

│   ├── Registro

│   ├── Catálogo

│   └── Detalle del animal

│

└── Rutas protegidas

    │

    ├── Usuario

    │   ├── Explorar

    │   │   └── Detalle del animal

    │   │       ├── Postular

    │   │       └── Apadrinar

    │   ├── Postulaciones

    │   │   └── Detalle y seguimiento

    │   │       └── Coordinación de entrevista

    │   │           └── Entrevista confirmada

    │   ├── Alertas

    │   ├── Apadrinamientos

    │   └── Perfil

    │       ├── Mis favoritos

    │       ├── Editar información

    │       ├── Cambiar contraseña

    │       ├── Apariencia

    │       └── Privacidad de datos

    │

    └── Administrador

        ├── Resumen

        ├── Solicitudes

        │   └── Detalle y cambio de estado

        │       └── Coordinación, entrega y cierre

        ├── Animales

        │   ├── Nueva ficha

        │   ├── Editar ficha

        │   └── Historial médico

        ├── Apadrinamientos

        └── Perfil

```

---

## Diferenciación de acceso según roles

La aplicación deberá controlar el acceso según la sesión y el rol. Cada persona visualizará únicamente las funciones correspondientes, pero el backend volverá a comprobar los permisos antes de leer o modificar información protegida.

Se consideran los siguientes roles autenticados:

- **Usuario**
- **Administrador**

El **Visitante** representa una condición no autenticada y solo accede a contenido público.

### Matriz de acceso por rol

| Funcionalidad | Visitante | Usuario | Administrador |
|---|:---:|:---:|:---:|
| Consultar catálogo y aplicar filtros | ✓ | ✓ | ✓ |
| Elegir ubicación o radio de búsqueda | ✓ | ✓ | ✓ |
| Consultar una ficha pública | ✓ | ✓ | ✓ |
| Consultar refugio, comuna, región y distancia aproximada | ✓ | ✓ | ✓ |
| Guardar interés en un animal | — | ✓ | — |
| Consultar Mis favoritos | — | ✓ | — |
| Editar información personal propia | — | ✓ | — |
| Cambiar contraseña propia | — | ✓ | — |
| Configurar apariencia propia | — | ✓ | — |
| Consultar opciones de privacidad de datos | — | ✓ | — |
| Enviar una postulación | — | ✓ | — |
| Consultar postulaciones propias | — | ✓ | — |
| Confirmar una cita o solicitar otro horario | — | ✓ | — |
| Consultar todas las postulaciones recibidas | — | — | ✓ |
| Cambiar el estado de una postulación | — | — | ✓ |
| Confirmar, proponer, reprogramar o cancelar una cita | — | — | ✓ |
| Registrar entrevista, inasistencia y resultado | — | — | ✓ |
| Verificar identidad y confirmar la entrega del animal | — | — | ✓ |
| Crear, editar, publicar o archivar fichas | — | — | ✓ |
| Consultar el resumen sanitario público | ✓ | ✓ | ✓ |
| Mantener el historial médico completo | — | — | ✓ |
| Realizar y consultar apadrinamientos propios | — | ✓ | — |
| Consultar aportes confirmados del refugio | — | — | ✓ |
| Consultar notificaciones propias | — | ✓ | — |
| Gestionar notificaciones de otra cuenta | — | — | — |

---

### Acceso del Usuario

El Usuario tendrá acceso a las funciones relacionadas con la búsqueda, postulación y apoyo al cuidado de animales.

Podrá:

- Explorar y filtrar animales disponibles.
- Elegir una comuna o autorizar la ubicación aproximada y definir un radio de búsqueda.
- Consultar fichas públicas.
- Conocer el refugio responsable, su comuna, región y distancia aproximada antes de postular.
- Guardar interés sin crear una postulación.
- Completar y enviar una postulación.
- Consultar exclusivamente sus propias solicitudes.
- Recibir una notificación cuando su postulación sea preseleccionada y acceder desde ella al seguimiento correspondiente.
- Revisar una propuesta de entrevista cuando su postulación esté aceptada en proceso.
- Confirmar su asistencia o solicitar otro horario.
- Recibir y marcar sus alertas como leídas, y abrir desde ellas la vista relacionada cuando corresponda.
- Realizar apadrinamientos.
- Consultar sus aportes confirmados.
- Consultar y administrar sus favoritos.
- Editar información personal habilitada.
- Cambiar su contraseña.
- Configurar preferencias de apariencia.
- Consultar información y opciones de privacidad de datos.
- Cerrar sesión.

El Usuario no podrá publicar animales, acceder a solicitudes de otras personas, modificar estados, marcar unilateralmente una adopción como completada ni mantener antecedentes médicos.

La navegación móvil principal utilizará cuatro opciones estables:

1. **Explorar**
2. **Postulaciones**
3. **Alertas**
4. **Perfil**

---

### Acceso del Administrador

El Administrador tendrá acceso a las funciones operativas del refugio.

Podrá:

- Consultar el resumen operativo.
- Revisar y filtrar todas las postulaciones recibidas.
- Efectuar transiciones de estado válidas.
- Consultar el RUT y el teléfono únicamente cuando sean necesarios para evaluar o coordinar una solicitud.
- Proponer, reprogramar o cancelar una cita después de preseleccionar una postulación.
- Registrar asistencia, inasistencia y resultado de la entrevista.
- Devolver el animal a `DISPONIBLE` cuando una postulación aceptada termine rechazada o no se concrete dentro del plazo.
- Verificar presencialmente la identidad, el acuerdo de adopción y la entrega antes de marcar al animal como `ADOPTADO`.
- Crear, editar, publicar y archivar fichas.
- Registrar y actualizar eventos médicos.
- Distinguir información pública e interna.
- Consultar aportes confirmados sin acceder a credenciales financieras.
- Administrar su sesión.

El Administrador no deberá aprobar automáticamente postulaciones, marcar una adopción como completada antes de la entrega ni almacenar datos completos de tarjetas.

La navegación móvil administrativa utilizará cuatro opciones estables:

1. **Resumen**
2. **Solicitudes**
3. **Animales**
4. **Perfil**

---

### Control de acceso a rutas

La diferenciación deberá aplicarse en la interfaz, el enrutamiento y cada operación del backend.

Por ejemplo:

```text

/login

/registro

/catalogo

/animales/:id

/usuario/postulaciones

/usuario/postulaciones/:id/coordinar

/usuario/postulaciones/:id/entrevista

/usuario/alertas

/usuario/perfil

/usuario/favoritos

/usuario/perfil/editar

/usuario/perfil/contrasena

/usuario/perfil/apariencia

/usuario/perfil/privacidad

/admin/resumen

/admin/postulaciones

/admin/postulaciones/:id/coordinar

/admin/animales

/admin/perfil

```

Si una persona intenta acceder a una ruta sin sesión, el sistema deberá dirigirla a `/login` y conservar la ruta de retorno cuando corresponda. Si una cuenta autenticada intenta acceder a una ruta de otro rol, el sistema deberá denegar la operación y dirigirla a una vista autorizada.

---

## Flujos de Tareas

Los flujos de tareas (*task flows*) representan la secuencia de acciones necesarias para completar una actividad. Se consideran tres flujos principales: postulación del **Usuario**, evaluación del **Administrador** y coordinación compartida de la entrega.

---

### Task Flow 1: Búsqueda y postulación a un animal

**Rol:** Usuario

**Objetivo:** encontrar un animal compatible, revisar su ficha y enviar una postulación explícita.

```text

Abrir PatitasGo

      ↓

Elegir comuna o autorizar ubicación

      ↓

Definir radio: 10 / 25 / 50 / 100 km o todo Chile

      ↓

Aplicar especie, tamaño y otros filtros

      ↓

Visualizar resultados con refugio, comuna y distancia

      ↓

Seleccionar tarjeta y revisar ficha

      ↓

Comprobar refugio y ubicación general

      ↓

Seleccionar “Postular”

      ↓

¿Existe sesión válida?

   ↓               ↓

  No               Sí

   ↓                ↓

Login/registro   Paso 1: Datos

   ↓                ↓

Volver a ficha   Ingresar RUT, contacto y antecedentes

        ↘           ↓

             Paso 2: Motivación

                  ↓

          Responder motivación y antecedentes del hogar

                  ↓

             Paso 3: Confirmación

                  ↓

     Revisar animal, refugio, datos y respuestas

                  ↓

      Aceptar declaración y confirmar envío

                  ↓

            ¿Datos válidos?

             ↓          ↓

            No          Sí

             ↓           ↓

       Mostrar errores  Verificar disponibilidad

             ↑           ↓

             └────── ¿Sigue disponible?

                         ↓          ↓

                        No          Sí

                         ↓           ↓

                 Informar cambio   Crear solicitud

                                     ↓

                              Estado PENDIENTE

                                     ↓

                            Mostrar confirmación

                                     ↓

                         Consultar “Mis postulaciones”

```

El gesto de descartar o guardar una tarjeta nunca sustituye la selección de **“Postular”** ni el envío confirmado del formulario.

La entrevista no se agenda durante el envío de la postulación. Solo después de que el refugio decida continuar y la solicitud pase a `ACEPTADA_EN_PROCESO` —mostrada al Usuario como **“Preseleccionada”**— se habilitará la coordinación de una cita.

---

### Task Flow 2: Revisión y resolución de una postulación

**Rol:** Administrador

**Objetivo:** Revisar una solicitud y registrar una decisión válida y trazable.

```text

Inicio de sesión

      ↓

Resumen administrativo

      ↓

Abrir “Solicitudes”

      ↓

Filtrar postulaciones

      ↓

Seleccionar solicitud

      ↓

Revisar formulario completo

      ↓

¿Estado PENDIENTE?

      ↓

Cambiar a EN_REVISION

      ↓

Evaluar antecedentes

      ↓

Seleccionar decisión inicial

   ↓                 ↓

Aceptar proceso   Rechazar

   ↓                 ↓

Confirmar       Ingresar motivo

   ↓                 ↓

Verificar que       Confirmar

no exista otra        ↓

aceptación            ↓

   ↓                 ↓

Registrar `ACEPTADA_EN_PROCESO` (UI: “Preseleccionada”) y auditoría

   ↓                 ↓

Reservar animal    Mantener o devolver

   ↓               disponibilidad según corresponda

Crear propuesta de entrevista  ↓

   ↓                     ↓

Definir fecha, hora, modalidad y lugar

   └───────────┬────────┘

               ↓

       Crear notificación interna

               ↓

       Intentar envío de correo

               ↓

       Mostrar confirmación al Administrador

```

Una transición inválida o una solicitud resuelta por otro Administrador deberá rechazarse sin sobrescribir el estado vigente. `ACEPTADA_EN_PROCESO` reservará al animal e iniciará la entrevista, pero no registrará todavía la adopción como completada.

---

### Task Flow 3: Coordinación, entrega y cierre de la adopción

**Roles:** Usuario con postulación `ACEPTADA_EN_PROCESO` y Administrador

**Objetivo:** Confirmar o reprogramar la entrevista, registrar su resultado y liberar o adoptar al animal mediante reglas trazables.

```text

Postulación ACEPTADA_EN_PROCESO y animal RESERVADO

                          ↓

Administrador crea una propuesta de entrevista

                           ↓

             Definir fecha, hora, modalidad y lugar

                           ↓

Usuario recibe la propuesta del refugio

           ↓                                  ↓

Confirmar asistencia                 Solicitar otro horario

           ↓                                  ↓

CITA_CONFIRMADA                      CAMBIO_SOLICITADO

           ↓                                  ↓

Entrevista programada                Administrador propone otra fecha

           └──────────────────┬───────────────┘

                              ↓

                     ¿Usuario asiste?

                       ↓             ↓

                      No             Sí

                       ↓              ↓

              Registrar NO_ASISTIO   Realizar entrevista

                       ↓              ↓

          ¿Reprograma dentro de 48 h? ¿Se concreta la adopción?

                 ↓             ↓       ↓              ↓

                Sí             No     No              Sí

                 ↓             ↓       ↓              ↓

           Nueva cita       RECHAZADA Registrar motivo Verificar identidad

                 ↓             ↓       ↓              ↓

           Sigue RESERVADO  DISPONIBLE RECHAZADA      Firmar acuerdo

                                           ↓              ↓

                                       DISPONIBLE     Entregar animal

                                                          ↓

                                                 ADOPCION_COMPLETADA

                                                          ↓

                                                      ADOPTADO

```

El lugar exacto, el teléfono y las instrucciones de contacto solo se mostrarán a las cuentas involucradas. Rechazar una **propuesta de horario** no rechaza de inmediato la postulación: deja un nuevo horario pendiente. En cambio, una entrevista rechazada, una cancelación definitiva o una inasistencia sin reprogramación dentro de 48 horas cierra la postulación como `RECHAZADA` y devuelve el animal a `DISPONIBLE`.

---

### Puntos críticos de interacción

Los puntos críticos corresponden a momentos en los que una interfaz ambigua, una validación insuficiente o una operación no controlada podría afectar la experiencia, la integridad de los datos o el bienestar del animal.

1. **Inicio de sesión y acceso por rol:** El sistema deberá explicar los errores de credenciales, redirigir a una vista autorizada y bloquear en el backend cualquier operación incompatible con el rol.
2. **Exploración mediante tarjetas:** Los botones de descartar, información y favorito deberán poseer iconos reconocibles, etiquetas accesibles y alternativas al gesto. Ninguno enviará una postulación.
3. **Ubicación y aplicación de filtros:** La interfaz deberá permitir elegir comuna o autorizar ubicación, seleccionar un radio y mostrar los criterios activos, el número de resultados y una opción para limpiar filtros. Cada resultado identificará refugio, comuna, región y distancia aproximada. Rechazar la geolocalización no deberá bloquear el catálogo.
4. **Formulario de postulación:** El flujo deberá diferenciar **Datos → Motivación → Confirmación**. En Datos se solicitarán identificación y contacto; en Motivación se reunirán los antecedentes pertinentes para evaluar la tenencia responsable. El RUT deberá validarse mediante su dígito verificador, el teléfono deberá usar un formato admitido y los datos personales se tratarán como información protegida. Antes del envío se comprobará nuevamente que el animal continúe disponible y que no exista una solicitud activa duplicada. Tras el éxito, la interfaz deberá comunicar claramente el envío mediante el cambio del botón a **“Enviado”**, completar visualmente el progreso y mostrar la vista **“Postulación enviada”** sin exigir al Usuario repetir datos.
5. **Cambio de estado administrativo:** Aceptar para entrevista, rechazar, registrar inasistencia y cerrar el proceso tendrán consecuencias diferentes. Las acciones deberán mostrar solo transiciones válidas, exigir confirmación y registrar auditoría. Todo cierre rechazado requerirá un motivo.
6. **Información médica:** El Administrador deberá distinguir claramente el resumen público de las observaciones internas. Las fechas incoherentes deberán impedir el guardado y explicar la corrección requerida.
7. **Apadrinamiento y pago externo:** El Usuario deberá conocer monto y periodicidad antes de continuar. Un intento solo se considerará confirmado después de la respuesta exitosa del proveedor; cancelar o fallar no deberá crear un aporte confirmado.
8. **Coordinación, entrevista y entrega:** `ACEPTADA_EN_PROCESO` deberá explicar que el animal está reservado, pero que la adopción aún no está decidida. La interfaz distinguirá propuesta por confirmar, cita confirmada y cambio solicitado. Si hay inasistencia, mostrará el plazo de 48 horas para reprogramar. Solo el Administrador podrá cerrar como adopción completada o rechazada después de registrar el resultado de la entrevista.
9. **Cambio entre versión móvil y web:** La distribución podrá variar, pero los nombres, estados, permisos y consecuencias de las acciones deberán permanecer consistentes. La persona no debería reaprender el sistema al cambiar de dispositivo.

---

### Justificación Técnica

La arquitectura de navegación fue definida considerando **usabilidad, eficiencia de interacción, claridad estructural, adaptación responsive, seguridad por rol y factibilidad de implementación con Ionic y React**.

### Usabilidad

El Usuario dispondrá de una navegación móvil estable con cuatro destinos principales. La exploración mediante fotografías y tarjetas permite concentrar la atención en un animal a la vez, mientras que la ficha detallada separa la información básica, el comportamiento, la salud y las acciones disponibles.

El patrón inspirado en Tinder se utiliza solo como mecanismo de exploración. Se incorporan botones visibles y equivalentes para evitar que el flujo dependa de gestos o que una acción ambigua produzca una postulación accidental.

### Eficiencia de interacción

Los filtros se ubican cerca del catálogo y pueden combinarse sin abandonar el contexto. La ubicación puede ingresarse manualmente o autorizarse desde el dispositivo, y el radio reduce opciones que no serían viables por distancia. La postulación se inicia desde la ficha seleccionada, conservando el animal y el refugio. El Usuario puede consultar solicitudes y alertas desde la navegación principal sin repetir la búsqueda. Cuando una solicitud quede `ACEPTADA_EN_PROCESO`, la interfaz la presentará como **“Preseleccionada”** y la coordinación permanecerá dentro de su detalle para no agregar un quinto destino a la barra inferior. En escritorio, la ficha detallada podrá coexistir con una tarjeta compacta de otro animal disponible para aprovechar el ancho de pantalla y favorecer la exploración continua. Al seleccionar esa tarjeta secundaria, el animal elegido ocupará la ficha principal y se presentará una nueva alternativa secundaria; esta interacción no modificará favoritos ni creará una postulación automáticamente.

Para el Administrador, las tablas y filtros de escritorio permiten revisar más información simultáneamente. El detalle concentra las respuestas y muestra únicamente las transiciones válidas, reduciendo errores operativos. La coordinación y el cierre se mantienen dentro de “Solicitudes”, lo que conserva la navegación principal y separa claramente `ACEPTADA_EN_PROCESO`, `CITA_CONFIRMADA`, `RESERVADO`, `ADOPCION_COMPLETADA`, `RECHAZADA`, `DISPONIBLE` y `ADOPTADO`.

### Claridad estructural

Las vistas se organizan según rutas públicas y dos grupos protegidos. La navegación móvil usa una barra inferior por su alcance táctil y frecuencia de uso; la versión web utiliza una barra lateral o superior para aprovechar el espacio disponible y representar mejor listas, formularios e indicadores.

La estructura general considera:

```text

Rutas públicas

├── Login

├── Registro

├── Catálogo

└── Detalle del animal

Rutas protegidas

├── Usuario

│   ├── Explorar

│   ├── Postulaciones

│   │   └── Coordinación de entrevista

│   │       └── Entrevista confirmada

│   ├── Alertas

│   ├── Apadrinamientos

│   └── Perfil

│       ├── Mis favoritos

│       ├── Editar información

│       ├── Cambiar contraseña

│       ├── Apariencia

│       └── Privacidad de datos

└── Administrador

    ├── Resumen

    ├── Solicitudes

    │   └── Coordinación, entrega y cierre

    ├── Animales

    ├── Historial médico

    ├── Apadrinamientos

    └── Perfil

```

La separación también simplifica el enrutamiento con `IonReactRouter`, la implementación de guardas de ruta y la validación de permisos en los controladores de Express.js. La autorización definitiva deberá permanecer en el backend.

---

## Bocetos UI/UX

La entrega deberá incorporar aquí el enlace público al archivo de Figma construido manualmente por el equipo, con versiones móvil y web y conexiones de prototipado.

- **Enlace al prototipo manual evaluable:** [Ver prototipo EP 1.3 de PatitasGo en Figma](https://www.figma.com/design/5zoQ54KdMQRZyJKPDWX6cI/EP1.3-PatigasGo?node-id=0-1&t=L9dP58QNvqlk4Q2d-1)


Las pantallas esenciales previstas son:

1. Inicio de sesión.
2. Registro.
3. Explorar animales, con selector de comuna o ubicación, radio, refugio visible y navegación mediante tarjetas.
4. Filtros y ubicación/radio, como vista o estado asociado a Explorar.
5. Detalle del animal, con nombre del refugio, comuna, región, distancia aproximada y acciones explícitas.
6. Mis favoritos.
7. Postulación — Datos, con nombre, apellido, RUT, celular, correo y domicilio o comuna.
8. Postulación — Motivación, con antecedentes pertinentes para evaluar la tenencia responsable.
9. Postulación — Confirmación, con resumen de la información y aceptación de las declaraciones correspondientes.
10. Postulación enviada, incluyendo la transición visual desde **“Enviar postulación”** a **“Enviado”**, finalización del indicador de progreso y aparición de la confirmación.
11. Mis postulaciones.
12. Detalle y seguimiento de postulación.
13. Alertas/Notificaciones.
14. Estado o resumen de notificación de preselección, enlazado al seguimiento de la postulación.
15. Coordinación de entrevista después de una preselección, con propuesta del refugio y acciones **“Confirmar asistencia”** o **“Solicitar otro horario”**.
16. Entrevista confirmada, accesible desde la postulación y desde su notificación correspondiente.
17. Apadrinamiento.
18. Perfil del Usuario.
19. Editar información.
20. Cambiar contraseña.
21. Apariencia.
22. Privacidad de datos.
23. Gestión administrativa de solicitudes.
24. Detalle administrativo de una postulación.
25. Coordinación administrativa de entrevista.
26. Registro administrativo del resultado de entrevista, incluyendo asistencia, inasistencia, reprogramación, rechazo o adopción completada.
27. Gestión administrativa de animales.
28. Creación y edición de ficha de animal.
29. Ficha del animal e historial médico.
30. Consulta administrativa de apadrinamientos confirmados.

Cada familia de pantalla deberá poseer adaptación móvil y web cuando corresponda al rol y contexto de uso. Los estados de carga, validación, ausencia de resultados, confirmación y transición pueden implementarse como variantes de una misma familia de pantalla cuando no requieran una ruta independiente. La navegación principal del Usuario continuará limitada a **Explorar, Postulaciones, Alertas y Perfil**; **Mis favoritos** y las opciones de cuenta permanecerán anidadas bajo Perfil, mientras que la coordinación y la entrevista confirmada permanecerán anidadas bajo Postulaciones. En escritorio, la ficha principal del animal podrá utilizar el espacio adicional mostrando una tarjeta compacta secundaria de otro animal disponible, facilitando la exploración continua sin alterar el significado de las acciones.

---
##  Credenciales de Prueba para Evaluación

Para facilitar la revisión de los flujos tanto de Usuario como de Administrador sin necesidad de registrar una nueva cuenta desde cero, se han habilitado las siguientes credenciales de acceso preconfiguradas:

### 1. Perfil de Usuario (Exploración, Postulaciones y Apadrinamientos)
* **Correo electrónico:** `tomas@ejemplo.cl` (o cualquier correo con formato válido `@gmail.com`, `@outlook.com`, etc.)
* **Contraseña:** Cualquier contraseña
* *Nota:* Al iniciar sesión con un correo estándar, el sistema dirigirá automáticamente la interfaz hacia la experiencia del rol **Usuario**.

### 2. Perfil de Administrador (Gestión de Refugio, Solicitudes y Fichas)
* **Correo electrónico:** `admin@patitasgo.cl`
* **Contraseña:** Cualquier contraseña válida configurada en el sistema.
* *Nota:* Al ingresar con este correo administrativo, el sistema validará el rol y desplegará el panel de control exclusivo para la gestión de solicitudes y animales del refugio.

## Librerías usadas con React (Ionic)

Las siguientes dependencias están planificadas para la aplicación base de EP 1.5 y EP 1.6. La lista deberá actualizarse según el contenido real de `package.json` cuando se inicialice el proyecto.

- Componentes y estilos oficiales de Ionic.
- Variables CSS del tema para aplicar la identidad visual de PatitasGo.

### Librerías principales

| Librería | Propósito |
|---|---|
| `react` | Construcción de la interfaz mediante componentes. |
| `react-dom` | Renderizado de componentes React en la versión web. |
| `@ionic/react` | Componentes de interfaz como `IonPage`, `IonContent`, `IonButton`, `IonInput`, `IonCard`, `IonTabs`, `IonMenu` e `IonModal`. |
| `@ionic/react-router` | Integración de Ionic con el sistema de rutas de React. |
| `react-router-dom` | Definición de rutas públicas, protegidas y parametrizadas. |
| `ionicons` | Iconos consistentes para navegación, acciones, estados e información. |

## Tecnologías

- **Ionic Framework**
- **React**
- **TypeScript**
- **Capacitor**, para capacidades nativas cuando sean necesarias
- **Node.js**
- **Express.js**
- **PostgreSQL**
