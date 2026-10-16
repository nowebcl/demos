import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAP MOTORS | Catálogo de Seminuevos y Financiamiento en Puerto Montt",
  description:
    "Compra, venta y financiamiento automotriz sin burocracia en Luis Ross 445, Puerto Montt. Seminuevos seleccionados con evaluación inmediata.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className="bg-white text-[#111111]">
      <body className={`${inter.className} min-h-screen bg-white text-[#111111] selection:bg-red-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
