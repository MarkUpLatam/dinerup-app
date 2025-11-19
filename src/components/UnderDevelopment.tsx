import React from "react";
import { Hammer, Rocket, Clock } from "lucide-react";
import LogoDinerUp from "../images/LogoDinerUp.png";

const UnderDevelopment: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0,transparent_70%)] animate-pulse-slow"></div>

      <div className="relative z-10 text-center">
        <img
          src={LogoDinerUp}
          alt="DinerUp Logo"
          className="mx-auto w-36 md:w-44 mb-6 drop-shadow-2xl animate-float"
        />

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          🚧 DinerUp en desarrollo 🚀
        </h1>

        <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto mb-8">
        Muy pronto podrás acceder a una plataforma moderna y segura que te conecta con las mejores oportunidades de crédito e inversión, de forma rápida y sencilla.

        </p>

        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="flex flex-col items-center">
            <Hammer className="w-8 h-8 text-amber-400 mb-1" />
            <span className="text-xs uppercase text-blue-200">Desarrollo</span>
          </div>
          <div className="flex flex-col items-center">
            <Rocket className="w-8 h-8 text-emerald-400 mb-1" />
            <span className="text-xs uppercase text-blue-200">Innovación</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-8 h-8 text-cyan-400 mb-1" />
            <span className="text-xs uppercase text-blue-200">Próximamente</span>
          </div>
        </div>

        <div className="text-center text-sm text-blue-200">
          <p>© {new Date().getFullYear()} DinerUp. Todos los derechos reservados.</p>
          <p className="mt-1">Síguenos pronto para conocer más.</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default UnderDevelopment;
