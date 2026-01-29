import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import type { Cooperative } from "../types/cooperative";

interface CooperativeCardProps {
  cooperative: Cooperative;
  onSelect?: () => void;
}

export default function CooperativeCard({
  cooperative,
  onSelect,
}: CooperativeCardProps) {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      <div className="p-6 space-y-5">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary-100 p-3 rounded-xl group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>

            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">
                {cooperative.nombre}
              </h3>

              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {cooperative.ciudad}
                {cooperative.provincia && `, ${cooperative.provincia}`}
              </div>

              {cooperative.direccion && (
                <p className="text-xs text-gray-500 mt-1">
                  {cooperative.direccion}
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold">
            <Star className="w-4 h-4" />
            {Number(cooperative.calificacion ?? 0).toFixed(1)}
          </div>
        </header>

        {/* Contact Info */}
        <section className="space-y-3 text-sm">
          {cooperative.telefono && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-medium">
                {cooperative.telefono}
              </span>
            </div>
          )}

          {cooperative.paginaWeb && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Globe className="w-4 h-4" />
              </div>
              <a
                href={cooperative.paginaWeb}
                target="_blank"
                rel="noreferrer"
                className="text-primary-700 font-medium hover:underline break-all"
              >
                {cooperative.paginaWeb}
              </a>
            </div>
          )}
        </section>

        {/* CTA */}
        {onSelect && (
          <button
            onClick={onSelect}
            className="w-full mt-2 bg-primary-600 text-white py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Ver detalles
          </button>
        )}
      </div>
    </article>
  );
}
