import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CreatePropertySchema, PropertyFiltersSchema } from "@/lib/types";

// GET /api/properties - Listar propiedades con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parsear y validar los filtros usando Zod
    const filters = PropertyFiltersSchema.safeParse({
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      min_price: searchParams.get("min_price")
        ? Number(searchParams.get("min_price"))
        : undefined,
      max_price: searchParams.get("max_price")
        ? Number(searchParams.get("max_price"))
        : undefined,
      bedrooms: searchParams.get("bedrooms")
        ? Number(searchParams.get("bedrooms"))
        : undefined,
      bathrooms: searchParams.get("bathrooms")
        ? Number(searchParams.get("bathrooms"))
        : undefined,
      min_area: searchParams.get("min_area")
        ? Number(searchParams.get("min_area"))
        : undefined,
      max_area: searchParams.get("max_area")
        ? Number(searchParams.get("max_area"))
        : undefined,
      search: searchParams.get("search") || undefined,
    });

    if (!filters.success) {
      return NextResponse.json(
        {
          error: "Parámetros de filtrado inválidos",
          details: filters.error.format(),
        },
        { status: 400 }
      );
    }

    // Obtener el cliente de Supabase
    const supabase = await createClient();

    // Construir la consulta base
    let query = supabase.from("properties").select(`
        *,
        images:property_images(*)
      `);

    // Aplicar filtros si fueron proporcionados
    const { data: validFilters } = filters;

    if (validFilters.type) {
      query = query.eq("type", validFilters.type);
    }

    if (validFilters.status) {
      query = query.eq("status", validFilters.status);
    }

    if (validFilters.min_price) {
      query = query.gte("price", validFilters.min_price);
    }

    if (validFilters.max_price) {
      query = query.lte("price", validFilters.max_price);
    }

    if (validFilters.bedrooms) {
      query = query.eq("bedrooms", validFilters.bedrooms);
    }

    if (validFilters.bathrooms) {
      query = query.eq("bathrooms", validFilters.bathrooms);
    }

    if (validFilters.min_area) {
      query = query.gte("area_size", validFilters.min_area);
    }

    if (validFilters.max_area) {
      query = query.lte("area_size", validFilters.max_area);
    }

    if (validFilters.search) {
      query = query.or(
        `title.ilike.%${validFilters.search}%,description.ilike.%${validFilters.search}%,address.ilike.%${validFilters.search}%`
      );
    }

    // Ordenar por fecha de publicación (más recientes primero)
    query = query.order("published_at", { ascending: false });

    // Ejecutar la consulta
    const { data: properties, error } = await query;

    if (error) {
      console.error("Error al obtener propiedades:", error);
      return NextResponse.json(
        { error: "Error al obtener propiedades", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ properties });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/properties - Crear una nueva propiedad (solo administradores)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Obtener y validar los datos de la propiedad
    const propertyData = await request.json();
    const validatedData = CreatePropertySchema.safeParse(propertyData);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Datos de propiedad inválidos",
          details: validatedData.error.format(),
        },
        { status: 400 }
      );
    }

    // Verificar que el usuario actual es un administrador
    // Esto asume que tienes un campo role o similar en tu tabla de usuarios
    // o que verificas contra una lista de emails de administradores
    const isAdmin = true; // Aquí deberías implementar tu lógica de verificación de administradores

    if (!isAdmin) {
      return NextResponse.json(
        { error: "No autorizado para crear propiedades" },
        { status: 403 }
      );
    }

    // Insertar la nueva propiedad
    const { data, error } = await supabase
      .from("properties")
      .insert(validatedData.data)
      .select("*")
      .single();

    if (error) {
      console.error("Error al crear propiedad:", error);
      return NextResponse.json(
        { error: "Error al crear la propiedad", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Propiedad creada exitosamente", property: data },
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
