import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Revalidar página cada 5 minutos
export const revalidate = 300;

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Esperar a que se resuelva params
  const { id } = await params;
  const supabase = await createClient();

  // Obtener la propiedad con sus imágenes
  const { data: property, error } = await supabase
    .from("properties")
    .select(
      `
      *,
      images:property_images(*)
    `
    )
    .eq("id", id)
    .single();

  // Si no existe la propiedad, mostrar 404
  if (error || !property) {
    notFound();
  }

  // Determinar el color de la insignia de estado
  const statusColors = {
    disponible: "bg-green-500",
    vendida: "bg-red-500",
    alquilada: "bg-blue-500",
    reservada: "bg-amber-500",
  };

  // Formatear el precio como moneda
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(property.price);

  // Ordenar imágenes (principal primero)
  const sortedImages = [...(property.images || [])].sort((a, b) => {
    if (a.is_main && !b.is_main) return -1;
    if (!a.is_main && b.is_main) return 1;
    return 0;
  });

  // Imagen principal o la primera disponible
  const mainImage = sortedImages[0]?.url;

  return (
    <div className="flex flex-col gap-20 items-center mt-20">
      <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
        <div className="mb-8">
          <Link
            href="/properties"
            className="text-primary hover:underline mb-4 inline-block"
          >
            ← Volver a propiedades
          </Link>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <div className="text-right">
              <div className="text-2xl font-bold">{formattedPrice}</div>
              <Badge
                className={`${
                  statusColors[property.status as keyof typeof statusColors]
                } text-white mt-2`}
              >
                {property.status.charAt(0).toUpperCase() +
                  property.status.slice(1)}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">{property.address}</p>
        </div>

        {/* Galería de imágenes */}
        <div className="mb-8">
          {mainImage ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={mainImage}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Sin imagen</span>
            </div>
          )}

          {sortedImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {sortedImages.slice(0, 4).map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-video overflow-hidden rounded-lg"
                >
                  <Image
                    src={image.url}
                    alt={`${property.title} - Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 20vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Características principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 border rounded-lg">
            <div className="text-muted-foreground text-sm">Tipo</div>
            <div className="font-medium capitalize">{property.type}</div>
          </div>
          {property.bedrooms !== null && property.bedrooms !== undefined && (
            <div className="p-4 border rounded-lg">
              <div className="text-muted-foreground text-sm">Habitaciones</div>
              <div className="font-medium">{property.bedrooms}</div>
            </div>
          )}
          {property.bathrooms !== null && property.bathrooms !== undefined && (
            <div className="p-4 border rounded-lg">
              <div className="text-muted-foreground text-sm">Baños</div>
              <div className="font-medium">{property.bathrooms}</div>
            </div>
          )}
          {property.area_size !== null && property.area_size !== undefined && (
            <div className="p-4 border rounded-lg">
              <div className="text-muted-foreground text-sm">Superficie</div>
              <div className="font-medium">{property.area_size} m²</div>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Descripción</h2>
          <div className="prose max-w-none">
            {property.description
              .split("\n")
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contactar</h2>
          <p className="mb-4">
            ¿Interesado en esta propiedad? Contacta directamente con el
            vendedor:
          </p>
          <div className="mb-4">
            <div className="font-medium">Email:</div>
            <div className="text-primary">{property.contact_email}</div>
          </div>
          {property.contact_phone && (
            <div className="mb-6">
              <div className="font-medium">Teléfono:</div>
              <div>{property.contact_phone}</div>
            </div>
          )}
          <Link href={`/inquiries/new?property=${property.id}`} passHref>
            <Button className="w-full sm:w-auto">Enviar consulta</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
