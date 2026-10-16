"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BrandConfig,
  Vehicle,
  VehicleCategory,
  VehicleStatus,
  formatCLP,
  formatKilometers,
} from "@/data/vehicles";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Check,
  Gauge,
  Cog,
  Fuel,
  Plus,
  Image as ImageIcon,
  Wand2,
  RotateCcw,
} from "lucide-react";

interface AdminUploadViewProps {
  brand: BrandConfig;
  onBack: () => void;
  onUpdateBrandColor: (color: string) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
}

interface PresetVehicle {
  label: string;
  plate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  mileage: number;
  category: VehicleCategory;
  status: VehicleStatus;
  transmission: "Automática" | "Manual";
  fuel: "Bencina" | "Diésel" | "Híbrido";
  engine: string;
  drivetrain: string;
  color: string;
  image: string;
  description: string;
}

const QUICK_PRESETS: PresetVehicle[] = [
  {
    label: "Audi Q3 Sportback",
    plate: "SJKW-42",
    brand: "Audi",
    model: "Q3 Sportback",
    version: "35 TFSI S line S tronic",
    year: 2023,
    price: 29890000,
    mileage: 17500,
    category: "SUV",
    status: "Recién llegado",
    transmission: "Automática",
    fuel: "Bencina",
    engine: "1.4L TFSI Turbo (150 HP)",
    drivetrain: "Delantera S tronic",
    color: "Gris Daytona",
    image:
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85",
    description:
      "Audi Q3 Sportback S line en estado inmaculado. Único dueño, mantenciones al día, paquete deportivo interior y Virtual Cockpit.",
  },
  {
    label: "Porsche Macan",
    plate: "TRWP-88",
    brand: "Porsche",
    model: "Macan",
    version: "2.0T PDK AWD",
    year: 2023,
    price: 54900000,
    mileage: 14500,
    category: "SUV",
    status: "Disponible",
    transmission: "Automática",
    fuel: "Bencina",
    engine: "2.0L Turbo (265 HP)",
    drivetrain: "AWD Porsche Traction",
    color: "Gris Crayón",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
    description:
      "Porsche Macan 2.0 Turbo PDK en estado de colección. Historial certificado sin siniestros, paquete Sport Chrono y techo panorámico.",
  },
  {
    label: "Silverado Z71",
    plate: "PLKX-91",
    brand: "Chevrolet",
    model: "Silverado",
    version: "5.3 V8 Z71 Trail Boss 4x4",
    year: 2023,
    price: 41990000,
    mileage: 22100,
    category: "Camionetas",
    status: "Disponible",
    transmission: "Automática",
    fuel: "Bencina",
    engine: "5.3L V8 EcoTec3 (355 HP)",
    drivetrain: "4x4 Autotrac c/ Reductora",
    color: "Blanco Cumbre",
    image:
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=85",
    description:
      "Chevrolet Silverado Z71 Trail Boss V8. Suspensión Off-Road Rancho de fábrica, pantalla de 13.4 pulgadas y único dueño.",
  },
  {
    label: "BMW 320i M Sport",
    plate: "KRTB-19",
    brand: "BMW",
    model: "320i",
    version: "2.0 TwinPower Turbo M Sport",
    year: 2024,
    price: 36490000,
    mileage: 8900,
    category: "Sedán",
    status: "Recién llegado",
    transmission: "Automática",
    fuel: "Bencina",
    engine: "2.0L TwinPower Turbo (184 HP)",
    drivetrain: "Trasera Steptronic 8 vel.",
    color: "Negro Zafiro",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
    description:
      "BMW 320i paquete M Sport con BMW Curved Display, techo eléctrico y garantía vigente de marca.",
  },
];

const SAMPLE_PHOTOS = [
  {
    label: "Deportivo / SUV",
    url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Coupé / Porsche",
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Pickup 4x4",
    url: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Sedán Ejecutivo",
    url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
  },
];

const CATEGORIES: VehicleCategory[] = [
  "SUV",
  "Camionetas",
  "Sedán",
  "Hatchback",
];

const STATUS_OPTIONS: VehicleStatus[] = [
  "Disponible",
  "Recién llegado",
  "Reservado",
];

export default function AdminUploadView({
  brand,
  onBack,
  onUpdateBrandColor,
  onAddVehicle,
}: AdminUploadViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activePresetIdx, setActivePresetIdx] = useState<number>(0);
  const [plate, setPlate] = useState(QUICK_PRESETS[0].plate);
  const [carBrand, setCarBrand] = useState(QUICK_PRESETS[0].brand);
  const [carModel, setCarModel] = useState(QUICK_PRESETS[0].model);
  const [carVersion, setCarVersion] = useState(QUICK_PRESETS[0].version);
  const [carYear, setCarYear] = useState(QUICK_PRESETS[0].year);
  const [carPrice, setCarPrice] = useState(QUICK_PRESETS[0].price);
  const [carMileage, setCarMileage] = useState(QUICK_PRESETS[0].mileage);
  const [carCategory, setCarCategory] = useState<VehicleCategory>(
    QUICK_PRESETS[0].category
  );
  const [carStatus, setCarStatus] = useState<VehicleStatus>(
    QUICK_PRESETS[0].status
  );
  const [carTransmission, setCarTransmission] = useState<
    "Automática" | "Manual"
  >(QUICK_PRESETS[0].transmission);
  const [carFuel, setCarFuel] = useState<"Bencina" | "Diésel" | "Híbrido">(
    QUICK_PRESETS[0].fuel
  );
  const [carImage, setCarImage] = useState(QUICK_PRESETS[0].image);
  const [carDescription, setCarDescription] = useState(
    QUICK_PRESETS[0].description
  );
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const applyPreset = (index: number) => {
    const preset = QUICK_PRESETS[index];
    setActivePresetIdx(index);
    setPlate(preset.plate);
    setCarBrand(preset.brand);
    setCarModel(preset.model);
    setCarVersion(preset.version);
    setCarYear(preset.year);
    setCarPrice(preset.price);
    setCarMileage(preset.mileage);
    setCarCategory(preset.category);
    setCarStatus(preset.status);
    setCarTransmission(preset.transmission);
    setCarFuel(preset.fuel);
    setCarImage(preset.image);
    setCarDescription(preset.description);
  };

  const handleClearForCustom = () => {
    setActivePresetIdx(-1);
    setPlate("");
    setCarBrand("");
    setCarModel("");
    setCarVersion("");
    setCarYear(2024);
    setCarPrice(22900000);
    setCarMileage(15000);
    setCarCategory("SUV");
    setCarStatus("Disponible");
    setCarTransmission("Automática");
    setCarFuel("Bencina");
    setCarDescription("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCarImage(objectUrl);
  };

  const handleAutoGenerateDescription = () => {
    const b = carBrand.trim() || "Vehículo";
    const m = carModel.trim() || "";
    const v = carVersion.trim() ? ` ${carVersion.trim()}` : "";
    setCarDescription(
      `${b} ${m}${v} año ${carYear} con ${formatKilometers(
        Number(carMileage) || 0
      )}. Unidad revisada y certificada en ${
        brand.name
      }, disponible con financiamiento inmediato y recepción de vehículo en parte de pago.`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBrand = carBrand.trim() || "Vehículo";
    const cleanModel = carModel.trim() || "Demo";
    const cleanPlate = plate.trim().toUpperCase() || "DEMO-01";

    const newVehicle: Vehicle = {
      id: `${cleanBrand.toLowerCase()}-${cleanModel
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}`,
      brand: cleanBrand,
      model: cleanModel,
      version: carVersion.trim() || "Full Equipo",
      year: Number(carYear) || 2024,
      price: Number(carPrice) || 19900000,
      mileage: Number(carMileage) || 0,
      category: carCategory,
      status: carStatus,
      location: brand.address,
      featured: true,
      images: [
        carImage || SAMPLE_PHOTOS[0].url,
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
      ],
      highlights: [
        `Patente verificada (${cleanPlate})`,
        "Inspección mecánica de 120 puntos aprobada",
        "Financiamiento disponible desde 20% de pie",
        "Documentación al día lista para transferencia",
      ],
      description:
        carDescription.trim() ||
        `${cleanBrand} ${cleanModel} ${carYear} en excelente estado, disponible para entrega inmediata en ${brand.address}.`,
      specs: {
        engine:
          activePresetIdx >= 0
            ? QUICK_PRESETS[activePresetIdx].engine
            : "Motor certificado",
        fuel: carFuel,
        transmission: carTransmission,
        drivetrain:
          activePresetIdx >= 0
            ? QUICK_PRESETS[activePresetIdx].drivetrain
            : "Tracción electrónica",
        color:
          activePresetIdx >= 0
            ? QUICK_PRESETS[activePresetIdx].color
            : "Gris / Blanco",
        owners: 1,
        doors: 5,
        consumption: "12.5 km/l mixto",
        airbags: 6,
        plateLastDigit: cleanPlate.slice(-1) || "0",
      },
    };

    onAddVehicle(newVehicle);
  };

  // Monthly estimate for live preview card
  const loanPrincipal = (Number(carPrice) || 0) * 0.7;
  const monthlyRate = 0.0149;
  const estimatedMonthly =
    loanPrincipal > 0
      ? (loanPrincipal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -48))
      : 0;

  return (
    <div className="py-6 sm:py-10 animate-in fade-in duration-200">
      {/* Top Minimal Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 text-xs sm:text-sm font-semibold text-[#111111] transition-all cursor-pointer active:scale-[0.99]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F5F5F7] text-xs font-medium text-[#6E6E73] border border-neutral-200/60">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: brand.primaryColor }}
            />
            Modo prueba · Publicación inmediata
          </span>
        </div>
      </div>

      {/* Minimal Page Header & 1-Click Presets */}
      <div className="mb-8 space-y-5">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6E6E73]">
            ADMINISTRACIÓN SIMPLE · {brand.name}
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111111] mt-1">
            Subir vehículo demo
          </h1>
          <p className="text-sm sm:text-base text-[#6E6E73] mt-1.5 leading-relaxed">
            Prueba qué tan fácil es agregar una unidad al catálogo. Elige un
            ejemplo rápido con un clic o escribe los datos a tu gusto.
          </p>
        </div>

        {/* 1-Click Preset Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#6E6E73] mr-1 flex items-center gap-1.5">
            <Sparkles
              className="w-3.5 h-3.5"
              style={{ color: brand.primaryColor }}
            />
            Cargar ejemplo:
          </span>

          {QUICK_PRESETS.map((preset, idx) => {
            const isActive = activePresetIdx === idx;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(idx)}
                style={
                  isActive
                    ? {
                        backgroundColor: brand.primaryColor,
                        color: "#FFFFFF",
                      }
                    : undefined
                }
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "shadow-2xs"
                    : "bg-[#F5F5F7] text-[#111111] hover:bg-neutral-200/80 border border-neutral-200/60"
                }`}
              >
                {preset.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleClearForCustom}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              activePresetIdx === -1
                ? "bg-[#111111] text-white"
                : "bg-white text-[#6E6E73] hover:text-[#111111] border border-neutral-200"
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Desde cero</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* LEFT COLUMN (7 cols): Minimal Step-by-Step Sections */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Photo Section */}
          <section className="rounded-3xl bg-[#F5F5F7] p-6 sm:p-8 border border-neutral-200/60 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#111111]">
                  1. Fotografía del vehículo
                </h2>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Sube una foto desde tu dispositivo o selecciona una imagen de
                  muestra
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUrlInput((prev) => !prev)}
                className="text-xs font-semibold text-[#6E6E73] hover:text-[#111111] underline underline-offset-4 cursor-pointer"
              >
                {showUrlInput ? "Ocultar enlace URL" : "Pegar URL de foto"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Upload from device button */}
              <div className="sm:col-span-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 px-4 rounded-2xl bg-white hover:bg-neutral-50 border border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#111111]">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#111111] block">
                      Subir foto propia
                    </span>
                    <span className="text-[11px] text-[#6E6E73]">
                      JPG, PNG o WebP
                    </span>
                  </div>
                </button>
              </div>

              {/* Quick sample photo selector */}
              <div className="sm:col-span-7 space-y-2">
                <span className="block text-[11px] font-semibold text-[#6E6E73]">
                  O elige una foto de prueba:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_PHOTOS.map((sample) => {
                    const selected = carImage === sample.url;
                    return (
                      <button
                        key={sample.url}
                        type="button"
                        onClick={() => setCarImage(sample.url)}
                        className={`group relative aspect-square rounded-2xl overflow-hidden bg-white border-2 transition-all cursor-pointer ${
                          selected
                            ? "scale-[0.98]"
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                        style={
                          selected
                            ? { borderColor: brand.primaryColor }
                            : undefined
                        }
                        title={sample.label}
                      >
                        <img
                          src={sample.url}
                          alt={sample.label}
                          className="w-full h-full object-cover"
                        />
                        {selected && (
                          <span
                            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
                            style={{ backgroundColor: brand.primaryColor }}
                          >
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {showUrlInput && (
              <div className="pt-2">
                <label
                  htmlFor="vehicle-image-url"
                  className="block text-xs font-semibold text-[#6E6E73] mb-1.5"
                >
                  Enlace directo de imagen (URL)
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-[#6E6E73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="vehicle-image-url"
                    type="text"
                    value={carImage}
                    onChange={(e) => setCarImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-neutral-200/90 text-xs text-[#111111] focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>
            )}
          </section>

          {/* 2. Basic Vehicle Data */}
          <section className="rounded-3xl bg-[#F5F5F7] p-6 sm:p-8 border border-neutral-200/60 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#111111]">
                2. Datos principales
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Marca, modelo, año y valor comercial en pesos chilenos
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="upload-brand"
                  className="block text-xs font-semibold text-[#6E6E73] mb-1.5"
                >
                  Marca
                </label>
                <input
                  id="upload-brand"
                  type="text"
                  required
                  value={carBrand}
                  onChange={(e) => setCarBrand(e.target.value)}
                  placeholder="Ej: Toyota, Audi, Chevrolet..."
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-neutral-200/90 text-sm font-semibold text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label
                  htmlFor="upload-model"
                  className="block text-xs font-semibold text-[#6E6E73] mb-1.5"
                >
                  Modelo
                </label>
                <input
                  id="upload-model"
                  type="text"
                  required
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="Ej: RAV4, Q3 Sportback..."
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-neutral-200/90 text-sm font-semibold text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="upload-version"
                  className="block text-xs font-semibold text-[#6E6E73] mb-1.5"
                >
                  Versión (opcional)
                </label>
                <input
                  id="upload-version"
                  type="text"
                  value={carVersion}
                  onChange={(e) => setCarVersion(e.target.value)}
                  placeholder="Ej: 2.0 XLE AWD Automático"
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-neutral-200/90 text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label
                  htmlFor="upload-plate"
                  className="block text-xs font-semibold text-[#6E6E73] mb-1.5"
                >
                  Patente (opcional)
                </label>
                <input
                  id="upload-plate"
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="SJKW-42"
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-neutral-200/90 text-sm font-bold text-[#111111] uppercase tracking-wider placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="upload-price"
                  className="block text-xs font-semibold text-[#6E6E73] mb-1.5"
                >
                  Precio CLP ({formatCLP(Number(carPrice) || 0)})
                </label>
                <input
                  id="upload-price"
                  type="number"
                  min={100000}
                  step="any"
                  value={carPrice || ""}
                  onChange={(e) => setCarPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-neutral-200/90 text-sm font-bold text-[#111111] tabular-nums focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label
                  htmlFor="upload-mileage"
                  className="block text-xs font-semibold text-[#6E6E73] mb-1.5"
                >
                  Kilometraje (km)
                </label>
                <input
                  id="upload-mileage"
                  type="number"
                  min={0}
                  step="any"
                  value={carMileage ?? ""}
                  onChange={(e) => setCarMileage(Number(e.target.value))}
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-neutral-200/90 text-sm font-semibold text-[#111111] tabular-nums focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label
                  htmlFor="upload-year"
                  className="block text-xs font-semibold text-[#6E6E73] mb-1.5"
                >
                  Año
                </label>
                <input
                  id="upload-year"
                  type="number"
                  min={1990}
                  max={2030}
                  step={1}
                  value={carYear || ""}
                  onChange={(e) => setCarYear(Number(e.target.value))}
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-neutral-200/90 text-sm font-semibold text-[#111111] tabular-nums focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            {/* Category Selector Pills */}
            <div>
              <span className="block text-xs font-semibold text-[#6E6E73] mb-2">
                Categoría
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const active = carCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCarCategory(cat)}
                      style={
                        active
                          ? {
                              backgroundColor: brand.primaryColor,
                              color: "#FFFFFF",
                            }
                          : undefined
                      }
                      className={`py-2.5 px-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                        active
                          ? "shadow-2xs"
                          : "bg-white text-[#111111] hover:bg-neutral-200/60 border border-neutral-200/80"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. Quick Specs & Description */}
          <section className="rounded-3xl bg-[#F5F5F7] p-6 sm:p-8 border border-neutral-200/60 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#111111]">
                3. Detalles rápidos
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Selecciona transmisión, combustible y una breve reseña
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Transmission */}
              <div>
                <span className="block text-xs font-semibold text-[#6E6E73] mb-2">
                  Transmisión
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["Automática", "Manual"] as const).map((t) => {
                    const active = carTransmission === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCarTransmission(t)}
                        style={
                          active
                            ? {
                                backgroundColor: brand.primaryColor,
                                color: "#FFFFFF",
                              }
                            : undefined
                        }
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? "shadow-2xs"
                            : "bg-white text-[#111111] hover:bg-neutral-200/60 border border-neutral-200/80"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fuel */}
              <div>
                <span className="block text-xs font-semibold text-[#6E6E73] mb-2">
                  Combustible
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Bencina", "Diésel", "Híbrido"] as const).map((f) => {
                    const active = carFuel === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setCarFuel(f)}
                        style={
                          active
                            ? {
                                backgroundColor: brand.primaryColor,
                                color: "#FFFFFF",
                              }
                            : undefined
                        }
                        className={`py-2.5 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? "shadow-2xs"
                            : "bg-white text-[#111111] hover:bg-neutral-200/60 border border-neutral-200/80"
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <span className="block text-xs font-semibold text-[#6E6E73] mb-2">
                  Etiqueta
                </span>
                <select
                  value={carStatus}
                  onChange={(e) =>
                    setCarStatus(e.target.value as VehicleStatus)
                  }
                  aria-label="Etiqueta de estado"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-200/90 text-xs font-semibold text-[#111111] focus:outline-none"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description with 1-click auto-write */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label
                  htmlFor="upload-description"
                  className="text-xs font-semibold text-[#6E6E73]"
                >
                  Reseña del vehículo
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateDescription}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] hover:opacity-75 transition-opacity cursor-pointer"
                >
                  <Wand2
                    className="w-3.5 h-3.5"
                    style={{ color: brand.primaryColor }}
                  />
                  <span>Redactar automático</span>
                </button>
              </div>
              <textarea
                id="upload-description"
                rows={3}
                value={carDescription}
                onChange={(e) => setCarDescription(e.target.value)}
                placeholder="Describe brevemente el estado y equipamiento del vehículo..."
                className="w-full px-3.5 py-3 rounded-2xl bg-white border border-neutral-200/90 text-xs sm:text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (5 cols): Sticky Live Preview & Publish CTA */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="rounded-3xl bg-[#F5F5F7] p-5 sm:p-6 border border-neutral-200/80 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E6E73]">
                Vista previa en vivo
              </span>
              <span className="text-[11px] font-medium text-[#6E6E73]">
                Así se verá en el catálogo
              </span>
            </div>

            {/* Live Card Preview */}
            <div className="rounded-3xl bg-white p-3 border border-neutral-200/80 shadow-2xs">
              <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F5F5F7] border border-neutral-200/50">
                <img
                  src={carImage || SAMPLE_PHOTOS[0].url}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#111111] backdrop-blur-md border border-neutral-200/60">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          carStatus === "Disponible"
                            ? "#16A34A"
                            : carStatus === "Recién llegado"
                            ? brand.primaryColor
                            : "#D97706",
                      }}
                    />
                    {carStatus}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#111111] backdrop-blur-md border border-neutral-200/60 tabular-nums">
                    {carYear || 2024}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 text-[#6E6E73] backdrop-blur-md">
                    {carCategory}
                  </span>
                </div>
              </div>

              <div className="pt-3.5 px-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                  {carBrand.trim() || "MARCA"}
                </p>
                <h3 className="text-lg font-bold tracking-tight text-[#111111] leading-snug">
                  {carModel.trim() || "Modelo"}{" "}
                  <span className="font-medium text-[#6E6E73] text-sm">
                    {carVersion.trim() || "Versión"}
                  </span>
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAFAFA] border border-neutral-200/60 tabular-nums font-medium">
                    <Gauge className="w-3.5 h-3.5 text-[#6E6E73]" />
                    {formatKilometers(Number(carMileage) || 0)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAFAFA] border border-neutral-200/60 font-medium">
                    <Cog className="w-3.5 h-3.5 text-[#6E6E73]" />
                    {carTransmission}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAFAFA] border border-neutral-200/60 font-medium">
                    <Fuel className="w-3.5 h-3.5 text-[#6E6E73]" />
                    {carFuel}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200/70 flex items-end justify-between gap-2">
                  <div>
                    <span className="block text-[11px] font-medium text-[#6E6E73]">
                      Precio contado / financiamiento
                    </span>
                    <span
                      className="text-xl font-bold tracking-tight tabular-nums"
                      style={{ color: brand.primaryColor }}
                    >
                      {formatCLP(Number(carPrice) || 0)}
                    </span>
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
              </div>
            </div>

            {/* Primary Submit Action */}
            <div className="space-y-2.5 pt-1">
              <button
                type="submit"
                style={{ backgroundColor: brand.primaryColor }}
                className="w-full py-3.5 px-6 rounded-full text-sm font-bold text-white hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Subir vehículo demo</span>
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 px-6 rounded-full text-xs font-semibold text-[#6E6E73] hover:text-[#111111] hover:bg-white/70 transition-colors cursor-pointer"
              >
                Cancelar y volver al catálogo
              </button>
            </div>

            {/* Minimal Brand Color Accent Picker */}
            <div className="pt-4 border-t border-neutral-200/80 flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-[#6E6E73]">
                Color de marca (Demo):
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Rojo", hex: "#DC2626" },
                  { label: "Azul", hex: "#0284C7" },
                  { label: "Verde", hex: "#059669" },
                  { label: "Negro", hex: "#111111" },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onUpdateBrandColor(c.hex)}
                    title={c.label}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                      brand.primaryColor === c.hex
                        ? "scale-110 ring-2 ring-offset-2 ring-neutral-400"
                        : "opacity-75 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={`Color ${c.label}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
