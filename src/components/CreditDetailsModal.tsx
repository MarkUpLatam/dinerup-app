import { useEffect, useState } from "react";
import { X, Calendar, DollarSign, TrendingUp, Building2, Loader, CheckCircle } from "lucide-react";
import type { CreditRequest, CreditRequestCooperative } from "../types/credit";
import { CreditEstado } from "../types/creditEstado";
import { getCreditRequestCooperatives, acceptCreditCooperative } from "../api/creditRequests.api";

interface CreditDetailsModalProps {
  open: boolean;
  request: CreditRequest;
  onClose: () => void;
}

const statusMap: Record<
  CreditEstado,
  {
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  [CreditEstado.ENVIADA]: {
    label: "Enviada",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  [CreditEstado.PRE_APROBADA]: {
    label: "Pre aprobada",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  [CreditEstado.APROBADA]: {
    label: "Aprobada",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  [CreditEstado.RECHAZADA]: {
    label: "Rechazada",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
};

export default function CreditDetailsModal({ open, request, onClose }: CreditDetailsModalProps) {
  const [cooperatives, setCooperatives] = useState<CreditRequestCooperative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCooperativeId, setSelectedCooperativeId] = useState<number | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    if (open && request) {
      loadCooperatives();
    }
  }, [open, request]);

  const loadCooperatives = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCreditRequestCooperatives(request.solicitudId);
      setCooperatives(data);
    } catch (err) {
      console.error("Error loading cooperatives:", err);
      setError("Error al cargar las cooperativas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptCooperative = async (cooperativaId: number) => {
    setIsAccepting(true);
    setAcceptError(null);
    try {
      await acceptCreditCooperative(request.solicitudId, cooperativaId);
      setSelectedCooperativeId(cooperativaId);
    } catch (err) {
      console.error("Error accepting cooperative:", err);
      
      // Extraer el mensaje de error del servidor o usar uno por defecto
      let errorMessage = "Error al aceptar la solicitud. Por favor intenta de nuevo.";
      
      if (err instanceof Error) {
        // Si el error tiene un mensaje específico del servidor, usarlo
        if (err.message) {
          errorMessage = err.message;
        }
        // Mapear errores específicos por status HTTP
        const status = (err as any).status;
        if (status === 409) {
          // El error 409 ya debería tener el mensaje del servidor
          errorMessage = err.message || "Esta solicitud ya fue aceptada previamente en una entidad financiera";
        } else if (status === 400) {
          errorMessage = err.message || "Los datos de la solicitud no son válidos";
        } else if (status === 401) {
          errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.";
        } else if (status === 403) {
          errorMessage = "No tienes permiso para aceptar esta solicitud.";
        }
      }
      
      setAcceptError(errorMessage);
    } finally {
      setIsAccepting(false);
    }
  };

  if (!open) return null;

  const status = statusMap[request.estado];

  const montoSeguro =
    typeof request.monto === "number"
      ? `$${request.monto.toLocaleString("es-EC", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "—";

  const fechaSegura = request.fechaSolicitud
    ? new Date(request.fechaSolicitud).toLocaleDateString("es-EC", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalle de Solicitud #{request.solicitudId}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estado */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-xs text-gray-600 font-medium mb-2">Estado actual</p>
            <div className="flex items-center gap-3">
              <span className={`${status.bgColor} ${status.color} px-4 py-2 rounded-lg font-semibold text-sm`}>
                {status.label}
              </span>
            </div>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monto */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Monto solicitado</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">{montoSeguro}</p>
            </div>

            {/* Tipo */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Tipo de solicitud</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {request.tipo === "CREDITO" ? "Crédito" : "Inversión"}
              </p>
            </div>
          </div>

          {/* Fechas y cantidad */}
          <div className="space-y-4">

            {request.cantidadSolicitudesEnviadas !== undefined && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Entidades que recibieron tu solicitud</span>
                </div>
                <span className="font-semibold text-gray-800">{request.cantidadSolicitudesEnviadas}</span>
              </div>
            )}
          </div>

          {/* Respuestas de cooperativas */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Respuestas de cooperativas</h3>
              <p className="text-sm text-gray-600">
                Selecciona la cooperativa con la que deseas continuar. Una vez que aceptes una solicitud, 
                <strong> no podrás cambiar tu selección.</strong>
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 text-primary-600 animate-spin mr-2" />
                <span className="text-gray-600">Cargando cooperativas...</span>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <p className="text-sm">{error}</p>
              </div>
            ) : cooperatives.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-amber-700">
                <p className="text-sm">No hay respuestas de cooperativas aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cooperatives.map((coop) => {
                  const isSelected = selectedCooperativeId === coop.cooperativaId;
                  const hasSelection = selectedCooperativeId !== null;

                  return (
                    <div
                      key={coop.cooperativaId}
                      className={`rounded-xl border-2 transition-all overflow-hidden ${
                        isSelected
                          ? "bg-green-50 border-green-300 shadow-md"
                          : "bg-white border-gray-200 hover:shadow-md"
                      }`}
                    >
                      {/* Header del card */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className={`${
                                isSelected ? "bg-green-100" : "bg-primary-100"
                              } p-2 rounded-lg flex-shrink-0`}
                            >
                              {isSelected ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Building2 className="w-5 h-5 text-primary-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">
                                {coop.nombreCooperativa}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Fecha de respuesta: {new Date(coop.fechaActualizacion).toLocaleDateString(
                                  "es-EC",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-3 py-1 rounded-lg font-semibold text-xs whitespace-nowrap ${
                                coop.estado === "PRE_APROBADA"
                                  ? "bg-green-100 text-green-700"
                                  : coop.estado === "APROBADA"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {coop.estado === "PRE_APROBADA"
                                ? "Pre aprobada"
                                : coop.estado === "APROBADA"
                                ? "Aprobada"
                                : coop.estado}
                            </span>
                            <button
                              onClick={() => handleAcceptCooperative(coop.cooperativaId)}
                              disabled={(hasSelection && !isSelected) || isAccepting}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1 ${
                                isSelected
                                  ? "bg-green-600 text-white cursor-default"
                                  : hasSelection
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-primary-600 text-white hover:bg-primary-700 cursor-pointer"
                              } ${isAccepting ? "opacity-75" : ""}`}
                            >
                              {isAccepting && <Loader className="w-3 h-3 animate-spin" />}
                              {isSelected ? "✓ Aceptada" : isAccepting ? "Aceptando..." : "Aceptar"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Detalles financieros compactos */}
                      <div className="p-4 space-y-2 text-sm">
                        <div className="flex justify-between items-center text-gray-700">
                          <span className="text-gray-600">Plazo:</span>
                          <span className="font-semibold">{coop.plazoMeses} meses</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-700">
                          <span className="text-gray-600">Tipo de Crédito:</span>
                          <span className="font-semibold">
                            {coop.tipoCredito === "MICROCREDITO" ? "Microcrédito" : coop.tipoCredito}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-gray-700">
                          <span className="text-gray-600">Tasa Anual:</span>
                          <span className="font-semibold">{coop.tasaAnual}%</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-700">
                          <span className="text-gray-600">Cuota Mensual:</span>
                          <span className="font-semibold">
                            ${coop.cuotaMensual.toLocaleString("es-EC", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center text-gray-700">
                          <span className="text-gray-600">Interés Total:</span>
                          <span className="font-semibold text-red-600">
                            ${coop.interesTotal.toLocaleString("es-EC", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-gray-800 font-bold">
                          <span>Total a Pagar:</span>
                          <span>
                            ${coop.totalPagar.toLocaleString("es-EC", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {acceptError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <p className="text-sm">{acceptError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
