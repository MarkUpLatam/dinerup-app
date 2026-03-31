import {
  CheckCircle,
  Mail,
  UserCheck,
  LogIn,
  FileText,
  Eye,
  X,
  ArrowRight,
} from "lucide-react";

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
      description: "Te enviamos un email para activar tu cuenta.",
    },
    {
      icon: UserCheck,
      title: "Crea tu contraseña",
      description: "Completa tu registro con una contraseña segura.",
    },
    {
      icon: LogIn,
      title: "Inicia sesión",
      description: "Accede a tu panel personal.",
    },
    {
      icon: FileText,
      title: "Completa tu perfil",
      description: "Agrega información adicional para finalizar el proceso.",
    },
    {
      icon: Eye,
      title: "Monitorea tu solicitud",
      description: `Consulta el estado de tu ${
        type === "CREDITO" ? "crédito" : "inversión"
      } en tiempo real.`,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="relative p-8 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                ¡Solicitud enviada!
              </h2>
              <p className="text-gray-600 mt-1">
                Tu {type === "CREDITO" ? "crédito" : "inversión"} fue registrado correctamente.
              </p>
              <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                Próximo paso: Activa tu cuenta
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">

          {/* Email highlight */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
            Enviamos un correo de confirmación a:
            <div className="font-semibold mt-1 break-all">{email}</div>
            <div className="text-xs mt-2 text-blue-700">
              Revisa también tu carpeta de spam o promociones.
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="relative mb-10">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200"></div>

            <div className="space-y-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;

                return (
                  <div key={index} className="relative flex items-start gap-6">
                    <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-white border-2 border-brand-secondary rounded-full">
                      <StepIcon className="w-5 h-5 text-brand-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BENEFITS */}
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-xl border border-brand-primary/10">
            <h4 className="font-semibold text-gray-900 mb-4">
              ¿Qué podrás hacer dentro de la plataforma?
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Ver respuestas de cooperativas en tiempo real</li>
              <li>• Comparar múltiples ofertas</li>
              <li>• Recibir notificaciones automáticas</li>
              <li>• Gestionar tus solicitudes desde un solo panel</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={onClose}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cerrar
            </button>

            <button
              onClick={onClose}
              className="w-full px-5 py-3 bg-gradient-to-r from-brand-secondary to-brand-dark text-white rounded-xl hover:shadow-lg transition font-semibold flex items-center justify-center gap-2"
            >
              Activar mi cuenta
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
