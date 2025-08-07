import { createClient } from "@/lib/supabase/server";
import { PropertiesGrid } from "@/components/properties-grid";
import Link from "next/link";

export default async function DashboardPropertiesPage() {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select(
      `
        *,
        images:property_images(*)
      `
    )
    .order("published_at", { ascending: false });

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Propiedades</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las propiedades publicadas en el sitio
          </p>
        </div>
        <Link
          href="/properties"
          className="text-sm text-primary hover:underline"
        >
          Ver en sitio público →
        </Link>
      </div>

      <PropertiesGrid properties={properties || []} />
    </div>
  );
}