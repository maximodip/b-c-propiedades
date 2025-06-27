import { createClient } from "@/lib/supabase/server";
import { PropertiesGrid } from "@/components/properties-grid";
import { PropertyFilters, PropertyType, PropertyStatus } from "@/lib/types";
import Link from "next/link";

// Revalidar página cada 5 minutos
export const revalidate = 300;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Esperar a que se resuelva searchParams
  const resolvedSearchParams = await searchParams;

  // Convertir searchParams a filtros
  const filters: Partial<PropertyFilters> = {
    type: resolvedSearchParams.type as PropertyType | undefined,
    status: resolvedSearchParams.status as PropertyStatus | undefined,
    min_price: resolvedSearchParams.min_price
      ? Number(resolvedSearchParams.min_price)
      : undefined,
    max_price: resolvedSearchParams.max_price
      ? Number(resolvedSearchParams.max_price)
      : undefined,
    bedrooms: resolvedSearchParams.bedrooms
      ? Number(resolvedSearchParams.bedrooms)
      : undefined,
    bathrooms: resolvedSearchParams.bathrooms
      ? Number(resolvedSearchParams.bathrooms)
      : undefined,
    min_area: resolvedSearchParams.min_area
      ? Number(resolvedSearchParams.min_area)
      : undefined,
    max_area: resolvedSearchParams.max_area
      ? Number(resolvedSearchParams.max_area)
      : undefined,
    search: resolvedSearchParams.search as string | undefined,
  };

  // Obtener propiedades de la API
  const supabase = await createClient();

  let query = supabase.from("properties").select(
    `
      *,
      images:property_images(*)
    `
  );

  // Aplicar filtros
  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  } else {
    // Por defecto, mostrar solo propiedades disponibles
    query = query.eq("status", "disponible");
  }

  if (filters.min_price) {
    query = query.gte("price", filters.min_price);
  }

  if (filters.max_price) {
    query = query.lte("price", filters.max_price);
  }

  if (filters.bedrooms) {
    query = query.eq("bedrooms", filters.bedrooms);
  }

  if (filters.bathrooms) {
    query = query.eq("bathrooms", filters.bathrooms);
  }

  if (filters.min_area) {
    query = query.gte("area_size", filters.min_area);
  }

  if (filters.max_area) {
    query = query.lte("area_size", filters.max_area);
  }

  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  // Ejecutar la consulta
  const { data: properties } = await query.order("published_at", {
    ascending: false,
  });

  return (
    <div className="flex flex-col gap-20 items-center mt-20">
      <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
        <div>
          <Link
            href="/"
            className="text-primary hover:underline mb-4 inline-block"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold mb-2">Propiedades</h1>
          <p className="text-muted-foreground">
            Encuentra la propiedad perfecta para ti
          </p>
        </div>

        {/* Aquí se podría agregar un componente de filtros en el futuro */}

        <div>
          <PropertiesGrid properties={properties || []} />
        </div>
      </div>
    </div>
  );
}
