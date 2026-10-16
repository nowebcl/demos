"use client";

import React, { useState, useMemo } from "react";
import {
  BrandConfig,
  Vehicle,
  formatCLP,
  formatKilometers,
  formatRut,
} from "@/data/vehicles";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Gauge,
  Calendar,
  Cog,
  Fuel,
  Compass,
  Palette,
  Users,
  Sparkles,
  Calculator,
  Car,
  MessageCircle,
  Send,
  Share2,
  Check,
} from "lucide-react";

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  brand: BrandConfig;
  onBack: () => void;
  relatedVehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

const LOAN_TERMS = [12, 24, 36, 48, 60] as const;

const INCOME_RANGES = [
  "$800.000 - $1.200.000",
  "$1.200.000 - $1.800.000",
  "$1.800.000 - $2.500.000",
  "Más de $2.500.000",
];

export default function VehicleDetailView({
  vehicle,
  brand,
  onBack,
  relatedVehicles,
  onSelectVehicle,
}: VehicleDetailViewProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Financing Simulator State
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [months, setMonths] = useState<number>(48);
  const [hasTradeIn, setHasTradeIn] = useState<boolean>(false);
  const [tradeInDetails, setTradeInDetails] = useState<string>("");
  const [tradeInEstimatedValue, setTradeInEstimatedValue] = useState<number>(0);

  // Fast Evaluation Form State
  const [fullName, setFullName] = useState<string>("");
  const [rut, setRut] = useState<string>("");
  const [phone, setPhone] = useState<string>("+56 9 ");
  const [incomeRange, setIncomeRange] = useState<string>(INCOME_RANGES[1]);
  const [submittedEvaluation, setSubmittedEvaluation] =
    useState<boolean>(false);

  // Reset selected image if vehicle changes
  React.useEffect(() => {
    setSelectedImageIdx(0);
    setSubmittedEvaluation(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [vehicle.id]);

  // Financial Calculations
  const downPaymentAmount = useMemo(() => {
    return Math.round((vehicle.price * downPaymentPercent) / 100);
  }, [vehicle.price, downPaymentPercent]);

  const effectiveTradeIn = hasTradeIn ? Math.max(0, tradeInEstimatedValue) : 0;

  const totalInitialContribution = useMemo(() => {
    return Math.min(vehicle.price * 0.9, downPaymentAmount + effectiveTradeIn);
  }, [vehicle.price, downPaymentAmount, effectiveTradeIn]);

  const amountToFinance = useMemo(() => {
    return Math.max(0, vehicle.price - totalInitialContribution);
  }, [vehicle.price, totalInitialContribution]);

  const monthlyInstallment = useMemo(() => {
    if (amountToFinance <= 0) return 0;
    const monthlyRate = 0.0149; // 1.49% tasa mensual referencial automotriz Chile
    return Math.round(
      (amountToFinance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    );
  }, [amountToFinance, months]);

  // Build pre-filled WhatsApp message
  const whatsappUrl = useMemo(() => {
    const lines = [
      `Hola *${brand.name}*, me interesa cotizar el siguiente vehículo de su catálogo:`,
      ``,
      `🚗 *Vehículo:* ${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.year})`,
      `💰 *Precio:* ${formatCLP(vehicle.price)}`,
      `📊 *Simulación de Financiamiento:*`,
      `• Pie inicial (${downPaymentPercent}%): ${formatCLP(downPaymentAmount)}`,
      ...(hasTradeIn
        ? [
            `• Auto en parte de pago: ${
              tradeInDetails.trim() || "Sí, por tasar"
            } (${
              effectiveTradeIn > 0
                ? `Valor est. ${formatCLP(effectiveTradeIn)}`
                : "Sujeto a tasación"
            })`,
          ]
        : [`• Auto en parte de pago: No`]),
      `• Saldo a financiar: ${formatCLP(amountToFinance)}`,
      `• Plazo estimado: ${months} cuotas de *${formatCLP(
        monthlyInstallment
      )}/mes* aprox.`,
      ...(fullName.trim() || rut.trim()
        ? [
            ``,
            `👤 *Mis datos para evaluación:*`,
            ...(fullName.trim() ? [`• Nombre: ${fullName.trim()}`] : []),
            ...(rut.trim() ? [`• RUT: ${rut.trim()}`] : []),
            ...(phone.trim() && phone.trim() !== "+56 9"
              ? [`• Teléfono: ${phone.trim()}`]
              : []),
            `• Renta líquida ref.: ${incomeRange}`,
          ]
        : []),
      ``,
      `📍 Quedo atento(a) para coordinar evaluación o visita en ${brand.address}.`,
    ];

    return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
  }, [
    brand,
    vehicle,
    downPaymentPercent,
    downPaymentAmount,
    hasTradeIn,
    tradeInDetails,
    effectiveTradeIn,
    amountToFinance,
    months,
    monthlyInstallment,
    fullName,
    rut,
    phone,
    incomeRange,
  ]);

  const handleEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedEvaluation(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="py-6 sm:py-8 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 text-sm font-semibold text-[#111111] transition-all cursor-pointer active:scale-[0.99]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F5F5F7] text-xs font-medium text-[#6E6E73]">
            <MapPin className="w-3.5 h-3.5" style={{ color: brand.primaryColor }} />
            Disponible en {brand.address}
          </span>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 text-xs font-semibold text-[#111111] transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span>Enlace copiado</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir ficha</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (7 cols): Photo Gallery, Description & Technical Specs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gallery Container */}
          <div className="rounded-3xl bg-[#F5F5F7] p-3 sm:p-4 border border-neutral-200/60">
            <div className="aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-white relative border border-neutral-200/50">
              <img
                src={vehicle.images[selectedImageIdx] || vehicle.images[0]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 text-[#111111] backdrop-blur-md border border-neutral-200/80">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        vehicle.status === "Disponible"
                          ? "#16A34A"
                          : vehicle.status === "Recién llegado"
                          ? brand.primaryColor
                          : "#D97706",
                    }}
                  />
                  {vehicle.status}
                </span>
              </div>

              {/* Category & Year Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-[#111111] backdrop-blur-md border border-neutral-200/80 tabular-nums">
                  Año {vehicle.year}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {vehicle.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {vehicle.images.map((imgUrl, idx) => {
                  const isActive = idx === selectedImageIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`aspect-square rounded-xl overflow-hidden bg-white border-2 transition-all cursor-pointer ${
                        isActive
                          ? "opacity-100 scale-[0.99]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={
                        isActive ? { borderColor: brand.primaryColor } : undefined
                      }
                    >
                      <img
                        src={imgUrl}
                        alt={`Miniatura ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vehicle Overview & Highlights */}
          <div className="rounded-3xl bg-[#F5F5F7] p-6 sm:p-8 border border-neutral-200/60 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200/80 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6E6E73]">
                  {vehicle.brand} · {vehicle.category}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] mt-1">
                  {vehicle.brand} {vehicle.model}{" "}
                  <span className="text-[#6E6E73] font-medium">
                    {vehicle.version}
                  </span>
                </h1>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-medium text-[#6E6E73] block">
                  Precio Contado / Crédito
                </span>
                <span
                  className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums"
                  style={{ color: brand.primaryColor }}
                >
                  {formatCLP(vehicle.price)}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-2.5">
                Reseña de la unidad
              </h2>
              <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            {/* Highlights List */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-3">
                Puntos destacados y equipamiento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.highlights.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 bg-white rounded-2xl p-3.5 border border-neutral-200/60"
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: brand.primaryColor }}
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#111111]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="rounded-3xl bg-[#F5F5F7] p-6 sm:p-8 border border-neutral-200/60">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[#111111]">
                  Ficha Técnica Certificada
                </h2>
                <p className="text-xs text-[#6E6E73]">
                  Especificaciones verificadas por {brand.legalName}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#111111] border border-neutral-200/80">
                <ShieldCheck
                  className="w-3.5 h-3.5"
                  style={{ color: brand.primaryColor }}
                />
                120 pts OK
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Año</span>
                </div>
                <p className="text-sm font-bold text-[#111111] tabular-nums">
                  {vehicle.year}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] mb-1">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Kilometraje</span>
                </div>
                <p className="text-sm font-bold text-[#111111] tabular-nums">
                  {formatKilometers(vehicle.mileage)}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] mb-1">
                  <Cog className="w-3.5 h-3.5" />
                  <span>Transmisión</span>
                </div>
                <p className="text-sm font-bold text-[#111111]">
                  {vehicle.specs.transmission}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] mb-1">
                  <Fuel className="w-3.5 h-3.5" />
                  <span>Combustible</span>
                </div>
                <p className="text-sm font-bold text-[#111111]">
                  {vehicle.specs.fuel}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Motorización</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#111111]">
                  {vehicle.specs.engine}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Tracción</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#111111]">
                  {vehicle.specs.drivetrain}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] mb-1">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Color Exterior</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#111111]">
                  {vehicle.specs.color}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Dueños / Airbags</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#111111] tabular-nums">
                  {vehicle.specs.owners} dueño · {vehicle.specs.airbags} AB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Star Module — Financing Simulator & Trade-In + Fast Form */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <div className="rounded-3xl bg-[#F5F5F7] p-6 sm:p-7 border border-neutral-200/80">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-neutral-200/80">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#111111]">
                    Simulador de Financiamiento
                  </h2>
                  <p className="text-xs text-[#6E6E73]">
                    Calcula tu cuota y evalúa con tu RUT en línea
                  </p>
                </div>
              </div>
            </div>

            {/* Price & Monthly Summary Highlight Box */}
            <div className="mt-5 bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-[#6E6E73] block">
                  Cuota mensual estimada ({months} meses)
                </span>
                <span
                  className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums mt-0.5 block"
                  style={{ color: brand.primaryColor }}
                >
                  {formatCLP(monthlyInstallment)}
                  <span className="text-xs font-medium text-[#6E6E73]">
                    {" "}
                    /mes
                  </span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-medium text-[#6E6E73] block">
                  Monto a financiar
                </span>
                <span className="text-sm sm:text-base font-bold text-[#111111] tabular-nums">
                  {formatCLP(amountToFinance)}
                </span>
              </div>
            </div>

            {/* Down Payment (Pie Inicial) Slider */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <label
                  htmlFor="pie-slider"
                  className="font-semibold text-[#111111]"
                >
                  Pie Inicial ({downPaymentPercent}%)
                </label>
                <span
                  className="font-bold tabular-nums text-sm sm:text-base"
                  style={{ color: brand.primaryColor }}
                >
                  {formatCLP(downPaymentAmount)}
                </span>
              </div>

              <input
                id="pie-slider"
                type="range"
                min={20}
                max={80}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                style={
                  {
                    "--brand-primary": brand.primaryColor,
                    accentColor: brand.primaryColor,
                  } as React.CSSProperties
                }
                className="w-full brand-slider"
              />

              <div className="flex justify-between text-[11px] text-[#6E6E73] tabular-nums">
                <span>Mín. 20% ({formatCLP(vehicle.price * 0.2)})</span>
                <span>50% ({formatCLP(vehicle.price * 0.5)})</span>
                <span>80% ({formatCLP(vehicle.price * 0.8)})</span>
              </div>
            </div>

            {/* Term Selector Pills */}
            <div className="mt-5">
              <span className="block text-xs font-semibold text-[#111111] mb-2">
                Plazo en cuotas
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {LOAN_TERMS.map((term) => {
                  const active = months === term;
                  return (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setMonths(term)}
                      style={
                        active
                          ? { backgroundColor: brand.primaryColor, color: "#FFF" }
                          : undefined
                      }
                      className={`py-2 rounded-xl text-xs font-semibold tabular-nums transition-all cursor-pointer ${
                        active
                          ? "shadow-xs"
                          : "bg-white text-[#111111] hover:bg-neutral-200/60 border border-neutral-200/70"
                      }`}
                    >
                      {term}m
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Trade-In Toggle */}
            <div className="mt-5 pt-4 border-t border-neutral-200/80">
              <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <Car
                    className="w-4 h-4 shrink-0"
                    style={{ color: brand.primaryColor }}
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-[#111111] block">
                      Entregar mi auto en parte de pago
                    </span>
                    <span className="text-[11px] text-[#6E6E73] block">
                      Úsalo para cubrir o aumentar tu pie inicial
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={hasTradeIn}
                  onChange={(e) => setHasTradeIn(e.target.checked)}
                  style={{ accentColor: brand.primaryColor }}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </label>

              {hasTradeIn && (
                <div className="mt-3.5 p-3.5 rounded-2xl bg-[#FAFAFA] border border-neutral-200/80 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6E73] mb-1">
                      Marca, Modelo y Año de tu vehículo
                    </label>
                    <input
                      type="text"
                      value={tradeInDetails}
                      onChange={(e) => setTradeInDetails(e.target.value)}
                      placeholder="Ej: Kia Sportage 2019 2.0 AT"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6E73] mb-1">
                      Valor estimado de retoma (opcional en CLP)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500000}
                      value={tradeInEstimatedValue || ""}
                      onChange={(e) =>
                        setTradeInEstimatedValue(Number(e.target.value) || 0)
                      }
                      placeholder="Ej: 10500000"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm text-[#111111] tabular-nums placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Fast Application Form (Nombre, RUT, Teléfono, Rango de ingresos) */}
            <form
              onSubmit={handleEvaluationSubmit}
              className="mt-5 pt-5 border-t border-neutral-200/80 space-y-3.5"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Solicitud Rápida de Evaluación
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Matías Soto"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] border border-neutral-200/90 text-xs sm:text-sm text-[#111111] placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    RUT Chileno
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={rut}
                    onChange={(e) => setRut(formatRut(e.target.value))}
                    placeholder="12.345.678-9"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] border border-neutral-200/90 text-xs sm:text-sm text-[#111111] tabular-nums placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    Teléfono Móvil
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9 8765 4321"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] border border-neutral-200/90 text-xs sm:text-sm text-[#111111] tabular-nums placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    Rango de Ingresos Líquidos
                  </label>
                  <select
                    value={incomeRange}
                    onChange={(e) => setIncomeRange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FAFAFA] border border-neutral-200/90 text-xs sm:text-sm text-[#111111] focus:bg-white focus:outline-none focus:border-neutral-400"
                  >
                    {INCOME_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {submittedEvaluation && (
                <div className="p-3.5 rounded-2xl bg-white border border-green-200 flex items-start gap-2.5 text-xs text-[#111111]">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      ¡Pre-evaluación registrada con éxito!
                    </p>
                    <p className="text-[#6E6E73] mt-0.5">
                      Un ejecutivo de {brand.name} revisará tu solicitud para el{" "}
                      <strong>
                        {vehicle.brand} {vehicle.model}
                      </strong>
                      . Para atención inmediata, envíanos el respaldo por
                      WhatsApp abajo.
                    </p>
                  </div>
                </div>
              )}

              {/* DOBLE ACCIÓN FINAL */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  style={{ backgroundColor: brand.primaryColor }}
                  className="w-full py-3.5 px-5 rounded-2xl text-sm font-bold text-white hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>Solicitar Evaluación de Financiamiento</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl text-sm font-bold text-[#111111] bg-white hover:bg-neutral-100 border border-neutral-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <MessageCircle
                    className="w-4 h-4"
                    style={{ color: "#16A34A" }}
                  />
                  <span>Enviar Cotización por WhatsApp Directo</span>
                </a>
              </div>

              <p className="text-[11px] text-center text-[#6E6E73] leading-normal">
                Simulación referencial sujeta a evaluación comercial. Atención
                presencial en{" "}
                <strong className="text-[#111111]">{brand.address}</strong>.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Related Vehicles Section */}
      {relatedVehicles.length > 0 && (
        <div className="mt-14 pt-8 border-t border-neutral-200/70">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#111111]">
                Otras unidades en stock que podrían interesarte
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Disponibles para entrega inmediata en {brand.city ? brand.city.split(',')[0] : brand.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedVehicles.slice(0, 4).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectVehicle(rel)}
                className="rounded-3xl bg-[#F5F5F7] p-3 hover:bg-neutral-200/70 transition-all cursor-pointer flex items-center gap-3.5 border border-transparent hover:border-neutral-300/70"
              >
                <img
                  src={rel.images[0]}
                  alt={`${rel.brand} ${rel.model}`}
                  className="w-20 h-20 rounded-2xl object-cover bg-white shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase text-[#6E6E73]">
                    {rel.brand} · {rel.year}
                  </p>
                  <p className="text-sm font-bold text-[#111111] truncate">
                    {rel.model} {rel.version}
                  </p>
                  <p
                    className="text-sm font-bold tabular-nums mt-1"
                    style={{ color: brand.primaryColor }}
                  >
                    {formatCLP(rel.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
