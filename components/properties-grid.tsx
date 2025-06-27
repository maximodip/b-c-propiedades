import { PropertyCard } from "./property-card";
import { PropertyStatus, PropertyType } from "@/lib/types";

interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms?: number | null;
  bathrooms?: number | null;
  images?: { url: string; is_main: boolean }[];
}

interface PropertiesGridProps {
  properties: Property[];
}

export const PropertiesGrid = ({ properties }: PropertiesGridProps) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No hay propiedades disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => {
        // Encontrar la imagen principal o la primera disponible
        const mainImage =
          property.images?.find((img) => img.is_main) || property.images?.[0];

        return (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            price={property.price}
            address={property.address}
            type={property.type}
            status={property.status}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            imageUrl={mainImage?.url}
          />
        );
      })}
    </div>
  );
};
