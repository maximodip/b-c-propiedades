"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>Inmobiliaria B&C - Tu portal inmobiliario</p>
      <ThemeSwitcher />
    </footer>
  );
}
