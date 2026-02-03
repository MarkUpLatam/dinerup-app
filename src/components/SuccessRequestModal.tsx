import { CheckCircle, Mail, UserCheck, LogIn, FileText, Eye, X } from "lucide-react";

interface SuccessRequestModalProps {
  open: boolean;
  onClose: () => void;
  type: "CREDITO" | "INVERSION";
  email: string;
}

export default function SuccessRequestModal({
  open,
  onClose,
  type,
  email,
}: SuccessRequestModalProps) {
  if (!open) return null;

  const steps = [
    {
      icon: Mail,
      title: "Revisa tu correo",
      description: `Hemos enviado un correo de confirmación a ${email}. Revísalo para activar tu cuenta.`,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: UserCheck,
      title: "Completa tu registro",
      description: "Usa tu correo electrónico y crea una contraseña segura para tu cuenta.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: LogIn,
      title: "Inicia sesión",
      description: "Accede a tu cuenta con tu correo y contraseña.",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: FileText,
      title: "Completa el formulario",
      description: "Llena el formulario adicional con tu información para finalizar el proceso.",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Eye,
      title: "Monitorea tu solicitud",
      description: `Ve el estado de tu ${
        type === "CREDITO" ? "solicitud de crédito" : "inversión"
      } en las cooperativas aliadas de tu zona en tiempo real.`,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-6 sticky top-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  ¡Solicitud enviada exitosamente!
                </h2>
                <p className="text-gray-600 text-sm">
                  Tu {type === "CREDITO" ? "solicitud de crédito" : "solicitud de inversión"} ha
                  sido registrada en nuestro sistema
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
          <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 font-medium text-center">
              Tu solicitud está dentro de nuestro sistema. Para poder ver el estado de tus
              solicitudes a las cooperativas aliadas, completa los siguientes pasos:
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 p-2 ${step.bgColor} rounded-lg`}>
                        <StepIcon className={`w-5 h-5 ${step.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefits section */}
          <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/20 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Beneficios de completar tu registro:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Monitorea el estado de tus solicitudes en tiempo real</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Recibe notificaciones de las cooperativas</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Compara ofertas de múltiples cooperativas</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Gestiona tus inversiones de forma segura</p>
              </div>
            </div>
          </div>

          {/* Email reminder */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">📧 Importante:</span> Por favor revisa tu bandeja
              de entrada y carpeta de spam.
              <span className="font-semibold text-amber-900">{email}</span>
            </p>
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-brand-secondary to-brand-dark text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
