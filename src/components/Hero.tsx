"use client";

import React from "react";
import { BrandConfig } from "@/data/vehicles";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  brand: BrandConfig;
  onExploreCatalog: () => void;
  onOpenTradeIn?: () => void;
}

export default function Hero({
  brand,
  onExploreCatalog,
}: HeroProps) {
  return (
    <section className="pt-2 sm:pt-4 pb-3 sm:pb-6">
      {/* =========================================================
          VERSIÓN MÓVIL (APP NATIVA iOS / ANDROID)
          Usa la fotografía vertical 9:16 'hero-mobile.jpg'
          Texto limpio en el cielo arriba, auto 100% visible abajo
         ========================================================= */}
      <div className="md:hidden relative rounded-[26px] overflow-hidden h-[490px] border border-neutral-200/60 shadow-xs flex flex-col justify-between">
        {/* Background Vertical Image */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src="/images/hero-mobile.jpg"
            alt={`Catálogo - ${brand.name}`}
            fetchPriority="high"
            className="w-full h-full object-cover object-bottom"
          />
          {/* Subtle soft gradient over sky to guarantee crisp text legibility */}
          <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/95 via-white/80 to-transparent pointer-events-none" />
        </div>

        {/* Top App Copy in the open sky */}
        <div className="relative z-10 p-5 pt-7">
          <h1 className="text-[26px] font-black tracking-tight text-[#111111] leading-[1.08]">
            El estándar moderno
            <br />
            para cambiar tu auto.
          </h1>

          <p className="mt-2 text-xs text-[#555555] font-medium leading-relaxed max-w-[270px]">
            Inspección mecánica experta, historial verificado y un proceso de compra simple y seguro.
          </p>

          <div className="mt-4">
            <button
              type="button"
              onClick={onExploreCatalog}
              style={{ backgroundColor: brand.primaryColor }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white hover:opacity-90 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span>Explorar catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Space at the bottom keeps the car 100% clear and unobstructed */}
        <div className="relative z-10 pb-4 px-4 pointer-events-none" />
      </div>

      {/* =========================================================
          VERSIÓN ESCRITORIO (>= md)
          Usa la fotografía horizontal 16:9 'hero-desktop.jpg'
          Texto a la izquierda, auto visible a la derecha
         ========================================================= */}
      <div className="hidden md:flex relative rounded-[32px] sm:rounded-[36px] overflow-hidden min-h-[500px] lg:min-h-[560px] items-center border border-neutral-200/50">
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src="/images/hero-desktop.jpg"
            alt={`Catálogo - ${brand.name}`}
            fetchPriority="high"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
        </div>

        <div className="relative z-10 p-10 lg:p-16 max-w-xl lg:max-w-2xl">
          <h1 className="text-4xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#111111] leading-[1.08]">
            El estándar moderno
            <br />
            para cambiar tu auto.
          </h1>

          <p className="mt-5 text-base lg:text-lg text-[#555555] font-normal leading-relaxed max-w-md">
            Inspección mecánica experta, historial verificado
            <br className="hidden sm:inline" /> y un proceso de compra simple y seguro.
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={onExploreCatalog}
              style={{ backgroundColor: brand.primaryColor }}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <span>Explorar catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
