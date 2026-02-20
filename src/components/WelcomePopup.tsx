import React, { useEffect } from "react";
import { Shield, CheckCircle, Lock, FileText } from "lucide-react";

type WelcomePopupProps = {
  onContinue: () => void;
};

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onContinue }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    document.body.style.overflow = "auto";
    onContinue();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[9999] p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full relative overflow-hidden animate-scale-in max-h-[90vh] flex flex-col border-2 border-white/20">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-secondary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-secondary/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {/* Contenido scrolleable */}
        <div className="relative z-10 p-8 overflow-y-auto custom-scrollbar">
          {/* Alert banner */}
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center text-center">
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-1">
                ¡Bienvenido(a) a Dinerop!
              </h3>
            </div>
          </div>

          {/* Features destacados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: Shield,
                label: "100% Seguro",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: CheckCircle,
                label: "Verificado",
                color: "from-emerald-500 to-teal-600",
              },
              {
                icon: Lock,
                label: "Datos Protegidos",
                color: "from-amber-500 to-orange-600",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200"
                >
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    {feature.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Contenido principal con cards */}
          <div className="space-y-6 mb-8">
            {/* Card 1: Información legal */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Plataforma Legalmente Constituida
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Este sitio web es una plataforma de gestión de créditos,
                    inversiones y contacto, legalmente constituida en la
                    República del Ecuador. Las empresas y cooperativas que
                    mantienen vínculos operativos o comerciales con esta
                    plataforma están debidamente autorizadas y supervisadas por
                    la{" "}
                    <span className="font-semibold">
                      Superintendencia de Economía Popular y Solidaria (SEPS)
                    </span>{" "}
                    y/o la{" "}
                    <span className="font-semibold">
                      Superintendencia de Bancos del Ecuador
                    </span>
                    , conforme a la normativa vigente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón mejorado */}
          <div className="flex justify-center">
            <button
              onClick={handleClose}
              className="group relative px-10 py-4 bg-gradient-to-r from-brand-secondary via-brand-secondary to-brand-dark text-white rounded-xl font-bold hover:from-brand-secondary hover:via-brand-secondary hover:to-brand-dark transition-all shadow-xl hover:shadow-brand-secondary/50 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Continuar a Dinerop
                <CheckCircle className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #1E3A8A, #1E3A8A);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #1E3A8A, #1E3A8A);
        }
      `}</style>
    </div>
  );
};

export default WelcomePopup;
