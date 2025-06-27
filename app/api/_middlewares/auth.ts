import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/supabase/database.types";

// Middleware para verificar autenticación
export async function withAuth(
  request: NextRequest,
  handler: (
    req: NextRequest,
    session: NonNullable<Awaited<ReturnType<typeof getSession>>>
  ) => Promise<NextResponse>
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  return handler(request, session);
}

// Middleware para verificar que el usuario es un agente
export async function withAgentAuth(
  request: NextRequest,
  handler: (
    req: NextRequest,
    session: NonNullable<Awaited<ReturnType<typeof getSession>>>,
    agent: any
  ) => Promise<NextResponse>
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Verificar que el usuario es un agente
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data: agent, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !agent) {
    return NextResponse.json(
      { error: "El usuario no es un agente inmobiliario" },
      { status: 403 }
    );
  }

  return handler(request, session, agent);
}

// Función auxiliar para obtener la sesión
async function getSession() {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
