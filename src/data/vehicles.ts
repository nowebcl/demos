export type VehicleCategory = "SUV" | "Camionetas" | "Sedán" | "Hatchback";

export type VehicleStatus = "Disponible" | "Recién llegado" | "Reservado";

export interface VehicleSpecs {
  engine: string;
  fuel: "Bencina" | "Diésel" | "Híbrido";
  transmission: "Automática" | "Manual";
  drivetrain: string;
  color: string;
  owners: number;
  doors: number;
  consumption: string;
  airbags: number;
  plateLastDigit: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number; // CLP
  previousPrice?: number;
  mileage: number; // km
  category: VehicleCategory;
  status: VehicleStatus;
  location: string;
  featured?: boolean;
  images: string[];
  highlights: string[];
  description: string;
  specs: VehicleSpecs;
}

export interface BrandConfig {
  name: string;
  legalName: string;
  logoUrl: string;
  primaryColor: string;
  address: string;
  city: string;
  whatsapp: string;
  phoneFormatted?: string;
  schedule: string;
  instagram: string;
  email?: string;
  contactMessage?: string;
}

export const rapMotorsBrandConfig: BrandConfig = {
  name: "RAP MOTORS",
  legalName: "RAP MOTORS SPA",
  logoUrl: "/images/logo.png",
  primaryColor: "#DC2626",
  address: "Luis Ross 445, Puerto Montt",
  city: "Puerto Montt, Región de Los Lagos",
  whatsapp: "56936313589",
  phoneFormatted: "+56 9 3631 3589",
  schedule: "Lun a Vie 09:30 – 19:00 · Sáb 10:00 – 14:30",
  instagram: "@rapmotors.cl",
  email: "contacto@rapmotors.cl",
};

export const mcrCarsBrandConfig: BrandConfig = {
  name: "MCR Cars",
  legalName: "MCR CARS SPA",
  logoUrl: "/LOGOS/2.png",
  primaryColor: "#FA0002",
  address: "Rómulo Correa 0945 casa 27, Punta Arenas",
  city: "Punta Arenas, Región de Magallanes",
  whatsapp: "56996134771",
  phoneFormatted: "+56 9 9613 4771",
  schedule: "Lun 10:00 – 18:30 · Mar a Vie 10:00 – 19:00",
  instagram: "@mcrcars30",
  email: "Mcrcars30@gmail.com",
};

export const demoBrandConfig: BrandConfig = {
  name: "demo.",
  legalName: "DEMO AUTOMOTRIZ SPA",
  logoUrl: "/images/demo-logo.svg",
  primaryColor: "#111111",
  address: "Av. Vitacura 4500, Santiago",
  city: "Santiago, Región Metropolitana",
  whatsapp: "56987843957",
  phoneFormatted: "+56 9 8784 3957",
  schedule: "Lun a Vie 09:00 – 19:00 · Sáb 10:00 – 14:00",
  instagram: "@demo.automotriz",
  email: "contacto@demo.cl",
  contactMessage: "QUIERO CONTRATAR",
};

export const defaultBrandConfig: BrandConfig = rapMotorsBrandConfig;

export const initialVehicles: Vehicle[] = [
  {
    id: "toyota-hilux-srv-2023",
    brand: "Toyota",
    model: "Hilux",
    version: "2.8 SRV 4x4 AT",
    year: 2023,
    price: 31890000,
    previousPrice: 32990000,
    mileage: 28400,
    category: "Camionetas",
    status: "Recién llegado",
    location: "Luis Ross 445, Puerto Montt",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Único dueño · Mantenciones en Bruno Fritsch",
      "Tracción 4x4 con bloqueo de diferencial trasero",
      "Apple CarPlay & Android Auto inalámbrico",
      "Facturable (IVA incluido)",
    ],
    description:
      "Impecable Toyota Hilux 2.8 Turbo Diésel SRV automática 4x4. Equipada con lona marítima, cubre pick-up original, neumáticos Bridgestone Dueler al 85% y historial completo de mantenciones timbradas. Lista para trabajo pesado o uso familiar en el sur de Chile.",
    specs: {
      engine: "2.8L Turbo Diésel (204 HP)",
      fuel: "Diésel",
      transmission: "Automática",
      drivetrain: "4WD (4x4 High / Low)",
      color: "Blanco Perlado",
      owners: 1,
      doors: 4,
      consumption: "11.8 km/l mixto",
      airbags: 7,
      plateLastDigit: "4",
    },
  },
  {
    id: "mazda-cx5-signature-2022",
    brand: "Mazda",
    model: "CX-5",
    version: "2.5T Signature AWD",
    year: 2022,
    price: 23490000,
    previousPrice: 24200000,
    mileage: 34200,
    category: "SUV",
    status: "Disponible",
    location: "Luis Ross 445, Puerto Montt",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Audio Premium Bose® de 10 parlantes",
      "Tapiz de cuero Nappa Caturra Brown",
      "Cámara 360° y Head-Up Display proyectado",
      "Tracción inteligente i-Activ AWD",
    ],
    description:
      "Versión tope de línea Signature con motor 2.5 Turbo Skyactiv-G de 228 HP. Acabados interiores en madera genuina Abachi y cuero Nappa. Seguridad activa completa i-Activsense con control crucero adaptativo y frenado autónomo.",
    specs: {
      engine: "2.5L Turbo Skyactiv-G (228 HP)",
      fuel: "Bencina",
      transmission: "Automática",
      drivetrain: "AWD Integral",
      color: "Gris Polimetal",
      owners: 1,
      doors: 5,
      consumption: "11.2 km/l mixto",
      airbags: 6,
      plateLastDigit: "8",
    },
  },
  {
    id: "peugeot-3008-gt-2023",
    brand: "Peugeot",
    model: "3008",
    version: "1.5 BlueHDi GT EAT8",
    year: 2023,
    price: 24990000,
    mileage: 19800,
    category: "SUV",
    status: "Recién llegado",
    location: "Luis Ross 445, Puerto Montt",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Caja automática japonesa Aisin de 8 velocidades",
      "Peugeot i-Cockpit® digital 3D",
      "Techo panorámico Black Diamond practicable",
      "Rendimiento extraordinario hasta 21 km/l en carretera",
    ],
    description:
      "Diseño europeo vanguardista y eficiencia insuperable. Este Peugeot 3008 GT BlueHDi combina el motor turbodiésel más eficiente de su segmento con equipamiento de lujo, asientos en Alcántara calefaccionados con masaje y faros Full LED adaptativos.",
    specs: {
      engine: "1.5L BlueHDi Turbo Diésel",
      fuel: "Diésel",
      transmission: "Automática",
      drivetrain: "2WD con Grip Control",
      color: "Blanco Nacarado / Techo Negro",
      owners: 1,
      doors: 5,
      consumption: "18.4 km/l mixto",
      airbags: 6,
      plateLastDigit: "2",
    },
  },
  {
    id: "ford-ranger-xlt-2022",
    brand: "Ford",
    model: "Ranger",
    version: "3.2 TDCi XLT 4x4 AT",
    year: 2022,
    price: 25890000,
    previousPrice: 26900000,
    mileage: 46500,
    category: "Camionetas",
    status: "Disponible",
    location: "Luis Ross 445, Puerto Montt",
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Motor 3.2L Puma de 5 cilindros y 200 HP",
      "Sistema multimedia SYNC 3 con pantalla de 8”",
      "Sensores delanteros y traseros + Cámara HD",
      "Revisión pre-compra aprobada en 120 puntos",
    ],
    description:
      "La reconocida Ford Ranger 3.2 XLT con motor de cinco cilindros y 470 Nm de torque. Robustez comprobada para caminos australes, equipada con pisaderas laterales originales, barra antivuelco cromada y climatizador bizona.",
    specs: {
      engine: "3.2L TDCi 5 Cilindros (200 HP)",
      fuel: "Diésel",
      transmission: "Automática",
      drivetrain: "4x4 Electrónico c/ Reductora",
      color: "Gris Magnético",
      owners: 1,
      doors: 4,
      consumption: "10.6 km/l mixto",
      airbags: 7,
      plateLastDigit: "7",
    },
  },
  {
    id: "suzuki-swift-sport-2023",
    brand: "Suzuki",
    model: "Swift",
    version: "1.4T Boosterjet Sport",
    year: 2023,
    price: 15490000,
    mileage: 21300,
    category: "Hatchback",
    status: "Disponible",
    location: "Luis Ross 445, Puerto Montt",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Chasis ultraligero Heartect (970 kg)",
      "Butacas deportivas semi-bucket con bordado Sport",
      "Doble salida de escape y difusor en fibra",
      "Amortiguadores Monroe® de tarado deportivo",
    ],
    description:
      "Ágil, eficiente y entretenido de conducir. Suzuki Swift Sport 1.4 Boosterjet fabricado en Japón, en estado igual a nuevo. Sin modificaciones mecánicas, con sus dos llaves inteligentes y neumáticos Continental ContiSportContact.",
    specs: {
      engine: "1.4L Boosterjet Turbo (138 HP)",
      fuel: "Bencina",
      transmission: "Manual",
      drivetrain: "Delantera (FWD)",
      color: "Blanco Perla",
      owners: 1,
      doors: 5,
      consumption: "16.1 km/l mixto",
      airbags: 6,
      plateLastDigit: "1",
    },
  },
  {
    id: "subaru-forester-xs-2022",
    brand: "Subaru",
    model: "Forester",
    version: "2.0i AWD CVT XS EyeSight",
    year: 2022,
    price: 21990000,
    previousPrice: 22800000,
    mileage: 38900,
    category: "SUV",
    status: "Disponible",
    location: "Luis Ross 445, Puerto Montt",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Tracción permanente Symmetrical All-Wheel Drive",
      "Asistencia avanzada Subaru EyeSight® de 4ta Gen",
      "Sistema X-MODE para nieve, barro y ripio",
      "Despeje libre al suelo líder de 220 mm",
    ],
    description:
      "El SUV predilecto del sur de Chile. Subaru Forester con motor Boxer 2.0 y tracción integral simétrica permanente. Máxima seguridad familiar en lluvia y caminos resbaladizos, con maletero de gran apertura y mantenciones al día.",
    specs: {
      engine: "2.0L Boxer 16V (156 HP)",
      fuel: "Bencina",
      transmission: "Automática",
      drivetrain: "Symmetrical AWD",
      color: "Plata Hielo Metálico",
      owners: 1,
      doors: 5,
      consumption: "13.5 km/l mixto",
      airbags: 7,
      plateLastDigit: "5",
    },
  },
  {
    id: "volkswagen-taos-highline-2023",
    brand: "Volkswagen",
    model: "Taos",
    version: "1.4 TSI 250 Highline AT",
    year: 2023,
    price: 20490000,
    mileage: 16200,
    category: "SUV",
    status: "Reservado",
    location: "Luis Ross 445, Puerto Montt",
    images: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Parrilla frontal iluminada con tecnología IQ.Light",
      "Active Info Display de 10.25” + VW Play 10”",
      "Techo solar panorámico e iluminación ambiental",
      "Garantía de fábrica vigente",
    ],
    description:
      "Volkswagen Taos Highline tope de gama con motor 1.4 TSI de 150 HP y 250 Nm de torque acoplado a caja Tiptronic de 6 velocidades. Amplio espacio en plazas traseras, iluminación matricial IQ.Light y estado inmaculado.",
    specs: {
      engine: "1.4L TSI Turbo (150 HP / 250 Nm)",
      fuel: "Bencina",
      transmission: "Automática",
      drivetrain: "Delantera (FWD)",
      color: "Gris Platino",
      owners: 1,
      doors: 5,
      consumption: "14.2 km/l mixto",
      airbags: 6,
      plateLastDigit: "9",
    },
  },
  {
    id: "bmw-320i-msport-2022",
    brand: "BMW",
    model: "Serie 3",
    version: "320i M Sport LCI 2.0 TwinPower",
    year: 2022,
    price: 32990000,
    previousPrice: 34500000,
    mileage: 24900,
    category: "Sedán",
    status: "Recién llegado",
    location: "Luis Ross 445, Puerto Montt",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85",
    ],
    highlights: [
      "Paquete aerodinámico y suspensión M Sport original",
      "BMW Live Cockpit Professional con pantalla curva",
      "Caja deportiva Steptronic de 8 velocidades con levas",
      "Mantenciones en Williamson Balfour Motors",
    ],
    description:
      "El referente mundial de los sedanes deportivos. BMW 320i M Sport generación G20 con paquete M de fábrica, llantas M de 18 pulgadas bicolor, tapiz Alcántara/Sensatec con costuras azules y asistente de retroceso autónomo de 50 metros.",
    specs: {
      engine: "2.0L TwinPower Turbo (184 HP)",
      fuel: "Bencina",
      transmission: "Automática",
      drivetrain: "Trasera (RWD)",
      color: "Blanco Alpino",
      owners: 1,
      doors: 4,
      consumption: "14.8 km/l mixto",
      airbags: 6,
      plateLastDigit: "3",
    },
  },
];

export function formatCLP(amount: number): string {
  return "$" + Math.round(amount).toLocaleString("es-CL");
}

export function formatKilometers(km: number): string {
  return Math.round(km).toLocaleString("es-CL") + " km";
}

export function formatRut(value: string): string {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length <= 1) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedBody}-${dv}`;
}
