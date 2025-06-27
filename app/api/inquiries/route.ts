import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CreatePropertyInquirySchema } from "@/lib/types";

// POST /api/inquiries - Crear una consulta sobre una propiedad
export async function POST(request: NextRequest) {
  try {
    // Obtener y validar los datos de la consulta
    const inquiryData = await request.json();
    const validatedData = CreatePropertyInquirySchema.safeParse(inquiryData);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Datos de consulta inválidos",
          details: validatedData.error.format(),
        },
        { status: 400 }
      );
    }

    // Obtener el cliente de Supabase
    const supabase = await createClient();

    // Verificar que la propiedad consultada existe
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", validatedData.data.property_id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "La propiedad consultada no existe" },
        { status: 404 }
      );
    }

    // Insertar la consulta
    const { data, error } = await supabase
      .from("property_inquiries")
      .insert(validatedData.data)
      .select("*")
      .single();

    if (error) {
      console.error("Error al crear consulta:", error);
      return NextResponse.json(
        { error: "Error al procesar la consulta", details: error.message },
        { status: 500 }
      );
    }

    // Aquí podrías implementar el envío de un email de notificación

    return NextResponse.json(
      { message: "Consulta enviada exitosamente", inquiry: data },
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

// GET /api/inquiries - Listar todas las consultas (solo administradores)
export async function GET(request: NextRequest) {
  try {
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
        { error: "No autorizado para ver consultas" },
        { status: 403 }
      );
    }

    // Obtener parámetros de filtro
    const { searchParams } = new URL(request.url);
    const property_id = searchParams.get("property_id");
    const unread_only = searchParams.get("unread_only") === "true";

    // Construir consulta
    let query = supabase
      .from("property_inquiries")
      .select(
        `
        *,
        property:properties(id, title)
      `
      )
      .order("created_at", { ascending: false });

    // Aplicar filtros si fueron proporcionados
    if (property_id) {
      query = query.eq("property_id", property_id);
    }

    if (unread_only) {
      query = query.eq("read", false);
    }

    // Ejecutar la consulta
    const { data: inquiries, error } = await query;

    if (error) {
      console.error("Error al obtener consultas:", error);
      return NextResponse.json(
        { error: "Error al obtener las consultas", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
