import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/supabase/database.types";
import { UpsertAgentSchema } from "@/lib/types";

// GET /api/agents/profile - Obtener el perfil del agente autenticado
export async function GET() {
  try {
    // Verificar autenticación
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Obtener el perfil del agente
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No se encontró el perfil
        return NextResponse.json(
          { error: "No existe perfil de agente para este usuario" },
          { status: 404 }
        );
      }

      console.error("Error al obtener perfil:", error);
      return NextResponse.json(
        { error: "Error al obtener el perfil", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/agents/profile - Actualizar el perfil del agente autenticado
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Verificar si el perfil de agente existe
    const { data: existingProfile, error: profileError } = await supabase
      .from("agents")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existingProfile) {
      return NextResponse.json(
        { error: "No existe perfil de agente para este usuario" },
        { status: 404 }
      );
    }

    // Obtener y validar los datos de actualización
    const profileData = await request.json();
    const validatedData = UpsertAgentSchema.safeParse(profileData);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Datos de perfil inválidos",
          details: validatedData.error.format(),
        },
        { status: 400 }
      );
    }

    // Actualizar el perfil
    const { data, error } = await supabase
      .from("agents")
      .update({
        ...validatedData.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      console.error("Error al actualizar perfil:", error);
      return NextResponse.json(
        { error: "Error al actualizar el perfil", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
      profile: data,
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
