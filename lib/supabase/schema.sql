-- Creación de tablas para la inmobiliaria

-- Tabla para agentes inmobiliarios (extiende la tabla auth.users de Supabase)
CREATE TABLE agents (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para agents
CREATE POLICY "Los agentes pueden ver todos los perfiles" ON agents
  FOR SELECT USING (true);

CREATE POLICY "Los agentes solo pueden actualizar su propio perfil" ON agents
  FOR UPDATE USING (auth.uid() = id);

-- Tabla para propiedades inmobiliarias
CREATE TYPE property_type AS ENUM ('casa', 'departamento', 'terreno', 'local', 'oficina');
CREATE TYPE property_status AS ENUM ('disponible', 'vendida', 'alquilada', 'reservada');

CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL NOT NULL,
  address TEXT NOT NULL,
  type property_type NOT NULL,
  status property_status NOT NULL DEFAULT 'disponible',
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_size DECIMAL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  agent_id UUID REFERENCES agents(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para properties
CREATE POLICY "Cualquiera puede ver propiedades publicadas" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Solo los agentes pueden crear propiedades" ON properties
  FOR INSERT WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Los agentes solo pueden actualizar sus propias propiedades" ON properties
  FOR UPDATE USING (auth.uid() = agent_id);

CREATE POLICY "Los agentes solo pueden eliminar sus propias propiedades" ON properties
  FOR DELETE USING (auth.uid() = agent_id);

-- Tabla para imágenes de propiedades
CREATE TABLE property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para property_images
CREATE POLICY "Cualquiera puede ver imágenes de propiedades" ON property_images
  FOR SELECT USING (true);

CREATE POLICY "Solo agentes pueden agregar imágenes a sus propiedades" ON property_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_id AND properties.agent_id = auth.uid()
    )
  );

CREATE POLICY "Solo agentes pueden actualizar imágenes de sus propiedades" ON property_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_id AND properties.agent_id = auth.uid()
    )
  );

CREATE POLICY "Solo agentes pueden eliminar imágenes de sus propiedades" ON property_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_id AND properties.agent_id = auth.uid()
    )
  );

-- Funciones para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON agents
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_property_images_updated_at
BEFORE UPDATE ON property_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at(); 