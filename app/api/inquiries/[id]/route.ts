import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function extractIdFromRequest(request: NextRequest): string | null {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean);
    // Expecting [..., 'inquiries', '{id}']
    const id = segments[segments.length - 1];
    return id || null;
  } catch {
    return null;
  }
}

// PATCH /api/inquiries/[id] - Marcar una consulta como leída/no leída
export async function PATCH(request: NextRequest) {
  try {
    const id = extractIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Verificar autenticación
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que el usuario es un administrador
    const isAdmin = true; // Implementa aquí tu lógica de verificación

    if (!isAdmin) {
      return NextResponse.json(
        { error: "No autorizado para actualizar consultas" },
        { status: 403 }
      );
    }

    // Obtener el estado actual para cambiarlo
    const { data: inquiry, error: inquiryError } = await supabase
      .from("property_inquiries")
      .select("read")
      .eq("id", id)
      .single();

    if (inquiryError || !inquiry) {
      return NextResponse.json(
        { error: "Consulta no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar el estado al contrario (leído/no leído)
    const { data, error } = await supabase
      .from("property_inquiries")
      .update({ read: !inquiry.read })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error al actualizar consulta:", error);
      return NextResponse.json(
        { error: "Error al actualizar la consulta", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Consulta marcada como ${
        data.read ? "leída" : "no leída"
      } exitosamente`,
      inquiry: data,
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/inquiries/[id] - Eliminar una consulta
export async function DELETE(request: NextRequest) {
  try {
    const id = extractIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Verificar autenticación
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que el usuario es un administrador
    const isAdmin = true; // Implementa aquí tu lógica de verificación

    if (!isAdmin) {
      return NextResponse.json(
        { error: "No autorizado para eliminar consultas" },
        { status: 403 }
      );
    }

    // Verificar que la consulta existe
    const { data: inquiry, error: inquiryError } = await supabase
      .from("property_inquiries")
      .select("id")
      .eq("id", id)
      .single();

    if (inquiryError || !inquiry) {
      return NextResponse.json(
        { error: "Consulta no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar la consulta
    const { error } = await supabase
      .from("property_inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar consulta:", error);
      return NextResponse.json(
        { error: "Error al eliminar la consulta", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Consulta eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
