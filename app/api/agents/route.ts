import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/supabase/database.types";
import { UpsertAgentSchema } from "@/lib/types";

// GET /api/agents - Obtener todos los agentes (solo para administradores)
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

    // Obtener todos los agentes
    const { data: agents, error } = await supabase.from("agents").select("*");

    if (error) {
      console.error("Error al obtener agentes:", error);
      return NextResponse.json(
        { error: "Error al obtener los agentes", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ agents });
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/agents - Crear un agente al registrar un usuario
export async function POST(request: NextRequest) {
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

    // Verificar si el usuario ya es un agente
    const { data: existingAgent } = await supabase
      .from("agents")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (existingAgent) {
      return NextResponse.json(
        { error: "El usuario ya es un agente inmobiliario" },
        { status: 400 }
      );
    }

    // Obtener y validar los datos del agente
    const agentData = await request.json();
    const validatedData = UpsertAgentSchema.safeParse(agentData);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Datos de agente inválidos",
          details: validatedData.error.format(),
        },
        { status: 400 }
      );
    }

    // Si no se proporciona un email, usar el email del usuario autenticado
    const userData = {
      ...validatedData.data,
      email: validatedData.data.email || session.user.email,
    };

    // Insertar el nuevo agente
    const { data, error } = await supabase
      .from("agents")
      .insert({
        id: userId,
        ...userData,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error al crear agente:", error);
      return NextResponse.json(
        { error: "Error al crear el agente", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Agente creado exitosamente", agent: data },
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
