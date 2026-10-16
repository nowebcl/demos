import React from "react";
import type { Metadata } from "next";
import CatalogApp from "@/components/CatalogApp";
import { demoBrandConfig } from "@/data/vehicles";

export const metadata: Metadata = {
  title: "demo. | Catálogo Digital y Venta de Vehículos",
  description:
    "Catálogo demostrativo interactivo para concesionarias y automotoras. Prueba de inventario, tasaciones y financiamiento.",
};

export default function DemoPage() {
  return <CatalogApp initialBrand={demoBrandConfig} />;
}
