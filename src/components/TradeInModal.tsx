"use client";

import React, { useEffect, useRef, useState } from "react";
import { BrandConfig } from "@/data/vehicles";
import { Car, X, MessageCircle, CheckCircle2 } from "lucide-react";

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandConfig;
}

export default function TradeInModal({
  isOpen,
  onClose,
  brand,
}: TradeInModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [plate, setPlate] = useState("");
  const [carInfo, setCarInfo] = useState("");
  const [year, setYear] = useState("2021");
  const [mileage, setMileage] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [ownerName, setOwnerName] = useState("");

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

    const handleClose = () => onClose();

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

  const whatsappTradeInUrl = `https://wa.me/${
    brand.whatsapp
  }?text=${encodeURIComponent(
    [
      `Hola *${brand.name}*, quiero tasar mi vehículo para entregarlo en parte de pago o venta directa:`,
      ``,
      `🚘 *Marca y Modelo:* ${carInfo || "Por indicar"}`,
      `📅 *Año:* ${year}`,
      `🪪 *Patente:* ${plate.toUpperCase() || "Por confirmar"}`,
      `🛣️ *Kilometraje:* ${mileage ? `${mileage} km` : "Por confirmar"}`,
      ...(expectedPrice ? [`💰 *Valor esperado:* $${expectedPrice}`] : []),
      ...(ownerName ? [`👤 *Nombre:* ${ownerName}`] : []),
      ``,
      `Quedo atento(a) para agendar inspección en ${brand.address}.`,
    ].join("\n")
  )}`;

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="tradein-dialog-title"
      className="m-auto w-[calc(100%-1.5rem)] max-w-lg rounded-3xl bg-white p-0 text-[#111111] border border-neutral-200/80 shadow-xl open:animate-in open:fade-in open:zoom-in-95 duration-200"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200/80">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E73]">
                RETOMA Y COMPRA INMEDIATA
              </span>
              <h2
                id="tradein-dialog-title"
                className="text-xl font-bold tracking-tight text-[#111111]"
              >
                Vender mi auto / Parte de pago
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-neutral-200 flex items-center justify-center text-[#111111] cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
          Recibimos tu vehículo como pie para tu próximo seminuevo en{" "}
          <strong className="text-[#111111]">{brand.name}</strong> o lo
          compramos con pago inmediato y transferencia segura en Puerto Montt.
        </p>

        <div className="mt-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Patente
              </label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Ej: ABCD-12"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-bold uppercase text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Año
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2021"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm font-semibold tabular-nums text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
              Marca, Modelo y Versión
            </label>
            <input
              type="text"
              value={carInfo}
              onChange={(e) => setCarInfo(e.target.value)}
              placeholder="Ej: Nissan Qashqai Sense 2.0 MT"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm text-[#111111] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Kilometraje aprox.
              </label>
              <input
                type="text"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="Ej: 45.000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm tabular-nums text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6E6E73] mb-1">
                Tu Nombre
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Ej: Carolina Pérez"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-neutral-200 text-sm text-[#111111] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#F5F5F7] p-3.5 flex items-center gap-2.5 text-xs text-[#6E6E73]">
            <CheckCircle2
              className="w-4 h-4 shrink-0"
              style={{ color: brand.primaryColor }}
            />
            <span>
              Tasación transparente en 15 minutos en{" "}
              <strong className="text-[#111111]">{brand.address}</strong>.
            </span>
          </div>

          <div className="pt-2">
            <a
              href={whatsappTradeInUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => dialogRef.current?.close()}
              style={{ backgroundColor: brand.primaryColor }}
              className="w-full py-3.5 px-5 rounded-2xl text-sm font-bold text-white hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Solicitar Tasación por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}
