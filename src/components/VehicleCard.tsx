"use client";

import React from "react";
import {
  BrandConfig,
  Vehicle,
  formatCLP,
  formatKilometers,
} from "@/data/vehicles";
import { Gauge, Cog, Fuel, ArrowUpRight } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  brand: BrandConfig;
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleCard({
  vehicle,
  brand,
  onSelect,
}: VehicleCardProps) {
  // Estimate 48-month installment with 30% down payment for quick reference
  const loanPrincipal = vehicle.price * 0.7;
  const monthlyRate = 0.0149; // 1.49% monthly referential
  const n = 48;
  const estimatedMonthly =
    (loanPrincipal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));

  const getStatusBadge = (status: Vehicle["status"]) => {
    switch (status) {
      case "Disponible":
        return {
          dotColor: "#16A34A",
          label: "Disponible",
          bg: "bg-white/95 text-[#111111]",
        };
      case "Recién llegado":
        return {
          dotColor: brand.primaryColor,
          label: "Recién llegado",
          bg: "bg-white/95 text-[#111111]",
        };
      case "Reservado":
        return {
          dotColor: "#D97706",
          label: "Reservado",
          bg: "bg-white/95 text-[#6E6E73]",
        };
    }
  };

  const badge = getStatusBadge(vehicle.status);

  return (
    <article
      onClick={() => onSelect(vehicle)}
      className="group rounded-2xl sm:rounded-3xl bg-[#F5F5F7] p-2.5 sm:p-3 hover:bg-neutral-200/70 transition-all duration-200 cursor-pointer flex flex-col justify-between border border-neutral-200/50 hover:border-neutral-300/80 active:scale-[0.98]"
    >
      <div>
        {/* Responsive Image Container (4:3 on mobile for full car visibility, square on desktop) */}
        <div className="aspect-[4/3] sm:aspect-square rounded-xl sm:rounded-2xl overflow-hidden relative bg-white border border-neutral-200/50">
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Top Left: Status Badge with colored dot */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-neutral-200/60 ${badge.bg}`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: badge.dotColor }}
              />
              {badge.label}
            </span>
          </div>

          {/* Top Right: Year Pill */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#111111] backdrop-blur-md border border-neutral-200/60 tabular-nums">
              {vehicle.year}
            </span>
          </div>

          {/* Bottom Left: Category tag */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 text-[#6E6E73] backdrop-blur-md">
              {vehicle.category}
            </span>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="pt-3.5 px-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                {vehicle.brand}
              </p>
              <h3 className="text-lg font-bold tracking-tight text-[#111111] leading-snug">
                {vehicle.model}{" "}
                <span className="font-medium text-[#6E6E73] text-sm">
                  {vehicle.version}
                </span>
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-neutral-200/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-4 h-4 text-[#111111]" />
            </div>
          </div>

          {/* Technical Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAFAFA] border border-neutral-200/60 tabular-nums font-medium">
              <Gauge className="w-3.5 h-3.5 text-[#6E6E73]" />
              {formatKilometers(vehicle.mileage)}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAFAFA] border border-neutral-200/60 font-medium">
              <Cog className="w-3.5 h-3.5 text-[#6E6E73]" />
              {vehicle.specs.transmission}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAFAFA] border border-neutral-200/60 font-medium">
              <Fuel className="w-3.5 h-3.5 text-[#6E6E73]" />
              {vehicle.specs.fuel}
            </span>
          </div>
        </div>
      </div>

      {/* Price & Financing Footer */}
      <div className="mt-4 pt-3 px-1.5 border-t border-neutral-200/70 flex items-end justify-between gap-2">
        <div>
          <span className="block text-[11px] font-medium text-[#6E6E73]">
            Precio contado / financiamiento
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className="text-xl font-bold tracking-tight tabular-nums"
              style={{ color: brand.primaryColor }}
            >
              {formatCLP(vehicle.price)}
            </span>
            {vehicle.previousPrice && (
              <span className="text-xs text-[#6E6E73] line-through tabular-nums">
                {formatCLP(vehicle.previousPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="block text-[10px] font-medium text-[#6E6E73]">
            Cuota ref. (30% pie)
          </span>
          <span className="text-xs font-semibold text-[#111111] tabular-nums">
            {formatCLP(estimatedMonthly)}/mes
          </span>
        </div>
      </div>
    </article>
  );
}
