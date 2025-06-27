import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/supabase/database.types";
import { uploadPropertyImage } from "@/lib/supabase/storage";

// POST /api/properties/[id]/images - Subir una imagen a una propiedad
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: propertyId } = params;

    // Verificar autenticación
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que la propiedad existe y pertenece al agente actual
    // const userId = session.user.id;
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, agent_id")
      .eq("id", propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // if (property.agent_id !== userId) {
    //   return NextResponse.json(
    //     { error: "No autorizado para agregar imágenes a esta propiedad" },
    //     { status: 403 }
    //   );
    // }

    // Obtener la imagen del cuerpo de la solicitud
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const isMainImage = formData.get("is_main") === "true";

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Verificar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Use JPEG, PNG o WebP." },
        { status: 400 }
      );
    }

    // Verificar tamaño de archivo (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Tamaño máximo: 10MB" },
        { status: 400 }
      );
    }

    // Subir la imagen a Supabase Storage
    const { url, storagePath } = await uploadPropertyImage(
      supabase,
      file,
      propertyId
    );

    // Guardar la referencia en la base de datos
    const { data: imageData, error: imageError } = await supabase
      .from("property_images")
      .insert({
        property_id: propertyId,
        url,
        storage_path: storagePath,
        is_main: isMainImage,
      })
      .select("*")
      .single();

    if (imageError) {
      console.error("Error al registrar imagen:", imageError);
      return NextResponse.json(
        { error: "Error al registrar la imagen", details: imageError.message },
        { status: 500 }
      );
    }

    // Si es la imagen principal, actualizar las demás imágenes para que no sean principales
    if (isMainImage) {
      await supabase
        .from("property_images")
        .update({ is_main: false })
        .neq("id", imageData.id)
        .eq("property_id", propertyId);
    }

    return NextResponse.json(
      { message: "Imagen subida exitosamente", image: imageData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET /api/properties/[id]/images - Obtener todas las imágenes de una propiedad
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: propertyId } = params;

    // Obtener el cliente de Supabase
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Verificar que la propiedad existe
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Obtener todas las imágenes de la propiedad
    const { data: images, error } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", propertyId)
      .order("is_main", { ascending: false });

    if (error) {
      console.error("Error al obtener imágenes:", error);
      return NextResponse.json(
        { error: "Error al obtener las imágenes", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
