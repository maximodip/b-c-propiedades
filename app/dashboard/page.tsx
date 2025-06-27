import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Si no hay sesión, redirigir al login
    redirect("/auth/login");
  }

  // Obtener información del usuario
  // const user = session.user;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido, {user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Administración</h2>
          <p className="mb-4">
            Desde aquí puedes administrar tus propiedades y consultas.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/dashboard/properties">Gestionar propiedades</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/inquiries">Ver consultas</Link>
            </Button>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Propiedades activas
              </p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consultas nuevas</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visitas este mes</p>
              <p className="text-2xl font-bold">243</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-primary hover:underline">
          ← Volver al sitio público
        </Link>
      </div>
    </div>
  );
}
