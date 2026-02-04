import { CheckCircle, AlertCircle, Home, X } from "lucide-react";

interface SuccessOnboardingModalProps {
  open: boolean;
  onClose: () => void;
  type: "success" | "already_completed";
}

export default function SuccessOnboardingModal({
  open,
  onClose,
  type,
}: SuccessOnboardingModalProps) {
  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div
          className={`${
            isSuccess
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200"
              : "bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200"
          } p-6`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`flex-shrink-0 p-3 rounded-full ${
                  isSuccess ? "bg-green-100" : "bg-blue-100"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle
                    className={`w-8 h-8 ${
                      isSuccess ? "text-green-600" : "text-blue-600"
                    }`}
                  />
                ) : (
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h2
                  className={`text-2xl font-bold mb-1 ${
                    isSuccess ? "text-gray-900" : "text-gray-900"
                  }`}
                >
                  {isSuccess
                    ? "¡Formulario Guardado!"
                    : "Formulario Ya Completado"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {isSuccess
                    ? "Tu información ha sido registrada exitosamente"
                    : "Tu información ya está registrada en nuestro sistema"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Main message */}
          <div
            className={`mb-8 p-5 rounded-lg border ${
              isSuccess
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <p
              className={`font-medium text-center ${
                isSuccess ? "text-green-900" : "text-blue-900"
              }`}
            >
              {isSuccess
                ? "Tu información personal y económica ha sido guardada. Ahora puedes solicitar créditos en cooperativas aliadas."
                : "Ya tienes un formulario de onboarding completado. Puedes acceder a tu panel para explorar opciones de crédito."}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Lo que puedes hacer ahora:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">
                  Solicitar créditos a cooperativas aliadas
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">
                  Ver el estado de tus solicitudes en tiempo real
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">
                  Comparar ofertas de diferentes cooperativas
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ir al Panel de Control
          </button>
        </div>
      </div>
    </div>
  );
}
