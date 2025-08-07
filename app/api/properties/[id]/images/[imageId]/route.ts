import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deletePropertyImage } from "@/lib/supabase/storage";

function extractIds(request: NextRequest): { propertyId: string; imageId: string } | null {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean);
    // Expected: .../properties/{id}/images/{imageId}
    const imageId = segments[segments.length - 1];
    const propertyId = segments[segments.length - 3];
    if (!propertyId || !imageId) return null;
    return { propertyId, imageId };
  } catch {
    return null;
  }
}

// DELETE /api/properties/[id]/images/[imageId] - Eliminar una imagen
export async function DELETE(request: NextRequest) {
  try {
    const ids = extractIds(request);
    if (!ids) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }
    const { propertyId, imageId } = ids;

    // Verificar autenticación
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

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

    // Obtener la información de la imagen
    const { data: image, error: imageError } = await supabase
      .from("property_images")
      .select("storage_path, is_main")
      .eq("id", imageId)
      .eq("property_id", propertyId)
      .single();

    if (imageError || !image) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar la imagen de Storage
    await deletePropertyImage(supabase, image.storage_path);

    // Eliminar el registro de la base de datos
    const { error: deleteError } = await supabase
      .from("property_images")
      .delete()
      .eq("id", imageId);

    if (deleteError) {
      console.error("Error al eliminar imagen:", deleteError);
      return NextResponse.json(
        { error: "Error al eliminar la imagen", details: deleteError.message },
        { status: 500 }
      );
    }

    // Si era la imagen principal, establecer otra imagen como principal
    if (image.is_main) {
      const { data: otherImages } = await supabase
        .from("property_images")
        .select("id")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (otherImages && otherImages.length > 0) {
        await supabase
          .from("property_images")
          .update({ is_main: true })
          .eq("id", otherImages[0].id);
      }
    }

    return NextResponse.json({
      message: "Imagen eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PATCH /api/properties/[id]/images/[imageId] - Establecer como imagen principal
export async function PATCH(request: NextRequest) {
  try {
    const ids = extractIds(request);
    if (!ids) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }
    const { propertyId, imageId } = ids;

    // Verificar autenticación
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

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

    // Verificar que la imagen existe
    const { data: image, error: imageError } = await supabase
      .from("property_images")
      .select("id")
      .eq("id", imageId)
      .eq("property_id", propertyId)
      .single();

    if (imageError || !image) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );
    }

    // Primero, quitar la marca de principal de todas las imágenes
    await supabase
      .from("property_images")
      .update({ is_main: false })
      .eq("property_id", propertyId);

    // Establecer la imagen seleccionada como principal
    const { error } = await supabase
      .from("property_images")
      .update({ is_main: true })
      .eq("id", imageId);

    if (error) {
      console.error("Error al establecer imagen principal:", error);
      return NextResponse.json(
        {
          error: "Error al establecer la imagen principal",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Imagen establecida como principal exitosamente",
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
