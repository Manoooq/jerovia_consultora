import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Jerovia Consultora — Visitas Socioambientales",
  description: "Plataforma digital ejecutiva para la gestión de entrevistas y visitas sociales confidenciales.",
  keywords: ["consultora", "visita social", "entrevista", "informe social", "Paraguay"],
};

const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('jerovia-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark) || (saved === 'system' && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans bg-base text-text antialiased min-h-screen`}>
        {/* Enlace de accesibilidad para lectores de pantalla y teclado (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-gold focus:text-black focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-black"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
