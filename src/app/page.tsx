import React from "react";
import type { Metadata } from "next";
import CatalogApp from "@/components/CatalogApp";
import { rapMotorsBrandConfig } from "@/data/vehicles";

export const metadata: Metadata = {
  title: "RAP MOTORS | Catálogo de Seminuevos y Financiamiento en Puerto Montt",
  description:
    "Compra, venta y financiamiento automotriz sin burocracia en Luis Ross 445, Puerto Montt. Seminuevos seleccionados con evaluación inmediata.",
};

export default function HomePage() {
  return <CatalogApp initialBrand={rapMotorsBrandConfig} />;
}
