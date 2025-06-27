import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

// Tipos para las tablas de Supabase
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// Tipos específicos para las tablas
export type Property = Tables<"properties">;
export type PropertyImage = Tables<"property_images">;
export type PropertyInquiry = Tables<"property_inquiries">;

// Tipos para los enums
export type PropertyType = Enums<"property_type">;
export type PropertyStatus = Enums<"property_status">;

// Función para crear un cliente de Supabase con el tipo de base de datos
export const createDatabaseClient = (
  supabaseUrl: string,
  supabaseKey: string
) => {
  return createClient<Database>(supabaseUrl, supabaseKey);
};

// Usar los clientes existentes de lib/supabase/server.ts y lib/supabase/client.ts
