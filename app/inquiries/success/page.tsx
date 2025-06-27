import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InquirySuccessPage() {
  return (
    <div className="flex flex-col gap-20 items-center mt-20">
      <div className="flex-1 flex-col gap-12 max-w-5xl p-5 w-full flex justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              ¡Consulta enviada!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-10 w-10 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <p className="mb-4">
              Tu consulta ha sido enviada correctamente. Te contactaremos a la
              brevedad.
            </p>
            <p className="text-muted-foreground text-sm">
              Gracias por tu interés en nuestras propiedades.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">Volver al inicio</Link>
            </Button>
            <Button asChild>
              <Link href="/properties">Ver más propiedades</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
