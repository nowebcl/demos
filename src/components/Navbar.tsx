"use client";

import React from "react";
import { BrandConfig } from "@/data/vehicles";
import { MessageCircle, PlusCircle } from "lucide-react";

interface NavbarProps {
  brand: BrandConfig;
  onResetView: () => void;
  onOpenTradeIn?: () => void;
  onOpenUpload?: () => void;
  totalVehicles: number;
}

export default function Navbar({
  brand,
  onResetView,
  onOpenUpload,
}: NavbarProps) {
  const contactText =
    brand.contactMessage ||
    `Hola ${brand.name}, estoy visitando su catálogo web y me gustaría recibir asesoría.`;
  const whatsappContactUrl = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(contactText)}`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b border-neutral-100/80 transition-all">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 sm:h-24 md:h-28 flex items-center justify-between gap-4">
        {/* Left: Official Horizontal Brand Logo + "Subir vehiculo , demo" button */}
        <div className="flex items-center gap-3 sm:gap-4 ml-2 sm:ml-6 md:ml-10 lg:ml-14">
          <button
            type="button"
            onClick={onResetView}
            className="flex items-center text-left group focus:outline-none cursor-pointer"
          >
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="h-11 sm:h-16 md:h-[77px] lg:h-[84px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </button>

          {onOpenUpload && (
            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs font-semibold bg-[#111111] hover:bg-neutral-800 text-white transition-all shadow-xs cursor-pointer active:scale-95 border border-neutral-700/60"
              title="Abrir panel para subir vehículo demo"
            >
              <PlusCircle className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Subir vehiculo , demo</span>
            </button>
          )}
        </div>

        {/* Right: Contacto WhatsApp button */}
        <div className="flex items-center">
          <a
            href={whatsappContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: brand.primaryColor }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-all shadow-xs active:scale-[0.98]"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span>Contacto</span>
          </a>
        </div>
      </div>
    </header>
  );
}
