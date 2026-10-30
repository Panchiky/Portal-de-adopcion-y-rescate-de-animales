-- PatitasGo: datos de prueba
-- Ejecutar después de schema.sql: psql -U postgres -d patitasgo -f database/seed.sql
-- Contraseñas de prueba: admin@patitasgo.cl / Admin123!  ·  tomas@ejemplo.cl / Usuario123!
SET client_encoding = 'UTF8';

INSERT INTO roles (nombre) VALUES ('USUARIO'), ('ADMIN');

INSERT INTO refugios (nombre, comuna, region, direccion, telefono, email) VALUES
  ('Huellas Felices', 'Valparaíso', 'Valparaíso', 'Av. Brasil 1234', '+56 9 1111 2222', 'contacto@huellasfelices.cl'),
  ('Patitas del Puerto', 'Viña del Mar', 'Valparaíso', 'Calle 5 Norte 456', '+56 9 3333 4444', 'hola@patitasdelpuerto.cl');

INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id, refugio_id, telefono, comuna) VALUES
  ('Admin', 'Huellas Felices', 'admin@patitasgo.cl',
   '$2b$10$eKhJzPDAPiQqkymEMnsct.5aulkCd9H.zdd6NgQBx33R30vxoHOGu',
   (SELECT id FROM roles WHERE nombre = 'ADMIN'), 1, '+56 9 1111 2222', 'Valparaíso'),
  ('Tomás', 'Guerra', 'tomas@ejemplo.cl',
   '$2b$10$9bV4t92wNu4LixPAe7EJtu4d6NDznj1Q/rfpUonT2odTXj1qBOoOe',
   (SELECT id FROM roles WHERE nombre = 'USUARIO'), NULL, '+56 9 5555 6666', 'Viña del Mar');

INSERT INTO animales (refugio_id, nombre, especie, raza, sexo, edad_meses, tamano, estado, descripcion, salud, vacunado, esterilizado, foto_url) VALUES
  (1, 'Milo', 'GATO', 'Mestizo', 'MACHO', 24, 'MEDIANO', 'DISPONIBLE',
   'Compañero sociable que disfruta las siestas al sol y busca un hogar estable y amoroso.',
   'Vacunas al día, desparasitado y esterilizado.', TRUE, TRUE, NULL),
  (1, 'Luna', 'PERRO', 'Mestiza', 'HEMBRA', 36, 'GRANDE', 'DISPONIBLE',
   'Tranquila y cariñosa, ideal para una familia con patio.',
   'Vacunas al día y esterilizada.', TRUE, TRUE, NULL),
  (2, 'Rocky', 'PERRO', 'Mestizo', 'MACHO', 12, 'PEQUENO', 'DISPONIBLE',
   'Juguetón y lleno de energía, necesita paseos diarios.',
   'Vacunas al día, pendiente de esterilización.', TRUE, FALSE, NULL),
  (2, 'Mabel', 'GATO', 'Mestiza', 'HEMBRA', 60, 'PEQUENO', 'BORRADOR',
   'Gata adulta, independiente y muy tranquila.',
   'En evaluación veterinaria.', FALSE, TRUE, NULL);

INSERT INTO postulaciones (usuario_id, animal_id, estado, rut, telefono, comuna, tipo_vivienda, otras_mascotas, motivacion, acepta_terminos) VALUES
  (2, 1, 'PENDIENTE', '12.345.678-5', '+56 9 5555 6666', 'Viña del Mar', 'Departamento', 'Ninguna',
   'Vivo en departamento con balcón protegido y trabajo de forma híbrida.', TRUE),
  (2, 2, 'EN_REVISION', '12.345.678-5', '+56 9 5555 6666', 'Viña del Mar', 'Casa con patio', 'Un gato',
   'Tengo patio cerrado y tiempo para paseos diarios con Luna.', TRUE);

INSERT INTO historial_postulaciones (postulacion_id, estado_anterior, estado_nuevo, admin_id, detalle) VALUES
  (1, NULL, 'PENDIENTE', NULL, 'Postulación enviada'),
  (2, NULL, 'PENDIENTE', NULL, 'Postulación enviada'),
  (2, 'PENDIENTE', 'EN_REVISION', 1, 'El refugio comenzó la revisión');

INSERT INTO favoritos (usuario_id, animal_id) VALUES (2, 3);

INSERT INTO notificaciones (usuario_id, titulo, mensaje, enlace) VALUES
  (2, 'Postulación en revisión', 'Huellas Felices comenzó a revisar tu postulación por Luna.', '/usuario/postulaciones/2');
