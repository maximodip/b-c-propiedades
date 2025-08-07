import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/supabase/database.types";
import { UpdatePropertySchema } from "@/lib/types";

function extractPropertyId(request: NextRequest): string | null {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean);
    // Expected: .../properties/{id}
    const id = segments[segments.length - 1];
    return id || null;
  } catch {
    return null;
  }
}

// GET /api/properties/[id] - Obtener una propiedad específica
export async function GET(request: NextRequest) {
  try {
    const id = extractPropertyId(request);
    if (!id) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    // Obtener el cliente de Supabase
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Obtener la propiedad con relaciones
    const { data: property, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        agent:agents(*),
        images:property_images(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // PGRST116 indica que no se encontró ninguna fila
        return NextResponse.json(
          { error: "Propiedad no encontrada" },
          { status: 404 }
        );
      }

      console.error("Error al obtener la propiedad:", error);
      return NextResponse.json(
        { error: "Error al obtener la propiedad", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Actualizar una propiedad existente
export async function PUT(request: NextRequest) {
  try {
    const id = extractPropertyId(request);
    if (!id) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    // Verificar autenticación
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que la propiedad existe
    const { data: existingProperty, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", id)
      .single();

    if (propertyError || !existingProperty) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Obtener y validar los datos actualizados
    const propertyData = await request.json();
    const validatedData = UpdatePropertySchema.safeParse(propertyData);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Datos de propiedad inválidos",
          details: validatedData.error.format(),
        },
        { status: 400 }
      );
    }

    // Actualizar la propiedad
    const { data, error } = await supabase
      .from("properties")
      .update({
        ...validatedData.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error al actualizar propiedad:", error);
      return NextResponse.json(
        { error: "Error al actualizar la propiedad", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Propiedad actualizada exitosamente",
      property: data,
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Eliminar una propiedad existente
export async function DELETE(request: NextRequest) {
  try {
    const id = extractPropertyId(request);
    if (!id) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    // Verificar autenticación
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que la propiedad existe
    const { data: existingProperty, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", id)
      .single();

    if (propertyError || !existingProperty) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar la propiedad (las imágenes se eliminarán automáticamente debido a la restricción ON DELETE CASCADE)
    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar propiedad:", error);
      return NextResponse.json(
        { error: "Error al eliminar la propiedad", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Propiedad eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
