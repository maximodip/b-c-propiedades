import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Si no hay sesión, redirigir al login
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-semibold">
              Dashboard
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard/properties"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Propiedades
              </Link>
              <Link
                href="/dashboard/inquiries"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Consultas
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver sitio
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Inmobiliaria NextJS. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
