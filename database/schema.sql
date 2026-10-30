-- PatitasGo: modelo relacional (PostgreSQL)
-- Ejecutar sobre una base vacía: psql -U postgres -d patitasgo -f database/schema.sql
SET client_encoding = 'UTF8';

DROP TABLE IF EXISTS notificaciones, apadrinamientos, favoritos, citas,
  historial_postulaciones, postulaciones, animales, usuarios, refugios, roles CASCADE;
DROP FUNCTION IF EXISTS fn_actualizado_en() CASCADE;

CREATE TABLE roles (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(20) NOT NULL UNIQUE CHECK (nombre IN ('USUARIO', 'ADMIN'))
);

CREATE TABLE refugios (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(120) NOT NULL UNIQUE,
  comuna    VARCHAR(80)  NOT NULL,
  region    VARCHAR(80)  NOT NULL,
  direccion VARCHAR(200),
  telefono  VARCHAR(20),
  email     VARCHAR(150),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE usuarios (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(80)  NOT NULL,
  apellido       VARCHAR(80)  NOT NULL,
  email          VARCHAR(150) NOT NULL,
  password_hash  VARCHAR(100) NOT NULL,
  rol_id         INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  refugio_id     INT REFERENCES refugios(id) ON DELETE SET NULL,
  telefono       VARCHAR(20),
  comuna         VARCHAR(80),
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_email_formato CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
CREATE UNIQUE INDEX uq_usuarios_email ON usuarios (LOWER(email));

CREATE TABLE animales (
  id             SERIAL PRIMARY KEY,
  refugio_id     INT NOT NULL REFERENCES refugios(id) ON DELETE RESTRICT,
  nombre         VARCHAR(60) NOT NULL,
  especie        VARCHAR(10) NOT NULL CHECK (especie IN ('PERRO', 'GATO')),
  raza           VARCHAR(60),
  sexo           VARCHAR(10) NOT NULL CHECK (sexo IN ('MACHO', 'HEMBRA')),
  edad_meses     INT NOT NULL CHECK (edad_meses >= 0),
  tamano         VARCHAR(10) NOT NULL CHECK (tamano IN ('PEQUENO', 'MEDIANO', 'GRANDE')),
  estado         VARCHAR(12) NOT NULL DEFAULT 'BORRADOR'
                 CHECK (estado IN ('BORRADOR', 'DISPONIBLE', 'RESERVADO', 'ADOPTADO', 'ARCHIVADO')),
  descripcion    TEXT,
  salud          TEXT,
  vacunado       BOOLEAN NOT NULL DEFAULT FALSE,
  esterilizado   BOOLEAN NOT NULL DEFAULT FALSE,
  foto_url       VARCHAR(300),
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_animales_estado ON animales (estado);
CREATE INDEX idx_animales_refugio ON animales (refugio_id);

CREATE TABLE postulaciones (
  id              SERIAL PRIMARY KEY,
  usuario_id      INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  animal_id       INT NOT NULL REFERENCES animales(id) ON DELETE RESTRICT,
  estado          VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                  CHECK (estado IN ('PENDIENTE', 'EN_REVISION', 'ACEPTADA_EN_PROCESO', 'ADOPCION_COMPLETADA', 'RECHAZADA')),
  rut             VARCHAR(12) NOT NULL,
  telefono        VARCHAR(20) NOT NULL,
  comuna          VARCHAR(80) NOT NULL,
  tipo_vivienda   VARCHAR(40) NOT NULL,
  otras_mascotas  VARCHAR(120),
  motivacion      TEXT NOT NULL CHECK (LENGTH(motivacion) >= 20),
  acepta_terminos BOOLEAN NOT NULL CHECK (acepta_terminos),
  motivo_rechazo  TEXT,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_rechazo_con_motivo CHECK (estado <> 'RECHAZADA' OR motivo_rechazo IS NOT NULL)
);
-- Un usuario no puede tener dos postulaciones activas para el mismo animal
CREATE UNIQUE INDEX uq_postulacion_activa ON postulaciones (usuario_id, animal_id)
  WHERE estado IN ('PENDIENTE', 'EN_REVISION', 'ACEPTADA_EN_PROCESO');
-- Un animal solo puede tener una postulación preseleccionada a la vez
CREATE UNIQUE INDEX uq_animal_preseleccionado ON postulaciones (animal_id)
  WHERE estado = 'ACEPTADA_EN_PROCESO';
CREATE INDEX idx_postulaciones_estado ON postulaciones (estado);

CREATE TABLE historial_postulaciones (
  id              SERIAL PRIMARY KEY,
  postulacion_id  INT NOT NULL REFERENCES postulaciones(id) ON DELETE CASCADE,
  estado_anterior VARCHAR(20),
  estado_nuevo    VARCHAR(20) NOT NULL,
  admin_id        INT REFERENCES usuarios(id) ON DELETE SET NULL,
  detalle         TEXT,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE citas (
  id             SERIAL PRIMARY KEY,
  postulacion_id INT NOT NULL REFERENCES postulaciones(id) ON DELETE CASCADE,
  fecha_hora     TIMESTAMPTZ NOT NULL,
  modalidad      VARCHAR(25) NOT NULL CHECK (modalidad IN ('RETIRO_EN_REFUGIO', 'ENCUENTRO_COORDINADO')),
  lugar          VARCHAR(200),
  instrucciones  TEXT,
  estado         VARCHAR(20) NOT NULL DEFAULT 'POR_CONFIRMAR'
                 CHECK (estado IN ('POR_CONFIRMAR', 'CONFIRMADA', 'CAMBIO_SOLICITADO', 'CANCELADA', 'NO_ASISTIO', 'REALIZADA')),
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE favoritos (
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  animal_id  INT NOT NULL REFERENCES animales(id) ON DELETE CASCADE,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, animal_id)
);

CREATE TABLE apadrinamientos (
  id         SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  animal_id  INT NOT NULL REFERENCES animales(id) ON DELETE RESTRICT,
  monto      INT NOT NULL CHECK (monto >= 3000),
  frecuencia VARCHAR(10) NOT NULL CHECK (frecuencia IN ('UNICA', 'MENSUAL')),
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notificaciones (
  id         SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo     VARCHAR(120) NOT NULL,
  mensaje    TEXT NOT NULL,
  enlace     VARCHAR(200),
  leida      BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notificaciones_usuario ON notificaciones (usuario_id, leida);

-- Mantiene actualizado_en al modificar un registro
CREATE FUNCTION fn_actualizado_en() RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_actualizado BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION fn_actualizado_en();
CREATE TRIGGER trg_animales_actualizado BEFORE UPDATE ON animales
  FOR EACH ROW EXECUTE FUNCTION fn_actualizado_en();
CREATE TRIGGER trg_postulaciones_actualizado BEFORE UPDATE ON postulaciones
  FOR EACH ROW EXECUTE FUNCTION fn_actualizado_en();
