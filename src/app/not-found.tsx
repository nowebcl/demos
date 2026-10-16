import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
      <h2 className="text-3xl font-bold tracking-tight text-[#111111]">
        Página no encontrada
      </h2>
      <p className="mt-2 text-sm text-[#6E6E73]">
        No pudimos encontrar el recurso solicitado.
      </p>
      <Link
        href="/"
        className="mt-6 px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
