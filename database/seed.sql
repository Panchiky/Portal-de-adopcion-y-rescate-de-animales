-- PatitasGo: datos de prueba
-- Ejecutar después de schema.sql: psql -U postgres -d patitasgo -f database/seed.sql
-- Contraseñas de prueba: admin@patitasgo.cl / Admin123! (Huellas Felices)  ·  admin.puerto@patitasgo.cl / Admin123! (Patitas del Puerto)
--                        tomas@ejemplo.cl / Usuario123!
-- Las relaciones se arman con subconsultas por nombre o correo y no con ids fijos,
-- así el script funciona aunque cambie el orden de inserción o los ids generados.
SET client_encoding = 'UTF8';

INSERT INTO roles (nombre) VALUES ('USUARIO'), ('ADMIN');

INSERT INTO refugios (nombre, comuna, region, direccion, telefono, email) VALUES
  ('Huellas Felices', 'Valparaíso', 'Valparaíso', 'Av. Brasil 1234', '+56 9 1111 2222', 'contacto@huellasfelices.cl'),
  ('Patitas del Puerto', 'Viña del Mar', 'Valparaíso', 'Calle 5 Norte 456', '+56 9 3333 4444', 'hola@patitasdelpuerto.cl');

INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id, refugio_id, telefono, comuna) VALUES
  ('Admin', 'Huellas Felices', 'admin@patitasgo.cl',
   '$2b$10$eKhJzPDAPiQqkymEMnsct.5aulkCd9H.zdd6NgQBx33R30vxoHOGu',
   (SELECT id FROM roles WHERE nombre = 'ADMIN'),
   (SELECT id FROM refugios WHERE nombre = 'Huellas Felices'), '+56 9 1111 2222', 'Valparaíso'),
  ('Tomás', 'Guerra', 'tomas@ejemplo.cl',
   '$2b$10$9bV4t92wNu4LixPAe7EJtu4d6NDznj1Q/rfpUonT2odTXj1qBOoOe',
   (SELECT id FROM roles WHERE nombre = 'USUARIO'), NULL, '+56 9 5555 6666', 'Viña del Mar'),
  ('Admin', 'Patitas del Puerto', 'admin.puerto@patitasgo.cl',
   '$2b$10$eKhJzPDAPiQqkymEMnsct.5aulkCd9H.zdd6NgQBx33R30vxoHOGu',
   (SELECT id FROM roles WHERE nombre = 'ADMIN'),
   (SELECT id FROM refugios WHERE nombre = 'Patitas del Puerto'), '+56 9 3333 4444', 'Viña del Mar');

INSERT INTO animales (refugio_id, nombre, especie, raza, sexo, edad_meses, tamano, estado, descripcion, salud, vacunado, esterilizado, foto_url) VALUES
  ((SELECT id FROM refugios WHERE nombre = 'Huellas Felices'), 'Milo', 'GATO', 'Mestizo', 'MACHO', 24, 'MEDIANO', 'DISPONIBLE',
   'Compañero sociable que disfruta las siestas al sol y busca un hogar estable y amoroso.',
   'Vacunas al día, desparasitado y esterilizado.', TRUE, TRUE,
   'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'),
  ((SELECT id FROM refugios WHERE nombre = 'Huellas Felices'), 'Luna', 'PERRO', 'Mestiza', 'HEMBRA', 36, 'GRANDE', 'DISPONIBLE',
   'Tranquila y cariñosa, ideal para una familia con patio.',
   'Vacunas al día y esterilizada.', TRUE, TRUE,
   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80'),
  ((SELECT id FROM refugios WHERE nombre = 'Patitas del Puerto'), 'Rocky', 'PERRO', 'Mestizo', 'MACHO', 12, 'PEQUENO', 'DISPONIBLE',
   'Juguetón y lleno de energía, necesita paseos diarios.',
   'Vacunas al día, pendiente de esterilización.', TRUE, FALSE,
   'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'),
  ((SELECT id FROM refugios WHERE nombre = 'Patitas del Puerto'), 'Mabel', 'GATO', 'Mestiza', 'HEMBRA', 60, 'PEQUENO', 'BORRADOR',
   'Gata adulta, independiente y muy tranquila.',
   'En evaluación veterinaria.', FALSE, TRUE,
   'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80');

INSERT INTO postulaciones (usuario_id, animal_id, estado, rut, telefono, comuna, tipo_vivienda, otras_mascotas, motivacion, acepta_terminos) VALUES
  ((SELECT id FROM usuarios WHERE email = 'tomas@ejemplo.cl'), (SELECT id FROM animales WHERE nombre = 'Milo'),
   'PENDIENTE', '12.345.678-5', '+56 9 5555 6666', 'Viña del Mar', 'Departamento', 'Ninguna',
   'Vivo en departamento con balcón protegido y trabajo de forma híbrida.', TRUE),
  ((SELECT id FROM usuarios WHERE email = 'tomas@ejemplo.cl'), (SELECT id FROM animales WHERE nombre = 'Luna'),
   'EN_REVISION', '12.345.678-5', '+56 9 5555 6666', 'Viña del Mar', 'Casa con patio', 'Un gato',
   'Tengo patio cerrado y tiempo para paseos diarios con Luna.', TRUE);

-- Historial de cada postulación (se ubica la postulación por usuario y animal)
INSERT INTO historial_postulaciones (postulacion_id, estado_anterior, estado_nuevo, admin_id, detalle)
SELECT p.id, h.estado_anterior, h.estado_nuevo,
       (SELECT id FROM usuarios WHERE email = h.admin_email), h.detalle
FROM (VALUES
  ('Milo', NULL, 'PENDIENTE', NULL, 'Postulación enviada'),
  ('Luna', NULL, 'PENDIENTE', NULL, 'Postulación enviada'),
  ('Luna', 'PENDIENTE', 'EN_REVISION', 'admin@patitasgo.cl', 'El refugio comenzó la revisión')
) AS h (animal, estado_anterior, estado_nuevo, admin_email, detalle)
JOIN animales a ON a.nombre = h.animal
JOIN postulaciones p ON p.animal_id = a.id
  AND p.usuario_id = (SELECT id FROM usuarios WHERE email = 'tomas@ejemplo.cl');

INSERT INTO favoritos (usuario_id, animal_id) VALUES
  ((SELECT id FROM usuarios WHERE email = 'tomas@ejemplo.cl'), (SELECT id FROM animales WHERE nombre = 'Rocky'));

INSERT INTO notificaciones (usuario_id, titulo, mensaje, enlace)
SELECT u.id, 'Postulación en revisión', 'Huellas Felices comenzó a revisar tu postulación por Luna.',
       '/usuario/postulaciones/' || p.id
FROM usuarios u
JOIN postulaciones p ON p.usuario_id = u.id
JOIN animales a ON a.id = p.animal_id AND a.nombre = 'Luna'
WHERE u.email = 'tomas@ejemplo.cl';
