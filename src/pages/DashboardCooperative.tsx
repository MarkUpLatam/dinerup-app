import { useEffect, useState } from "react";
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getMyCooperativeRequests,
  decideCreditRequest,
} from "../api/creditRequests.api";

import type { CooperativeCreditRequest } from "../types/credit";
import { CreditEstado } from "../types/creditEstado";
import { CreditDecision } from "../types/creditDecision";

/* =======================
   TYPES
   ======================= */

type Filter = "all" | CreditEstado;

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

/* =======================
   COMPONENT
   ======================= */

export default function DashboardCooperative() {
  const [requests, setRequests] = useState<CooperativeCreditRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getMyCooperativeRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================
     DECISION HANDLER
     ======================= */

  const handleDecision = async (
    solicitudId: number,
    decision: CreditDecision
  ) => {
    try {
      setProcessingId(solicitudId);
      await decideCreditRequest(solicitudId, decision);

      // backend = fuente de verdad
      await loadRequests();
    } catch (error) {
      console.error("Error al registrar decisión:", error);
      alert("No se pudo registrar la decisión");
    } finally {
      setProcessingId(null);
    }
  };

  /* =======================
     FILTERS & STATS
     ======================= */

  const filteredRequests = requests.filter((r) =>
    filter === "all" ? true : r.estado === filter
  );

  const stats = {
    total: requests.length,
    enviada: requests.filter((r) => r.estado === CreditEstado.ENVIADA).length,
    preAprobada: requests.filter(
      (r) => r.estado === CreditEstado.PRE_APROBADA
    ).length,
    aprobada: requests.filter((r) => r.estado === CreditEstado.APROBADA).length,
    rechazada: requests.filter((r) => r.estado === CreditEstado.RECHAZADA).length,
  };

  /* =======================
     UI
     ======================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Bienvenid@ a tu panel de cooperativa
          </h1>
          <p className="text-gray-600 text-lg">
            Solicitudes de crédito o inversiones recibidas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatCard label="Total" value={stats.total} icon={<FileText />} />
          <StatCard label="Enviadas" value={stats.enviada} icon={<Clock />} />
          <StatCard
            label="Pre aprobadas"
            value={stats.preAprobada}
            icon={<TrendingUp />}
          />
          <StatCard
            label="Rechazadas"
            value={stats.rechazada}
            icon={<TrendingUp />}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex gap-3 flex-wrap">
            <FilterButton
              label="Todas"
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
            <FilterButton
              label="Enviadas"
              active={filter === CreditEstado.ENVIADA}
              onClick={() => setFilter(CreditEstado.ENVIADA)}
            />
            <FilterButton
              label="Pre aprobadas"
              active={filter === CreditEstado.PRE_APROBADA}
              onClick={() => setFilter(CreditEstado.PRE_APROBADA)}
            />
            <FilterButton
              label="Rechazadas"
              active={filter === CreditEstado.RECHAZADA}
              onClick={() => setFilter(CreditEstado.RECHAZADA)}
            />
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <Loading />
        ) : filteredRequests.length === 0 ? (
          <Empty />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredRequests.map((r) => (
              <div
                key={r.solicitudId}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {r.solicitudId}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Solicitud #{r.solicitudId}
                        </h3>
                      </div>

                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                          r.estado === CreditEstado.ENVIADA
                            ? "bg-yellow-100 text-yellow-700"
                            : r.estado === CreditEstado.PRE_APROBADA
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.estado}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-xs text-blue-700 font-medium mb-1">
                          Monto solicitado
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${r.montoSolicitado.toLocaleString("es-EC")}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Tipo de crédito
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {r.tipo}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-medium">
                        Fecha de solicitud
                      </p>
                      <p className="text-sm text-gray-800 font-medium mt-1">
                        {new Date(r.fechaSolicitud).toLocaleString("es-EC")}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 flex gap-4">
                      <User className="w-10 h-10 text-gray-400" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm mb-2">
                          Información del solicitante
                        </p>
                        <p className="text-gray-600 text-sm">
                          Nombre:{" "}
                          <span className="italic text-gray-400">
                            No disponible
                          </span>
                        </p>
                        <button
                          disabled
                          className="text-blue-600 text-sm mt-2 cursor-not-allowed"
                        >
                          Ver información completa →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:w-64 flex flex-col justify-center gap-3">
                    <button
                      onClick={() =>
                        handleDecision(
                          r.solicitudId,
                          CreditDecision.PRE_APROBAR
                        )
                      }
                      disabled={
                        r.estado !== CreditEstado.ENVIADA ||
                        processingId === r.solicitudId
                      }
                      className={`w-full py-3 rounded-xl text-sm font-semibold ${
                        r.estado === CreditEstado.ENVIADA
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {processingId === r.solicitudId
                        ? "Procesando..."
                        : "✓ Pre-aprobar"}
                    </button>

                    <button
                      onClick={() =>
                        handleDecision(
                          r.solicitudId,
                          CreditDecision.RECHAZAR
                        )
                      }
                      disabled={
                        r.estado !== CreditEstado.ENVIADA ||
                        processingId === r.solicitudId
                      }
                      className={`w-full py-3 rounded-xl text-sm font-semibold ${
                        r.estado === CreditEstado.ENVIADA
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {processingId === r.solicitudId
                        ? "Procesando..."
                        : "✕ Rechazar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* =======================
   AUX COMPONENTS
   ======================= */

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-medium ${
        active ? "bg-primary-600 text-white" : "bg-white border"
      }`}
    >
      {label}
    </button>
  );
}

function Loading() {
  return (
    <div className="bg-white rounded-xl shadow-md p-16 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
      <p className="mt-6 text-gray-600 font-medium text-lg">
        Cargando solicitudes...
      </p>
    </div>
  );
}

function Empty() {
  return (
    <div className="bg-white rounded-xl shadow-md p-16 text-center">
      <FileText className="w-10 h-10 text-gray-400 mx-auto mb-4" />
      <p className="text-xl font-semibold text-gray-700">
        No hay solicitudes
      </p>
    </div>
  );
}
