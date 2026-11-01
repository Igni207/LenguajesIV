-- Estructura de la base de datos del portfolio
-- Motor: PostgreSQL (Supabase)

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(10) NOT NULL DEFAULT 'user',
  proveedor VARCHAR(10) NOT NULL DEFAULT 'email',
  acepta_terminos BOOLEAN NOT NULL DEFAULT FALSE,
  origen_registro VARCHAR(20),
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE proyectos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  imagen_url VARCHAR(500),
  demo_url VARCHAR(500),
  repo_url VARCHAR(500),
  tipo VARCHAR(50),
  autor VARCHAR(100),
  tecnologias VARCHAR(300),
  destacado BOOLEAN NOT NULL DEFAULT FALSE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE servicios (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio_desde NUMERIC(10,2),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE consultas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'general',
  mensaje TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  respuesta TEXT,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE visitas (
  id SERIAL PRIMARY KEY,
  ruta VARCHAR(200) NOT NULL,
  usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE logins (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  proveedor VARCHAR(10) NOT NULL DEFAULT 'email',
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE integrantes (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  alias VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  nombre_corto VARCHAR(50),
  rol VARCHAR(100) NOT NULL,
  color VARCHAR(7),
  color_profundo VARCHAR(7),
  bio_corta TEXT,
  bio_larga TEXT,
  titulo_cv VARCHAR(150),
  ciudad VARCHAR(100),
  email_contacto VARCHAR(150),
  telefono VARCHAR(50),
  whatsapp VARCHAR(30),
  github VARCHAR(500),
  linkedin VARCHAR(500),
  foto_url VARCHAR(500),
  cv_pdf_url VARCHAR(500),
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE habilidades (
  id SERIAL PRIMARY KEY,
  integrante_id INT NOT NULL REFERENCES integrantes(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  nivel INT NOT NULL CHECK (nivel BETWEEN 0 AND 100),
  orden INT NOT NULL DEFAULT 0
);

CREATE TABLE idiomas (
  id SERIAL PRIMARY KEY,
  integrante_id INT NOT NULL REFERENCES integrantes(id) ON DELETE CASCADE,
  nombre VARCHAR(50) NOT NULL,
  nivel VARCHAR(30) NOT NULL
);

CREATE TABLE trayectoria (
  id SERIAL PRIMARY KEY,
  integrante_id INT NOT NULL REFERENCES integrantes(id) ON DELETE CASCADE,
  tipo VARCHAR(15) NOT NULL CHECK (tipo IN ('experiencia', 'educacion')),
  desde VARCHAR(30),
  hasta VARCHAR(30),
  titulo VARCHAR(200) NOT NULL,
  lugar VARCHAR(200),
  descripcion TEXT,
  orden INT NOT NULL DEFAULT 0
);

CREATE TABLE proyecto_integrantes (
  proyecto_id INT NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  integrante_id INT NOT NULL REFERENCES integrantes(id) ON DELETE CASCADE,
  PRIMARY KEY (proyecto_id, integrante_id)
);


ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE habilidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE idiomas ENABLE ROW LEVEL SECURITY;
ALTER TABLE trayectoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyecto_integrantes ENABLE ROW LEVEL SECURITY;