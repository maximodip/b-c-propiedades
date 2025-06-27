import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

// Configuración de almacenamiento
const STORAGE_BUCKET = "properties";

// Función para subir una imagen a Supabase Storage y devolver la URL
export const uploadPropertyImage = async (
  supabase: ReturnType<typeof createClient<Database>>,
  file: File,
  propertyId: string
) => {
  try {
    // Generar un nombre único para el archivo
    const fileExtension = file.name.split(".").pop();
    const fileName = `${propertyId}/${uuidv4()}.${fileExtension}`;
    const storagePath = `${fileName}`;

    // Subir el archivo a Supabase Storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Obtener la URL pública del archivo
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

    return { url: publicUrl, storagePath };
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }
};

// Función para eliminar una imagen de Supabase Storage
export const deletePropertyImage = async (
  supabase: ReturnType<typeof createClient<Database>>,
  storagePath: string
) => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    throw error;
  }
};

// Función para obtener todas las imágenes de una propiedad
export const getPropertyImages = async (
  supabase: ReturnType<typeof createClient<Database>>,
  propertyId: string
) => {
  try {
    const { data: images, error } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", propertyId)
      .order("is_main", { ascending: false });

    if (error) {
      throw error;
    }

    return images;
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    throw error;
  }
};

// Función para establecer una imagen como principal
export const setMainImage = async (
  supabase: ReturnType<typeof createClient<Database>>,
  imageId: string,
  propertyId: string
) => {
  try {
    // Primero, quitar la marca de principal de todas las imágenes de esta propiedad
    await supabase
      .from("property_images")
      .update({ is_main: false })
      .eq("property_id", propertyId);

    // Luego, establecer la imagen seleccionada como principal
    const { error } = await supabase
      .from("property_images")
      .update({ is_main: true })
      .eq("id", imageId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error al establecer imagen principal:", error);
    throw error;
  }
};

// Crear un bucket en Supabase Storage si no existe
export const createStorageBucketIfNotExists = async (
  supabase: ReturnType<typeof createClient<Database>>
) => {
  try {
    // Verificar si el bucket ya existe
    const { error } = await supabase.storage.getBucket(STORAGE_BUCKET);

    if (error && error.message.includes("does not exist")) {
      // Crear el bucket si no existe
      const { error: createError } = await supabase.storage.createBucket(
        STORAGE_BUCKET,
        {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        }
      );

      if (createError) {
        console.error("Error al crear bucket:", createError);
        throw createError;
      }
    } else if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error al verificar/crear bucket:", error);
    throw error;
  }
};
