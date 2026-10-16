import React from "react";
import type { Metadata } from "next";
import CatalogApp from "@/components/CatalogApp";
import { mcrCarsBrandConfig } from "@/data/vehicles";

export const metadata: Metadata = {
  title: "MCR CARS | Importación y Venta de Vehículos en Punta Arenas",
  description:
    "Compra tu vehículo en MCR Cars. Financiamiento, importación y venta de vehículos seleccionados en Rómulo Correa 0945 casa 27, Punta Arenas.",
};

export default function McrCarsHyphenPage() {
  return <CatalogApp initialBrand={mcrCarsBrandConfig} />;
}
