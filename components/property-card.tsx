import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PropertyType, PropertyStatus } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  address: string;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms?: number | null;
  bathrooms?: number | null;
  imageUrl?: string;
}

export const PropertyCard = ({
  id,
  title,
  price,
  address,
  type,
  status,
  bedrooms,
  bathrooms,
  imageUrl,
}: PropertyCardProps) => {
  // Formatear el precio como moneda
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);

  // Determinar el color de la insignia de estado
  const statusColors = {
    disponible: "bg-green-500",
    vendida: "bg-red-500",
    alquilada: "bg-blue-500",
    reservada: "bg-amber-500",
  };

  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg group h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Sin imagen</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge
              className={`${
                statusColors[status as keyof typeof statusColors]
              } text-white`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {title}
            </h3>
            <span className="font-bold text-lg">{formattedPrice}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 pb-2">
          <p className="text-sm text-muted-foreground truncate">{address}</p>
          <Badge variant="outline" className="mt-2 capitalize">
            {type}
          </Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-4 mt-auto min-h-[48px]">
          {bedrooms !== null && bedrooms !== undefined ? (
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{bedrooms}</span>
              <span className="text-muted-foreground">Habitaciones</span>
            </div>
          ) : (
            <div className="flex-1" />
          )}
          {bathrooms !== null && bathrooms !== undefined ? (
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{bathrooms}</span>
              <span className="text-muted-foreground">Baños</span>
            </div>
          ) : (
            <div className="flex-1" />
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};
