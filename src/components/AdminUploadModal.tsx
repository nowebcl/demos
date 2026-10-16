"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  BrandConfig,
  Vehicle,
  VehicleCategory,
  VehicleStatus,
  formatCLP,
} from "@/data/vehicles";
import {
  Sparkles,
  X,
  PlusCircle,
  Wand2,
  CheckCircle2,
  Camera,
  Palette,
} from "lucide-react";

interface AdminUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandConfig;
  onUpdateBrandColor: (color: string) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
}

const AI_PRESETS: Omit<Vehicle, "id">[] = [
  {
    brand: "Porsche",
    model: "Macan",
    version: "2.0T PDK AWD",
    year: 2023,
    price: 54900000,
    previousPrice: 56900000,
    mileage: 14500,
    category: "SUV",
    status: "Recién llegado",
    location: "Luis Ross 445, Puerto Montt",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Transmisión automática PDK de doble embrague",
      "Paquete Sport Chrono y llantas RS Spyder 21”",
      "Techo panorámico y sonido Bose® Surround",
      "Mantenciones oficiales Ditec Chile",
    ],
    description:
      "Porsche Macan 2.0 Turbo PDK en estado de colección. Ingresado mediante escaneo inteligente IA con historial certificado sin siniestros y garantía vigente.",
    specs: {
      engine: "2.0L Turbo (265 HP)",
      fuel: "Bencina",
      transmission: "Automática",
      drivetrain: "AWD Porsche Traction Management",
      color: "Gris Crayón",
      owners: 1,
      doors: 5,
      consumption: "10.8 km/l mixto",
      airbags: 8,
      plateLastDigit: "6",
    },
  },
  {
    brand: "Chevrolet",
    model: "Silverado",
    version: "5.3 V8 Z71 Trail Boss 4x4",
    year: 2023,
    price: 41990000,
    mileage: 22100,
    category: "Camionetas",
    status: "Disponible",
    location: "Luis Ross 445, Puerto Montt",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Motor EcoTec3 5.3L V8 con caja de 10 velocidades",
      "Suspensión Off-Road Z71 de fábrica con Rancho®",
      "Pantalla táctil Google Built-In de 13.4 pulgadas",
      "Pisaderas eléctricas y portalón Multi-Flex",
    ],
    description:
      "Imponente Chevrolet Silverado Z71 Trail Boss V8. Equipada al máximo nivel para el sur de Chile, único dueño y facturable.",
    specs: {
      engine: "5.3L V8 EcoTec3 (355 HP)",
      fuel: "Bencina",
      transmission: "Automática",
      drivetrain: "4x4 Autotrac c/ Reductora",
      color: "Blanco Cumbre",
      owners: 1,
      doors: 4,
      consumption: "8.9 km/l mixto",
      airbags: 6,
      plateLastDigit: "0",
    },
  },
];

export default function AdminUploadModal({
  isOpen,
  onClose,
  brand,
  onUpdateBrandColor,
  onAddVehicle,
}: AdminUploadModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [presetIndex, setPresetIndex] = useState(0);
  const [isScanningAI, setIsScanningAI] = useState(false);

  // Form fields
  const [plate, setPlate] = useState("SJKW-42");
  const [carBrand, setCarBrand] = useState("Audi");
  const [carModel, setCarModel] = useState("Q3 Sportback");
  const [carVersion, setCarVersion] = useState("35 TFSI S line S tronic");
  const [carYear, setCarYear] = useState(2023);
  const [carPrice, setCarPrice] = useState(29890000);
  const [carMileage, setCarMileage] = useState(17500);
  const [carCategory, setCarCategory] = useState<VehicleCategory>("SUV");
  const [carStatus, setCarStatus] = useState<VehicleStatus>("Recién llegado");
  const [carTransmission, setCarTransmission] = useState<
    "Automática" | "Manual"
  >("Automática");
  const [carFuel, setCarFuel] = useState<"Bencina" | "Diésel" | "Híbrido">(
    "Bencina"
  );
  const [carImage, setCarImage] = useState(
    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85"
  );
  const [carDescription, setCarDescription] = useState(
    "Audi Q3 Sportback S line en estado inmaculado. Único dueño, mantenciones en Audi Zentrum, paquete deportivo exterior e interior y Virtual Cockpit."
  );

  // Sync dialog open/close state with native showModal()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Modern Web Guidance: Fallback for browsers without native <dialog closedby="any"> support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if (!("closedBy" in HTMLDialogElement.prototype)) {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isDialogContent) {
          dialog.close();
        }
      }
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleBackdropClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  const handleAIScan = () => {
    setIsScanningAI(true);
    setTimeout(() => {
      const preset = AI_PRESETS[presetIndex % AI_PRESETS.length];
      setPresetIndex((prev) => prev + 1);
      setPlate(presetIndex % 2 === 0 ? "TRWP-88" : "plkx-91".toUpperCase());
      setCarBrand(preset.brand);
      setCarModel(preset.model);
      setCarVersion(preset.version);
      setCarYear(preset.year);
      setCarPrice(preset.price);
      setCarMileage(preset.mileage);
      setCarCategory(preset.category);
      setCarStatus(preset.status);
      setCarTransmission(preset.specs.transmission);
      setCarFuel(preset.specs.fuel);
      setCarImage(preset.images[0]);
      setCarDescription(preset.description);
      setIsScanningAI(false);
    }, 650);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: `${carBrand.toLowerCase()}-${carModel
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}`,
      brand: carBrand,
      model: carModel,
      version: carVersion,
      year: Number(carYear),
      price: Number(carPrice),
      mileage: Number(carMileage),
      category: carCategory,
      status: carStatus,
      location: brand.address,
      featured: true,
      images: [
        carImage,
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
      ],
      highlights: [
        `Patente chilena verificada (${plate.toUpperCase()})`,
        "Inspección mecánica de 120 puntos aprobada",
        "Financiamiento inmediato disponible desde 20% de pie",
        "Documentación al día lista para transferencia",
      ],
      description: carDescription,
      specs: {
        engine: "2.0L Turbo (Ficha IA)",
        fuel: carFuel,
        transmission: carTransmission,
        drivetrain: "Integral / Electrónica",
        color: "Blanco / Gris Metálico",
        owners: 1,
        doors: 5,
        consumption: "13.2 km/l mixto",
        airbags: 6,
        plateLastDigit: plate.slice(-1) || "5",
      },
    };

    onAddVehicle(newVehicle);
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="admin-dialog-title"
      className="m-auto w-[calc(100%-1.5rem)] max-w-2xl rounded-3xl bg-white p-0 text-[#111111] border border-neutral-200/80 shadow-xl open:animate-in open:fade-in open:zoom-in-95 duration-200"
    >
      <div className="p-6 sm:p-8 max-h-[88vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-neutral-200/80">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6E6E73]">
                MODO DEMO DUEÑO · SUBIDA EN 60 SEGUNDOS
              </span>
              <h2
                id="admin-dialog-title"
                className="text-xl font-bold tracking-tight text-[#111111]"
              >
                Publicar Vehículo con IA ({brand.name})
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-neutral-200 flex items-center justify-center text-[#111111] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Auto-Fill Banner */}
        <div className="mt-5 rounded-2xl bg-[#F5F5F7] p-4 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#111111] flex items-center gap-1.5">
              <Wand2
                className="w-4 h-4"
                style={{ color: brand.primaryColor }}
              />
              Escáner de Patente y Redacción Automática IA
            </p>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              Autocompleta marca, versión, ficha técnica y reseña comercial con
              un clic.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAIScan}
            disabled={isScanningAI}
            style={{ backgroundColor: brand.primaryColor }}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-white hover:opacity-95 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isScanningAI
                ? "Analizando patente..."
                : "Autocompletar otro auto con IA"}
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Patente Chilena
              </label>
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-bold text-[#111111] uppercase tracking-wider focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Marca
              </label>
              <input
                type="text"
                required
                value={carBrand}
                onChange={(e) => setCarBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-semibold text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Modelo
              </label>
              <input
                type="text"
                required
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-semibold text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Versión / Motorización
              </label>
              <input
                type="text"
                required
                value={carVersion}
                onChange={(e) => setCarVersion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Año
              </label>
              <input
                type="number"
                required
                min={2010}
                max={2026}
                value={carYear}
                onChange={(e) => setCarYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-semibold text-[#111111] tabular-nums focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Precio CLP ({formatCLP(carPrice)})
              </label>
              <input
                type="number"
                required
                step={100000}
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-bold text-[#111111] tabular-nums focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Kilometraje (km)
              </label>
              <input
                type="number"
                required
                step={500}
                value={carMileage}
                onChange={(e) => setCarMileage(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-semibold text-[#111111] tabular-nums focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Categoría
              </label>
              <select
                value={carCategory}
                onChange={(e) =>
                  setCarCategory(e.target.value as VehicleCategory)
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-semibold text-[#111111] focus:bg-white focus:outline-none"
              >
                <option value="SUV">SUV</option>
                <option value="Camionetas">Camionetas</option>
                <option value="Sedán">Sedán</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Estado en Catálogo
              </label>
              <select
                value={carStatus}
                onChange={(e) => setCarStatus(e.target.value as VehicleStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-semibold text-[#111111] focus:bg-white focus:outline-none"
              >
                <option value="Recién llegado">Recién llegado</option>
                <option value="Disponible">Disponible</option>
                <option value="Reservado">Reservado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Transmisión
              </label>
              <select
                value={carTransmission}
                onChange={(e) =>
                  setCarTransmission(e.target.value as "Automática" | "Manual")
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-semibold text-[#111111] focus:bg-white focus:outline-none"
              >
                <option value="Automática">Automática</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Combustible
              </label>
              <select
                value={carFuel}
                onChange={(e) =>
                  setCarFuel(
                    e.target.value as "Bencina" | "Diésel" | "Híbrido"
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-semibold text-[#111111] focus:bg-white focus:outline-none"
              >
                <option value="Bencina">Bencina</option>
                <option value="Diésel">Diésel</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6E6E73] mb-1 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              URL Fotografía Principal (Alta Resolución)
            </label>
            <input
              type="url"
              required
              value={carImage}
              onChange={(e) => setCarImage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-xs text-[#111111] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
              Descripción Comercial redactada por IA
            </label>
            <textarea
              rows={2}
              value={carDescription}
              onChange={(e) => setCarDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-xs sm:text-sm text-[#111111] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Dynamic Brand Identity Color Selector */}
          <div className="pt-3 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#6E6E73]" />
              <span className="text-xs font-semibold text-[#6E6E73]">
                Color Corporativo Dinámico:
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { label: "Rojo Rap Motors", hex: "#DC2626" },
                { label: "Azul Alpino", hex: "#0284C7" },
                { label: "Verde British", hex: "#059669" },
                { label: "Carbón Editorial", hex: "#111111" },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onUpdateBrandColor(c.hex)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    brand.primaryColor === c.hex
                      ? "bg-[#F5F5F7] border-neutral-400 text-[#111111]"
                      : "bg-white border-neutral-200 text-[#6E6E73]"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold text-[#6E6E73] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ backgroundColor: brand.primaryColor }}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar en el Catálogo Ahora</span>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
