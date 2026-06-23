/**
 * SIDE: Server-side (Server Component)
 * Description: Root layout of the application. Integrates CSS files, sets basic SEO metadata,
 * and wraps all pages with the necessary context providers (auth, i18n) and standard Navbar.
 */

import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "RecipeBook — Recetas con sabor colombiano",
  description: "Descubre, guarda y comparte las mejores recetas colombianas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        <Providers>
          <Navbar />
          {/* Main viewport children render destination */}
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

