"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  defaultBrandConfig,
  initialVehicles,
  BrandConfig,
  Vehicle,
  VehicleCategory,
  formatCLP,
} from "@/data/vehicles";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VehicleCard from "@/components/VehicleCard";
import VehicleDetailView from "@/components/VehicleDetailView";
import AdminUploadView from "@/components/AdminUploadView";
import TradeInModal from "@/components/TradeInModal";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  Phone,
  Clock,
  ArrowUpDown,
  X,
  LayoutGrid,
  Car,
  MessageCircle,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";

const CATEGORIES: ("Todos" | VehicleCategory)[] = [
  "Todos",
  "SUV",
  "Camionetas",
  "Sedán",
  "Hatchback",
];

interface CatalogAppProps {
  initialBrand?: BrandConfig;
}

export default function CatalogApp({ initialBrand }: CatalogAppProps) {
  const activeBrandConfig = initialBrand || defaultBrandConfig;
  const [brand, setBrand] = useState<BrandConfig>(activeBrandConfig);
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    initialVehicles.map((v) => ({ ...v, location: activeBrandConfig.address }))
  );
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isUploadViewOpen, setIsUploadViewOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Instant Filter States
  const [selectedCategory, setSelectedCategory] = useState<
    "Todos" | VehicleCategory
  >("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(60000000);
  const [transmissionFilter, setTransmissionFilter] = useState<
    "Todas" | "Automática" | "Manual"
  >("Todas");
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "year-desc"
  >("featured");

  // Modals
  const [isTradeInModalOpen, setIsTradeInModalOpen] = useState<boolean>(false);

  const catalogRef = useRef<HTMLDivElement>(null);

  // Dynamic Price Bounds
  const highestCatalogPrice = useMemo(() => {
    const maxInList = Math.max(...vehicles.map((v) => v.price), 35000000);
    return Math.ceil(maxInList / 1000000) * 1000000;
  }, [vehicles]);

  const lowestCatalogPrice = useMemo(() => {
    const minInList = Math.min(...vehicles.map((v) => v.price), 12000000);
    return Math.floor(minInList / 1000000) * 1000000;
  }, [vehicles]);

  // Filtered and Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = vehicles.filter((v) => {
      const matchesCategory =
        selectedCategory === "Todos" || v.category === selectedCategory;
      const matchesPrice = v.price <= maxPrice;
      const matchesTransmission =
        transmissionFilter === "Todas" ||
        v.specs.transmission === transmissionFilter;
      const matchesSearch =
        !query ||
        v.brand.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.version.toLowerCase().includes(query) ||
        v.year.toString().includes(query) ||
        v.category.toLowerCase().includes(query);

      return (
        matchesCategory &&
        matchesPrice &&
        matchesTransmission &&
        matchesSearch
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "year-desc") return b.year - a.year;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    vehicles,
    selectedCategory,
    maxPrice,
    transmissionFilter,
    searchQuery,
    sortBy,
  ]);

  // Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: vehicles.length };
    for (const cat of CATEGORIES) {
      if (cat !== "Todos") {
        counts[cat] = vehicles.filter((v) => v.category === cat).length;
      }
    }
    return counts;
  }, [vehicles]);

  const handleResetFilters = () => {
    setSelectedCategory("Todos");
    setSearchQuery("");
    setMaxPrice(highestCatalogPrice);
    setTransmissionFilter("Todas");
    setSortBy("featured");
  };

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
    if (newVehicle.price > maxPrice) {
      setMaxPrice(newVehicle.price);
    }
    // Reset filters so the uploaded vehicle is always visible in the catalog
    setSelectedCategory("Todos");
    setSearchQuery("");
    setTransmissionFilter("Todas");
    setIsUploadViewOpen(false);
    setSelectedVehicle(newVehicle);
    setToastMessage(
      `¡${newVehicle.brand} ${newVehicle.model} se subió exitosamente al catálogo demo!`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleUpdateBrandColor = (color: string) => {
    setBrand((prev) => ({ ...prev, primaryColor: color }));
  };

  const contactText =
    brand.contactMessage ||
    `Hola ${brand.name}, estoy viendo su App de catálogo y me gustaría consultar por un vehículo.`;
  const whatsappContactUrl = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(contactText)}`;

  const showroomCityName = brand.city
    ? brand.city.split(",")[0].trim().toUpperCase()
    : brand.name.toUpperCase();

  const formattedPhone =
    brand.phoneFormatted ||
    (brand.whatsapp.length === 11
      ? `+${brand.whatsapp.slice(0, 2)} ${brand.whatsapp.slice(2, 3)} ${brand.whatsapp.slice(3, 7)} ${brand.whatsapp.slice(7)}`
      : `+${brand.whatsapp}`);

  return (
    <div
      className="min-h-screen flex flex-col bg-white text-[#111111]"
      style={
        { "--brand-primary": brand.primaryColor } as React.CSSProperties
      }
    >
      {/* A. Minimalist Sticky Navbar */}
      <Navbar
        brand={brand}
        onResetView={() => {
          setSelectedVehicle(null);
          setIsUploadViewOpen(false);
        }}
        onOpenUpload={() => {
          setSelectedVehicle(null);
          setIsUploadViewOpen(true);
        }}
        onOpenTradeIn={() => setIsTradeInModalOpen(true)}
        totalVehicles={vehicles.length}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-3.5 sm:px-8 pb-24">
        {isUploadViewOpen ? (
          /* Dedicated Full-Page Minimal Vehicle Upload View */
          <AdminUploadView
            brand={brand}
            onBack={() => setIsUploadViewOpen(false)}
            onUpdateBrandColor={handleUpdateBrandColor}
            onAddVehicle={handleAddVehicle}
          />
        ) : selectedVehicle ? (
          /* E. Dedicated Vehicle Detail View */
          <VehicleDetailView
            vehicle={selectedVehicle}
            brand={brand}
            onBack={() => setSelectedVehicle(null)}
            relatedVehicles={vehicles.filter(
              (v) => v.id !== selectedVehicle.id
            )}
            onSelectVehicle={(v) => setSelectedVehicle(v)}
          />
        ) : (
          <>
            {/* B. Artistic Hero Section (Native App Card on Mobile / Editorial Banner on PC) */}
            <Hero
              brand={brand}
              onExploreCatalog={handleScrollToCatalog}
              onOpenTradeIn={() => setIsTradeInModalOpen(true)}
            />

            {/* C. Mobile Sticky Instant Filter Bar (Native App Feel) */}
            <div
              ref={catalogRef}
              className="lg:hidden sticky top-14 sm:top-20 z-30 bg-white/95 backdrop-blur-xl py-2.5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 border-b border-neutral-100 space-y-2"
            >
              {/* Mobile Search Input + Quick Sort */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#6E6E73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar marca, modelo o año..."
                    className="w-full pl-9 pr-8 py-2 rounded-2xl bg-[#F5F5F7] text-xs font-medium text-[#111111] placeholder:text-[#6E6E73] focus:outline-none focus:bg-white border border-neutral-200/80"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#111111]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "featured"
                        | "price-asc"
                        | "price-desc"
                        | "year-desc"
                    )
                  }
                  aria-label="Ordenar vehículos"
                  className="bg-[#F5F5F7] border border-neutral-200/80 rounded-2xl px-3 py-2 text-xs font-semibold text-[#111111] focus:outline-none shrink-0"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Menor $</option>
                  <option value="price-desc">Mayor $</option>
                  <option value="year-desc">Año ↓</option>
                </select>
              </div>

              {/* Horizontal Sliding Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      style={
                        isActive
                          ? {
                              backgroundColor: brand.primaryColor,
                              color: "#FFFFFF",
                            }
                          : undefined
                      }
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? "shadow-2xs"
                          : "bg-[#F5F5F7] text-[#111111] hover:bg-neutral-200/70"
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-white text-[#6E6E73]"
                        }`}
                      >
                        {categoryCounts[category] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop & Mobile Catalog Layout */}
            <section className="pt-4 lg:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* C. Desktop Clean Sidebar Filters (3 cols) */}
              <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-5">
                <div className="rounded-3xl bg-[#F5F5F7] p-6 border border-neutral-200/60 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal
                        className="w-4 h-4"
                        style={{ color: brand.primaryColor }}
                      />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                        Filtros Instantáneos
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#6E6E73] hover:text-[#111111] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Limpiar
                    </button>
                  </div>

                  {/* Instant Text Search */}
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-2">
                      Búsqueda rápida
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-[#6E6E73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Marca, modelo, año..."
                        className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white border border-neutral-200/80 text-xs text-[#111111] placeholder:text-[#6E6E73] focus:outline-none focus:border-neutral-400"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#111111]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter List */}
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-2">
                      Categoría de vehículo
                    </label>
                    <div className="space-y-1.5">
                      {CATEGORIES.map((category) => {
                        const isActive = selectedCategory === category;
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            style={
                              isActive
                                ? {
                                    backgroundColor: brand.primaryColor,
                                    color: "#FFFFFF",
                                  }
                                : undefined
                            }
                            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                              isActive
                                ? "shadow-xs"
                                : "bg-white text-[#111111] hover:bg-neutral-200/60 border border-neutral-200/60"
                            }`}
                          >
                            <span>{category}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] tabular-nums ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-[#F5F5F7] text-[#6E6E73]"
                              }`}
                            >
                              {categoryCounts[category] ?? 0}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic CLP Price Range Slider */}
                  <div className="pt-2 border-t border-neutral-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="desktop-price-slider"
                        className="text-xs font-semibold text-[#111111]"
                      >
                        Precio máximo
                      </label>
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: brand.primaryColor }}
                      >
                        {formatCLP(maxPrice)}
                      </span>
                    </div>

                    <input
                      id="desktop-price-slider"
                      type="range"
                      min={lowestCatalogPrice}
                      max={highestCatalogPrice}
                      step={500000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={
                        {
                          "--brand-primary": brand.primaryColor,
                          accentColor: brand.primaryColor,
                        } as React.CSSProperties
                      }
                      className="w-full brand-slider"
                    />

                    <div className="flex justify-between text-[10px] text-[#6E6E73] tabular-nums mt-1.5">
                      <span>{formatCLP(lowestCatalogPrice)}</span>
                      <span>{formatCLP(highestCatalogPrice)}</span>
                    </div>
                  </div>

                  {/* Transmission Pills */}
                  <div className="pt-2 border-t border-neutral-200/80">
                    <label className="block text-xs font-semibold text-[#111111] mb-2">
                      Transmisión
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["Todas", "Automática", "Manual"] as const).map((t) => {
                        const active = transmissionFilter === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTransmissionFilter(t)}
                            style={
                              active
                                ? {
                                    backgroundColor: brand.primaryColor,
                                    color: "#FFFFFF",
                                  }
                                : undefined
                            }
                            className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                              active
                                ? "shadow-xs"
                                : "bg-white text-[#111111] hover:bg-neutral-200/60 border border-neutral-200/60"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              {/* D. Vehicle Cards Grid (9 cols on Desktop) */}
              <div className="lg:col-span-9 space-y-4 sm:space-y-5">
                {/* Desktop Catalog Header & Sort Control */}
                <div className="hidden lg:flex flex-wrap items-center justify-between gap-3 bg-[#F5F5F7] rounded-2xl px-4 py-3 border border-neutral-200/60">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold tracking-tight text-[#111111]">
                      Stock Disponible
                    </h2>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white tabular-nums"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {filteredVehicles.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#6E6E73]">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Ordenar por:</span>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as
                            | "featured"
                            | "price-asc"
                            | "price-desc"
                            | "year-desc"
                        )
                      }
                      className="bg-white border border-neutral-200/80 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#111111] focus:outline-none"
                    >
                      <option value="featured">Destacados</option>
                      <option value="price-asc">Menor precio</option>
                      <option value="price-desc">Mayor precio</option>
                      <option value="year-desc">Más nuevos primero</option>
                    </select>
                  </div>
                </div>

                {/* Mobile Dynamic Price Slider Bar */}
                <div className="lg:hidden rounded-2xl bg-[#F5F5F7] px-3.5 py-2.5 border border-neutral-200/60 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold text-[#111111] whitespace-nowrap">
                    Precio máx:{" "}
                    <strong
                      className="tabular-nums"
                      style={{ color: brand.primaryColor }}
                    >
                      {formatCLP(maxPrice)}
                    </strong>
                  </span>
                  <input
                    type="range"
                    min={lowestCatalogPrice}
                    max={highestCatalogPrice}
                    step={500000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={
                      {
                        "--brand-primary": brand.primaryColor,
                        accentColor: brand.primaryColor,
                      } as React.CSSProperties
                    }
                    className="w-full brand-slider"
                  />
                </div>

                {/* Cards Grid */}
                {filteredVehicles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                    {filteredVehicles.map((vehicle) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        brand={brand}
                        onSelect={(v) => setSelectedVehicle(v)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl bg-[#F5F5F7] p-10 text-center border border-neutral-200/60 space-y-3">
                    <p className="text-base font-bold text-[#111111]">
                      No encontramos vehículos con esos filtros exactos
                    </p>
                    <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto">
                      Prueba ampliando el rango de precio en CLP o restablece
                      los filtros para ver todo el stock de {brand.name}.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      style={{ backgroundColor: brand.primaryColor }}
                      className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ver todos los vehículos ({vehicles.length})</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Minimal Footer with Dynamic Showroom Card */}
      <footer className="border-t border-neutral-200/80 bg-[#FAFAFA] py-12 pb-32 md:pb-12 mt-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Brand Identity & Highlights */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-[#6E6E73] leading-relaxed max-w-sm">
                {brand.legalName} · Catálogo digital oficial de vehículos seleccionados en {brand.city}.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#6E6E73]">
                <span className="px-3 py-1 rounded-full bg-white border border-neutral-200/80">
                  Financiamiento Inmediato
                </span>
                <span className="px-3 py-1 rounded-full bg-white border border-neutral-200/80">
                  Recepción en Parte de Pago
                </span>
                {brand.instagram && (
                  <a
                    href={`https://instagram.com/${brand.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full bg-white border border-neutral-200/80 hover:text-[#111111] transition-colors"
                  >
                    Instagram: {brand.instagram}
                  </a>
                )}
              </div>
            </div>

            {/* Right: Showroom Card */}
            <div className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-7 border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111] uppercase tracking-wider">
                <MapPin
                  className="w-4 h-4 shrink-0"
                  style={{ color: brand.primaryColor }}
                />
                <span>SHOWROOM {showroomCityName}</span>
              </div>

              <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                Visítanos en{" "}
                <strong className="text-[#111111]">{brand.address}</strong>.
                Todos nuestros vehículos cuentan con revisión técnica, informe
                Autofact al día y financiamiento inmediato.
              </p>

              <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-[#6E6E73]">
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                  <span>{brand.schedule}</span>
                </p>
                <a
                  href={whatsappContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-[#111111] hover:underline tabular-nums"
                >
                  <Phone
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: brand.primaryColor }}
                  />
                  <span>{formattedPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* F1. Native iOS Bottom Navigation Bar on Mobile (< md) */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-neutral-200/80 px-2 py-1.5 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] grid grid-cols-3 gap-1 shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            setSelectedVehicle(null);
            setIsUploadViewOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center justify-center py-1 rounded-xl active:scale-95 transition-transform cursor-pointer"
        >
          <LayoutGrid
            className="w-4 h-4"
            style={{
              color:
                !selectedVehicle && !isUploadViewOpen
                  ? brand.primaryColor
                  : "#6E6E73",
            }}
          />
          <span
            className="text-[10px] font-bold mt-0.5"
            style={{
              color:
                !selectedVehicle && !isUploadViewOpen
                  ? brand.primaryColor
                  : "#6E6E73",
            }}
          >
            Catálogo
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsTradeInModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[#6E6E73] hover:text-[#111111] active:scale-95 transition-transform cursor-pointer"
        >
          <Car className="w-4 h-4 text-[#6E6E73]" />
          <span className="text-[10px] font-semibold mt-0.5 text-[#6E6E73]">
            Parte Pago
          </span>
        </button>

        <a
          href={whatsappContactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 rounded-xl active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 text-green-600" />
          <span className="text-[10px] font-semibold mt-0.5 text-[#6E6E73]">
            WhatsApp
          </span>
        </a>
      </nav>

      {/* Floating Action Button on the Left: "Subir vehiculo , demo" */}
      {!isUploadViewOpen && (
        <button
          type="button"
          onClick={() => {
            setSelectedVehicle(null);
            setIsUploadViewOpen(true);
          }}
          className="fixed left-3 sm:left-6 bottom-20 md:bottom-8 z-40 group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#111111] hover:bg-neutral-900 text-white shadow-[0_10px_35px_rgba(0,0,0,0.3)] border border-neutral-700/80 hover:border-neutral-500 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer backdrop-blur-md"
          aria-label="Subir vehiculo , demo"
          title="Subir vehículo de prueba al catálogo"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: brand.primaryColor }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: brand.primaryColor }}
            />
          </span>
          <PlusCircle className="w-4 h-4 text-white shrink-0" />
          <span className="font-bold">Subir vehiculo , demo</span>
        </button>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <aside
          aria-live="polite"
          className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#111111] text-white shadow-xl border border-neutral-700 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </aside>
      )}

      {/* Trade-In ("Vender mi auto / Parte de pago") Modal */}
      <TradeInModal
        isOpen={isTradeInModalOpen}
        onClose={() => setIsTradeInModalOpen(false)}
        brand={brand}
      />
    </div>
  );
}
