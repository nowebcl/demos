import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Catálogo de Seminuevos y Financiamiento Automotriz",
  description:
    "Compra, venta y financiamiento automotriz sin burocracia. Seminuevos seleccionados con evaluación inmediata.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className="bg-white text-[#111111]">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-[#111111] selection:bg-red-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
