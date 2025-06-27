-- Creación de tablas para la inmobiliaria (versión actualizada sin agentes)

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
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para properties
CREATE POLICY "Cualquiera puede ver propiedades" ON properties
  FOR SELECT USING (true);

-- Con RLS activado, necesitamos un rol admin para gestionar propiedades
-- Asumimos que tienes un usuario admin en auth.users
CREATE POLICY "Los administradores pueden gestionar propiedades" ON properties
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@tuinmobiliaria.com'
  ));

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

-- Con RLS activado, necesitamos un rol admin para gestionar imágenes
CREATE POLICY "Los administradores pueden gestionar imágenes" ON property_images
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@tuinmobiliaria.com'
  ));

-- Tabla para consultas de visitantes sobre propiedades
CREATE TABLE property_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para property_inquiries
CREATE POLICY "Los visitantes pueden crear consultas" ON property_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo los administradores pueden ver consultas" ON property_inquiries
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@tuinmobiliaria.com'
  ));

-- Funciones para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_property_images_updated_at
BEFORE UPDATE ON property_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at(); 