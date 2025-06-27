import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInquiry } from "./actions";

export default async function NewInquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  // Esperar a que se resuelva searchParams
  const resolvedSearchParams = await searchParams;
  const propertyId = resolvedSearchParams.property;

  // Si no hay ID de propiedad, redirigir a la lista de propiedades
  if (!propertyId) {
    redirect("/properties");
  }

  // Obtener detalles de la propiedad
  const supabase = await createClient();
  const { data: property, error } = await supabase
    .from("properties")
    .select("id, title, address")
    .eq("id", propertyId)
    .single();

  // Si no existe la propiedad, mostrar 404
  if (error || !property) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-20 items-center mt-20">
      <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
        <div className="mb-8">
          <Link
            href={`/properties/${propertyId}`}
            className="text-primary hover:underline mb-4 inline-block"
          >
            ← Volver a la propiedad
          </Link>
          <h1 className="text-3xl font-bold">Consulta sobre propiedad</h1>
          <p className="text-muted-foreground mt-2">
            Completa el formulario para enviar tu consulta sobre esta propiedad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Formulario de consulta</CardTitle>
                <CardDescription>
                  Todos los campos marcados con * son obligatorios
                </CardDescription>
              </CardHeader>
              <form action={createInquiry}>
                <CardContent className="space-y-4">
                  <input type="hidden" name="propertyId" value={propertyId} />
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" name="phone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Escribe tu consulta aquí..."
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Enviar consulta
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la propiedad</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <p className="text-muted-foreground">{property.address}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
