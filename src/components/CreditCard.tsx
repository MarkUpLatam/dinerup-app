import { useState } from "react";
import {
  Calendar,
  DollarSign,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Wallet,
  ArrowRight,
} from "lucide-react";

import type { CreditRequest } from "../types/credit";
import { CreditEstado } from "../types/creditEstado";
import CreditDetailsModal from "./CreditDetailsModal";

interface CreditCardProps {
  request: CreditRequest;
}

/** =========================
 *  MAPA DE ESTADOS
 *  ========================= */
const statusMap: Record<
  CreditEstado,
  {
    label: string;
    color: string;
    icon: any;
    dotColor: string;
  }
> = {
  [CreditEstado.ENVIADA]: {
    label: "Enviada",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
    dotColor: "bg-blue-500",
  },
  [CreditEstado.PRE_APROBADA]: {
    label: "Pre aprobada",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: TrendingUp,
    dotColor: "bg-green-500",
  },
  [CreditEstado.APROBADA]: {
    label: "Aprobada",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
    dotColor: "bg-green-500",
  },
  [CreditEstado.RECHAZADA]: {
    label: "Rechazada",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
    dotColor: "bg-red-500",
  },
};

/** =========================
 *  MAPA DE TIPOS
 *  ========================= */
const tipoMap = {
  CREDITO: {
    label: "Crédito",
    bgColor: "bg-blue-500",
    bgLight: "bg-blue-100",
    textColor: "text-blue-600",
    icon: TrendingUp,
  },
  INVERSION: {
    label: "Inversión",
    bgColor: "bg-purple-500",
    bgLight: "bg-purple-100",
    textColor: "text-purple-600",
    icon: Wallet,
  },
};

export default function CreditCard({ request }: CreditCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (!request) return null;

  /** Estado */
  const status = statusMap[request.estado] ?? {
    label: request.estado ?? "Desconocido",
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: Clock,
    dotColor: "bg-gray-500",
  };
  const StatusIcon = status.icon;

  /** Tipo */
  const tipoInfo =
    tipoMap[request.tipo as keyof typeof tipoMap] ?? {
      label: request.tipo ?? "—",
      bgColor: "bg-gray-500",
      bgLight: "bg-gray-100",
      textColor: "text-gray-700",
      icon: DollarSign,
    };
  const TipoIcon = tipoInfo.icon;

  /** Monto */
  const montoSeguro =
    typeof request.monto === "number"
      ? `$${request.monto.toLocaleString("es-EC", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "—";

  /** Fecha */
  const fechaSegura = request.fechaSolicitud
    ? new Date(request.fechaSolicitud).toLocaleDateString("es-EC", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <>
      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Accent superior */}
        <div className={`h-1.5 ${tipoInfo.bgColor}`} />

      <div className="p-6 space-y-5">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`${tipoInfo.bgLight} p-3 rounded-xl transition-transform group-hover:scale-105`}
            >
              <TipoIcon className={`w-6 h-6 ${tipoInfo.textColor}`} />
            </div>

            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">
                {tipoInfo.label}
              </h3>
              <p className="text-xs text-gray-500">
                Solicitud #{request.solicitudId}
              </p>
            </div>
          </div>

          {/* Estado */}
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.color} text-xs font-semibold`}
          >
            <span
              className={`w-2 h-2 rounded-full ${status.dotColor}`}
            />
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </span>
        </header>

        {/* Monto */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium mb-1">
            Monto solicitado
          </p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-gray-800">
              {montoSeguro}
            </p>
            <div className="bg-white p-2.5 rounded-lg shadow-sm">
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </section>

        {/* Detalles */}
        <section className="space-y-3">
          {/* Fecha */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Fecha de solicitud</span>
            </div>
            <span className="font-semibold text-gray-800">
              {fechaSegura}
            </span>
          </div>

          {/* Cantidad de solicitudes enviadas */}
          {request.cantidadSolicitudesEnviadas !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Cantidad de entidades financieras que recibieron tu solicitud</span>
              </div>
              <span className="font-semibold text-gray-800">
                {request.cantidadSolicitudesEnviadas}
              </span>
            </div>
          )}
        </section>

        {/* Botón Ver Información - solo si no está rechazada */}
        {request.estado !== 'RECHAZADA' && (
          <button 
            onClick={() => setShowDetailsModal(true)}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-4"
          >
            Detalle de mi solicitud
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </article>

    <CreditDetailsModal 
      open={showDetailsModal}
      request={request}
      onClose={() => setShowDetailsModal(false)}
    />
    </>
  );
}
