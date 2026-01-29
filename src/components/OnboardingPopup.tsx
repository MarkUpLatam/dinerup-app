import { X, CheckCircle } from "lucide-react";

interface OnboardingPopupProps {
  open: boolean;
  title: string;
  message: string;
  primaryText: string;
  onPrimary: () => void;
  onClose: () => void;
}

export default function OnboardingPopup({
  open,
  title,
  message,
  primaryText,
  onPrimary,
  onClose,
}: OnboardingPopupProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-xl relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icono */}
        <div className="flex justify-center mb-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
          {message}
        </p>

        {/* Acción principal */}
        <button
          onClick={() => {
            onPrimary();
            onClose();
          }}
          className="w-full bg-primary-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-primary-700 transition shadow-md hover:shadow-lg"
        >
          {primaryText}
        </button>
      </div>
    </div>
  );
}
