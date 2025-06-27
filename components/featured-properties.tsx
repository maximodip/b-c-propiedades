"use client";

import { useState, useEffect } from "react";
import { PropertiesGrid } from "@/components/properties-grid";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { PropertyType, PropertyStatus } from "@/lib/types";

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

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("properties")
          .select(
            `
            *,
            images:property_images(*)
          `
          )
          .eq("status", "disponible")
          .order("published_at", { ascending: false })
          .limit(6);

        setProperties(data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Cargando propiedades...</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Propiedades destacadas</h2>
        <Link
          href="/properties"
          className="text-sm font-medium hover:underline"
        >
          Ver todas las propiedades
        </Link>
      </div>
      <PropertiesGrid properties={properties} />
    </section>
  );
}
