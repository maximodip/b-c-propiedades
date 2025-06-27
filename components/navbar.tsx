"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <div className="hidden md:block w-full max-w-5xl justify-between items-center p-3 px-5 text-sm">
      {/* Main navigation - centered on desktop */}
      <div className="hidden md:flex flex-1 justify-center gap-8 items-center font-medium">
        <Link
          href={"/"}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Inicio
        </Link>
        <Link
          href={"/properties?status=disponible&type=venta"}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          En venta
        </Link>
        <Link
          href={"/properties?status=disponible&type=alquiler"}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          En alquiler
        </Link>
        <Link
          href={"/tasaciones"}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Tasaciones
        </Link>
        <Link
          href={"/nosotros"}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Nosotros
        </Link>
        <Link
          href={"/contacto"}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Contacto
        </Link>
      </div>
    </div>
  );
}
