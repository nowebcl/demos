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
  X,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Check,
  CheckCircle2,
  Gauge,
  Cog,
  Fuel,
  Wand2,
  RotateCcw,
  Camera,
  Star,
  Image as ImageIcon,
  Car,
} from "lucide-react";

interface AdminUploadViewProps {
  brand: BrandConfig;
  onBack: () => void;
  onUpdateBrandColor?: (color: string) => void;
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
  images: string[];
  description: string;
}

const QUICK_PRESETS: PresetVehicle[] = [
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
    drivetrain: "AWD Porsche Traction Management",
    color: "Gris Crayón",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85",
    ],
    description:
      "Porsche Macan 2.0 Turbo PDK en estado de colección. Historial certificado sin siniestros, paquete Sport Chrono, llantas 21” y techo panorámico.",
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
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
    ],
    description:
      "Chevrolet Silverado Z71 Trail Boss V8. Suspensión Off-Road Rancho de fábrica, pantalla táctil de 13.4 pulgadas, único dueño y tracción 4x4 con reductora.",
  },
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
    drivetrain: "Delantera S tronic 7 vel.",
    color: "Gris Daytona",
    images: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85",
    ],
    description:
      "Audi Q3 Sportback S line en estado inmaculado. Único dueño, mantenciones oficiales al día, paquete exterior deportivo y Audi Virtual Cockpit.",
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
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=85",
    ],
    description:
      "BMW 320i paquete M Sport con BMW Curved Display, techo solar eléctrico, llantas M de 18” y garantía oficial vigente.",
  },
];

const SAMPLE_PHOTOS = [
  {
    label: "SUV Deportivo",
    url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Porsche / Coupé",
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Camioneta 4x4",
    url: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Sedán Ejecutivo",
    url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
  },
];

const POPULAR_BRANDS = [
  "Porsche",
  "Chevrolet",
  "Audi",
  "BMW",
  "Toyota",
  "Ford",
  "Mercedes-Benz",
  "Nissan",
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
  const [carYear, setCarYear] = useState<number>(QUICK_PRESETS[0].year);
  const [carPrice, setCarPrice] = useState<number>(QUICK_PRESETS[0].price);
  const [carMileage, setCarMileage] = useState<number>(QUICK_PRESETS[0].mileage);
  const [carCategory, setCarCategory] = useState<VehicleCategory>(
    QUICK_PRESETS[0].category
  );
  const [carStatus, setCarStatus] = useState<VehicleStatus>(
    QUICK_PRESETS[0].status
  );
  const [carTransmission, setCarTransmission] = useState<"Automática" | "Manual">(
    QUICK_PRESETS[0].transmission
  );
  const [carFuel, setCarFuel] = useState<"Bencina" | "Diésel" | "Híbrido">(
    QUICK_PRESETS[0].fuel
  );
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    QUICK_PRESETS[0].images
  );
  const [carDescription, setCarDescription] = useState(
    QUICK_PRESETS[0].description
  );
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  // Scroll to top on open
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle Preset selection
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
    setUploadedImages([...preset.images]);
    setCarDescription(preset.description);
  };

  // Reset to empty
  const handleClearForm = () => {
    setActivePresetIdx(-1);
    setPlate("");
    setCarBrand("");
    setCarModel("");
    setCarVersion("");
    setCarYear(2024);
    setCarPrice(19990000);
    setCarMileage(15000);
    setCarCategory("SUV");
    setCarStatus("Disponible");
    setCarTransmission("Automática");
    setCarFuel("Bencina");
    setUploadedImages([]);
    setCarDescription("");
  };

  // Handle Real File Upload (supports multiple)
  const processFiles = (files: FileList | File[]) => {
    const newUrls: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        newUrls.push(objectUrl);
      }
    });

    if (newUrls.length > 0) {
      setUploadedImages((prev) => [...prev, ...newUrls]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value so same files can be re-selected if needed
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setUploadedImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  const handleAddCustomUrl = () => {
    const trimmed = customUrl.trim();
    if (trimmed && (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:"))) {
      setUploadedImages((prev) => [...prev, trimmed]);
      setCustomUrl("");
    }
  };

  const handleAddSamplePhoto = (url: string) => {
    if (!uploadedImages.includes(url)) {
      setUploadedImages((prev) => [...prev, url]);
    }
  };

  const handleAutoGenerateDescription = () => {
    const b = carBrand.trim() || "Vehículo";
    const m = carModel.trim() || "";
    const v = carVersion.trim() ? ` ${carVersion.trim()}` : "";
    setCarDescription(
      `${b} ${m}${v} año ${carYear} con ${formatKilometers(
        Number(carMileage) || 0
      )}. Unidad en impecable estado de conservación, revisada exhaustivamente y disponible con financiamiento inmediato y garantía en ${
        brand.name
      }. Recibimos tu auto en parte de pago.`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBrand = carBrand.trim() || "Vehículo";
    const cleanModel = carModel.trim() || "Demo";
    const cleanPlate = plate.trim().toUpperCase() || "DEMO-01";

    const finalImages =
      uploadedImages.length > 0
        ? uploadedImages
        : [
            SAMPLE_PHOTOS[0].url,
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
          ];

    const newVehicle: Vehicle = {
      id: `${cleanBrand.toLowerCase()}-${cleanModel
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}`,
      brand: cleanBrand,
      model: cleanModel,
      version: carVersion.trim() || "Full Equipo",
      year: Number(carYear) || 2024,
      price: Number(carPrice) || 19990000,
      mileage: Number(carMileage) || 0,
      category: carCategory,
      status: carStatus,
      location: brand.address,
      featured: true,
      images: finalImages,
      highlights: [
        `Patente verificada (${cleanPlate})`,
        "Inspección mecánica y certificado al día",
        "Financiamiento automotriz desde 20% de pie",
        "Entrega inmediata con transferencia lista",
      ],
      description:
        carDescription.trim() ||
        `${cleanBrand} ${cleanModel} ${carYear} en excelente estado mecánico y estético. Disponible para entrega inmediata en ${brand.address}.`,
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
            : "Tracción integral / asistida",
        color:
          activePresetIdx >= 0
            ? QUICK_PRESETS[activePresetIdx].color
            : "Gris Platino",
        owners: 1,
        doors: carCategory === "Camionetas" ? 4 : carCategory === "SUV" ? 5 : 4,
        consumption: "12.5 km/l mixto",
        airbags: 6,
        plateLastDigit: cleanPlate.slice(-1) || "0",
      },
    };

    onAddVehicle(newVehicle);
  };

  // Financing calculation for preview
  const loanPrincipal = (Number(carPrice) || 0) * 0.7;
  const monthlyRate = 0.0149;
  const estimatedMonthly =
    loanPrincipal > 0
      ? (loanPrincipal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -48))
      : 0;

  const primaryCoverImage =
    uploadedImages.length > 0 ? uploadedImages[0] : SAMPLE_PHOTOS[0].url;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel de subida de vehículo demo"
      className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col overflow-y-auto overscroll-contain animate-in fade-in duration-200"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* 1. STICKY TOPBAR FULLSCREEN */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-neutral-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 text-xs sm:text-sm font-semibold text-[#111111] transition-all cursor-pointer active:scale-95"
            title="Volver al catálogo (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al catálogo</span>
            <span className="sm:hidden">Volver</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleClearForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-semibold text-[#6E6E73] hover:text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#6E6E73] hover:text-[#111111] flex items-center justify-center transition-colors cursor-pointer ml-1"
            aria-label="Cerrar panel"
            title="Cerrar (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* Intro & 1-Click Preset Bar */}
        <div className="mb-8 space-y-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#6E6E73] bg-[#EFEFF2] mb-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: brand.primaryColor }} />
              Simulador de Carga Inmediata
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
              Subir vehículo de prueba
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-2xl leading-relaxed">
              Sube fotos reales desde tu dispositivo o carga un ejemplo de 1 clic.
              El vehículo se publicará inmediatamente en el catálogo con cálculo de cuotas e inspección completa.
            </p>
          </div>

          {/* Quick 1-Click Presets */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#6E6E73] mr-1 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-[#111111]" />
              Ejemplos rápidos:
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "shadow-sm scale-[1.02]"
                      : "bg-white text-[#111111] hover:bg-neutral-100 border border-neutral-200/80 shadow-2xs"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleClearForm}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
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

        {/* 3. TWO-COLUMN WORKSPACE */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* LEFT COLUMN: Clean Form Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: REAL IMAGE UPLOAD */}
            <section className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2">
                    <Camera className="w-5 h-5" style={{ color: brand.primaryColor }} />
                    <span>1. Fotos reales del vehículo</span>
                  </h2>
                  <p className="text-xs text-[#6E6E73] mt-0.5">
                    Sube una o varias fotos reales desde tu teléfono o computadora (JPG, PNG o WebP).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUrlInput((prev) => !prev)}
                  className="text-xs font-semibold text-[#6E6E73] hover:text-[#111111] underline underline-offset-4 cursor-pointer"
                >
                  {showUrlInput ? "Ocultar URL web" : "+ Pegar URL web"}
                </button>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? "border-neutral-900 bg-neutral-50 scale-[1.01]"
                    : "border-neutral-300 hover:border-neutral-400 bg-[#FAFAFC] hover:bg-[#F5F5F8]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div
                  className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-neutral-200 flex items-center justify-center text-[#111111]"
                  style={{ color: brand.primaryColor }}
                >
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#111111]">
                    Haz clic aquí o arrastra tus fotos reales
                  </p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Puedes seleccionar varias imágenes a la vez (frontal, lateral, interior)
                  </p>
                </div>

                <span
                  style={{ backgroundColor: brand.primaryColor }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Seleccionar archivos</span>
                </span>
              </div>

              {/* Optional URL Input */}
              {showUrlInput && (
                <div className="pt-2 p-3.5 rounded-2xl bg-[#FAFAFC] border border-neutral-200/80 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#6E6E73] shrink-0" />
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomUrl();
                      }
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-white px-3 py-2 rounded-xl border border-neutral-200 text-xs text-[#111111] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomUrl}
                    className="px-3.5 py-2 rounded-xl bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Agregar URL
                  </button>
                </div>
              )}

              {/* Uploaded Real Images Gallery */}
              {uploadedImages.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                    <span className="font-semibold text-[#111111]">
                      Fotos cargadas ({uploadedImages.length}):
                    </span>
                    <span>La primera foto será la portada principal</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedImages.map((imgUrl, idx) => {
                      const isCover = idx === 0;
                      return (
                        <div
                          key={`${imgUrl}-${idx}`}
                          className={`group relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100 border-2 transition-all shadow-2xs ${
                            isCover
                              ? "border-neutral-900 ring-2 ring-neutral-900/10"
                              : "border-neutral-200/80 hover:border-neutral-400"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Cover Badge */}
                          {isCover && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#111111]/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-white text-white" />
                              <span>Portada</span>
                            </div>
                          )}

                          {/* Actions overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="px-2 py-1 rounded-md bg-white/95 text-[#111111] text-[10px] font-bold hover:bg-white transition-colors cursor-pointer"
                                title="Fijar como foto principal"
                              >
                                Portada
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                              title="Eliminar foto"
                              aria-label="Eliminar foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Quick Add More Card */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-4/3 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 bg-[#FAFAFC] hover:bg-white flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-[#6E6E73] hover:text-[#111111]"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-[11px] font-semibold">+ Otra foto</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sample Photos Quick Pick */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <span className="block text-[11px] font-semibold text-[#6E6E73]">
                  O añade fotos de muestra con 1 clic:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_PHOTOS.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => handleAddSamplePhoto(sample.url)}
                      className="flex items-center gap-2 p-1.5 rounded-xl bg-[#FAFAFC] hover:bg-neutral-100 border border-neutral-200/70 transition-all text-left cursor-pointer group"
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <span className="block text-[11px] font-semibold text-[#111111] truncate group-hover:underline">
                          {sample.label}
                        </span>
                        <span className="block text-[9px] text-[#6E6E73]">+ Añadir</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* STEP 2: MAIN DATA */}
            <section className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-[#111111]">
                  2. Datos comerciales
                </h2>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Marca, modelo, precio en pesos chilenos y kilometraje
                </p>
              </div>

              {/* Brand & Model */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="upload-brand"
                      className="block text-xs font-bold text-[#111111] mb-1.5"
                    >
                      Marca *
                    </label>
                    <input
                      id="upload-brand"
                      type="text"
                      required
                      value={carBrand}
                      onChange={(e) => setCarBrand(e.target.value)}
                      placeholder="Ej: Porsche, Toyota, Ford..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFC] focus:bg-white border border-neutral-200 text-sm font-bold text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="upload-model"
                      className="block text-xs font-bold text-[#111111] mb-1.5"
                    >
                      Modelo *
                    </label>
                    <input
                      id="upload-model"
                      type="text"
                      required
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="Ej: Macan, Hilux, Silverado..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFC] focus:bg-white border border-neutral-200 text-sm font-bold text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all"
                    />
                  </div>
                </div>

                {/* Popular brand tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-[#6E6E73] mr-1">Sugerencias:</span>
                  {POPULAR_BRANDS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setCarBrand(b)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                        carBrand.toLowerCase() === b.toLowerCase()
                          ? "bg-[#111111] text-white"
                          : "bg-[#FAFAFC] text-[#6E6E73] hover:text-[#111111] border border-neutral-200/80"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Version & License Plate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="upload-version"
                    className="block text-xs font-semibold text-[#6E6E73] mb-1.5"
                  >
                    Versión y equipamiento
                  </label>
                  <input
                    id="upload-version"
                    type="text"
                    value={carVersion}
                    onChange={(e) => setCarVersion(e.target.value)}
                    placeholder="Ej: 2.0T PDK AWD, 4x4 Diésel..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFC] focus:bg-white border border-neutral-200 text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all"
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
                    placeholder="TRWP-88"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFC] focus:bg-white border border-neutral-200 text-sm font-bold text-[#111111] uppercase tracking-wider placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all"
                  />
                </div>
              </div>

              {/* Price, Mileage & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="upload-price"
                      className="block text-xs font-bold text-[#111111]"
                    >
                      Precio (CLP) *
                    </label>
                    <span
                      className="text-xs font-bold tabular-nums"
                      style={{ color: brand.primaryColor }}
                    >
                      {formatCLP(Number(carPrice) || 0)}
                    </span>
                  </div>
                  <input
                    id="upload-price"
                    type="number"
                    min={100000}
                    step={100000}
                    value={carPrice || ""}
                    onChange={(e) => setCarPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFC] focus:bg-white border border-neutral-200 text-sm font-bold text-[#111111] tabular-nums focus:outline-none focus:border-neutral-400 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="upload-mileage"
                      className="block text-xs font-bold text-[#111111]"
                    >
                      Kilometraje (km)
                    </label>
                    <span className="text-xs font-semibold text-[#6E6E73] tabular-nums">
                      {formatKilometers(Number(carMileage) || 0)}
                    </span>
                  </div>
                  <input
                    id="upload-mileage"
                    type="number"
                    min={0}
                    step={500}
                    value={carMileage ?? ""}
                    onChange={(e) => setCarMileage(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFC] focus:bg-white border border-neutral-200 text-sm font-semibold text-[#111111] tabular-nums focus:outline-none focus:border-neutral-400 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="upload-year"
                    className="block text-xs font-bold text-[#111111] mb-1.5"
                  >
                    Año de fabricación
                  </label>
                  <input
                    id="upload-year"
                    type="number"
                    min={1990}
                    max={2030}
                    step={1}
                    value={carYear || ""}
                    onChange={(e) => setCarYear(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFC] focus:bg-white border border-neutral-200 text-sm font-semibold text-[#111111] tabular-nums focus:outline-none focus:border-neutral-400 transition-all"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="pt-2">
                <span className="block text-xs font-bold text-[#111111] mb-2">
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
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? "shadow-sm"
                            : "bg-[#FAFAFC] text-[#111111] hover:bg-neutral-100 border border-neutral-200/80"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* STEP 3: SPECS & DESCRIPTION */}
            <section className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-[#111111]">
                  3. Especificaciones y reseña
                </h2>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Transmisión, tipo de combustible y reseña del vehículo
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
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            active
                              ? "shadow-sm"
                              : "bg-[#FAFAFC] text-[#111111] hover:bg-neutral-100 border border-neutral-200/80"
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
                          className={`py-2.5 px-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            active
                              ? "shadow-sm"
                              : "bg-[#FAFAFC] text-[#111111] hover:bg-neutral-100 border border-neutral-200/80"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-neutral-200 text-xs font-bold text-[#111111] focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label
                    htmlFor="upload-description"
                    className="text-xs font-bold text-[#111111]"
                  >
                    Reseña comercial
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateDescription}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAFAFC] hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-[#111111] transition-all cursor-pointer active:scale-95"
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
                  placeholder="Describe brevemente el estado, equipamiento y procedencia del vehículo..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFC] focus:bg-white border border-neutral-200 text-xs sm:text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all leading-relaxed"
                />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Sticky Live Preview & Action (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div className="rounded-3xl bg-white p-5 sm:p-6 border border-neutral-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: brand.primaryColor }} />
                  Vista previa en vivo
                </span>
                <span className="text-[11px] font-semibold text-[#6E6E73]">
                  {uploadedImages.length} {uploadedImages.length === 1 ? "foto" : "fotos"}
                </span>
              </div>

              {/* Live Card Preview */}
              <div className="rounded-2xl bg-[#F8F9FA] p-3 border border-neutral-200/80">
                <div className="aspect-4/3 rounded-xl overflow-hidden relative bg-neutral-200 border border-neutral-200/60">
                  <img
                    src={primaryCoverImage}
                    alt="Vista previa de vehículo"
                    className="w-full h-full object-cover transition-transform duration-300"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#111111] backdrop-blur-md shadow-xs border border-neutral-200/60">
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

                  {/* Year Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-white/95 text-[#111111] backdrop-blur-md shadow-xs border border-neutral-200/60 tabular-nums">
                      {carYear || 2024}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-[#6E6E73] backdrop-blur-md">
                      {carCategory}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="pt-3 px-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E73]">
                    {carBrand.trim() || "MARCA"}
                  </p>
                  <h3 className="text-lg font-extrabold tracking-tight text-[#111111] leading-snug">
                    {carModel.trim() || "Modelo"}{" "}
                    <span className="font-medium text-[#6E6E73] text-sm">
                      {carVersion.trim() || "Versión"}
                    </span>
                  </h3>

                  {/* Quick specs pills */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[#6E6E73]">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-neutral-200/70 font-semibold tabular-nums text-[11px]">
                      <Gauge className="w-3 h-3 text-[#6E6E73]" />
                      {formatKilometers(Number(carMileage) || 0)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-neutral-200/70 font-semibold text-[11px]">
                      <Cog className="w-3 h-3 text-[#6E6E73]" />
                      {carTransmission}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-neutral-200/70 font-semibold text-[11px]">
                      <Fuel className="w-3 h-3 text-[#6E6E73]" />
                      {carFuel}
                    </span>
                  </div>

                  {/* Price & Monthly Quota */}
                  <div className="mt-3.5 pt-3 border-t border-neutral-200/80 flex items-end justify-between gap-2">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6E6E73]">
                        Precio al contado
                      </span>
                      <span
                        className="text-xl font-extrabold tracking-tight tabular-nums"
                        style={{ color: brand.primaryColor }}
                      >
                        {formatCLP(Number(carPrice) || 0)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] font-semibold text-[#6E6E73]">
                        Cuota ref. (30% pie)
                      </span>
                      <span className="text-xs font-bold text-[#111111] tabular-nums">
                        {formatCLP(estimatedMonthly)}/mes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big CTA Publish Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  style={{ backgroundColor: brand.primaryColor }}
                  className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publicar vehículo en demo</span>
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#6E6E73] hover:text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer text-center"
                >
                  Cancelar y volver al catálogo
                </button>
              </div>

              {/* Brand Accent Selector */}
              {onUpdateBrandColor && (
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-[#6E6E73]">
                  <span>Color de acento demo:</span>
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
                        className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                          brand.primaryColor === c.hex
                            ? "scale-110 ring-2 ring-offset-2 ring-neutral-400"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        aria-label={`Color ${c.label}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
