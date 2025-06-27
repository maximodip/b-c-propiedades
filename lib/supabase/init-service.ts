import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { createStorageBucketIfNotExists } from "./storage";

// Función para inicializar los servicios de Supabase (buckets, etc.)
export async function initializeSupabaseServices() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error("Faltan variables de entorno para Supabase");
    }

    // Crear cliente de Supabase con la API key de servicio para poder crear buckets
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Verificar/crear el bucket de almacenamiento para propiedades
    await createStorageBucketIfNotExists(supabase);

    console.log("Servicios de Supabase inicializados correctamente");
    return { success: true };
  } catch (error) {
    console.error("Error al inicializar servicios de Supabase:", error);
    return { success: false, error };
  }
}
