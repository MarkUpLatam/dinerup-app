import { useState } from "react";

export default function Step4Review({ data, prevStep, onSubmit }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Confirmación Final
      </h2>

      <p className="text-gray-600 mb-6 leading-relaxed">
        Antes de finalizar, certifica que toda la información proporcionada es 
        verdadera, completa y corresponde a tu situación actual. Esta declaración 
        es obligatoria para continuar con el proceso y aplicar a futuros créditos 
        dentro de la plataforma.
      </p>

      <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
        <input
          id="accept"
          type="checkbox"
          checked={accepted}
          onChange={() => setAccepted(!accepted)}
          className="mt-1 w-5 h-5 rounded border-gray-400 text-primary-600 focus:ring-primary-600 cursor-pointer"
        />

        <label htmlFor="accept" className="text-gray-700 text-sm cursor-pointer">
          Declaro que la información ingresada en el formulario es verídica, 
          completa y autorizo su uso para la evaluación de solicitudes de 
          crédito según las políticas de la plataforma.
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-xl border border-gray-400 text-gray-700 
                     hover:bg-gray-100 transition"
        >
          ← Atrás
        </button>

        <button
          onClick={onSubmit}
          disabled={!accepted}
          className={`px-6 py-3 rounded-xl font-semibold transition shadow-md 
            ${accepted 
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Finalizar y Enviar
        </button>
      </div>
    </div>
  );
}
