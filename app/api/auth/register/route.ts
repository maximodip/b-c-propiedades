import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Database } from "@/lib/supabase/database.types";

// Esquema para validación de registro
const RegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().optional(),
});

// POST /api/auth/register - Registrar un nuevo agente
export async function POST(request: NextRequest) {
  try {
    // Obtener y validar los datos de registro
    const registerData = await request.json();
    const validatedData = RegisterSchema.safeParse(registerData);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Datos de registro inválidos",
          details: validatedData.error.format(),
        },
        { status: 400 }
      );
    }

    const { email, password } = validatedData.data;

    // Crear el cliente de Supabase
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Registrar el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error("Error al registrar usuario:", authError);
      return NextResponse.json(
        { error: "Error al registrar el usuario", details: authError?.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Usuario registrado exitosamente. Por favor verifica tu email.",
      },
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
