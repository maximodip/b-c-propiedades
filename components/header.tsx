"use client";

import { Navbar } from "@/components/navbar";
import { Phone, Clock, MapPin, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only show the menu after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full flex flex-col items-center border-b border-b-foreground/10">
      {/* Top header with logo, contact info, address and open time */}
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl flex items-center">
          <span className="text-primary">Inmobiliaria</span>
          <span className="ml-1">B&C</span>
        </Link>

        {/* Contact information - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          {/* Phone */}
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Phone size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Llámanos</p>
              <p className="font-medium">+54 11 5555-5555</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Dirección</p>
              <p className="font-medium">Av. Corrientes 1234, CABA</p>
            </div>
          </div>

          {/* Open time */}
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Clock size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Horario</p>
              <p className="font-medium">Lun-Vie: 9:00-18:00</p>
            </div>
          </div>
        </div>

        {/* Mobile menu button - only visible on mobile */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Navbar below */}
      <div className="w-full bg-primary/5 flex justify-center">
        <Navbar />
      </div>

      {/* Mobile menu - only shown after client-side hydration */}
      {mounted && isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] z-50 p-4">
          <div className="flex flex-col space-y-4">
            <Link
              href={"/"}
              className="text-foreground hover:text-primary py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href={"/properties?status=disponible&type=venta"}
              className="text-foreground hover:text-primary py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              En venta
            </Link>
            <Link
              href={"/properties?status=disponible&type=alquiler"}
              className="text-foreground hover:text-primary py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              En alquiler
            </Link>
            <Link
              href={"/tasaciones"}
              className="text-foreground hover:text-primary py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Tasaciones
            </Link>
            <Link
              href={"/nosotros"}
              className="text-foreground hover:text-primary py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href={"/contacto"}
              className="text-foreground hover:text-primary py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
