import React from "react";
import type { Metadata } from "next";
import CatalogApp from "@/components/CatalogApp";
import { losAndesBrandConfig } from "@/data/vehicles";

export const metadata: Metadata = {
  title: "Automotora Los Andes | Catálogo Digital y Venta de Vehículos",
  description:
    "Compra y venta de vehículos seminuevos en Puerto Montt. Opciones al contado y con financiamiento. Regimiento esquina Maratón, Puerto Montt.",
};

export default function LosAndesHyphenPage() {
  return <CatalogApp initialBrand={losAndesBrandConfig} />;
}
