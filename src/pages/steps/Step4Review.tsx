import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function Step4Review({ data, prevStep, onSubmit, isLoading }) {
  const [accepted, setAccepted] = useState(false);

  const solicitante = data.solicitante;
  const conyuge = data.conyuge;
  const hasSpouse = solicitante.tieneConyuge && conyuge;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Confirmación Final
      </h2>

      {/* RESUMEN */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <CheckCircle size={20} className="text-blue-600" />
          Resumen de tu Información
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IDENTIDAD */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Identidad</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Nombres:</strong> {solicitante.nombres}</p>
              <p><strong>Apellidos:</strong> {solicitante.apellidos}</p>
              <p><strong>Cédula:</strong> {solicitante.cedula}</p>
              <p><strong>Fecha Nacimiento:</strong> {solicitante.fechaNacimiento}</p>
              <p><strong>Estado Civil:</strong> {solicitante.estadoCivil}</p>
            </div>
          </div>

          {/* CONTACTO */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Contacto</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Teléfono:</strong> {solicitante.telefono}</p>
              <p><strong>Ocupación:</strong> {solicitante.ocupacion}</p>
              <p><strong>Empresa:</strong> {solicitante.empresaTrabajo}</p>
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Domicilio</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Provincia:</strong> {solicitante.direccion.provincia}</p>
              <p><strong>Cantón:</strong> {solicitante.direccion.canton}</p>
              <p><strong>Barrio:</strong> {solicitante.direccion.barrio}</p>
              <p>
                <strong>Calle:</strong>{" "}
                {solicitante.direccion.callePrincipal} {solicitante.direccion.numero}
              </p>
              <p><strong>Tipo Vivienda:</strong> {solicitante.direccion.tipoVivienda}</p>
            </div>
          </div>

          {/* ECONOMÍA */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Información Económica</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Ingreso Mensual:</strong> ${solicitante.ingresoEgreso.ingresoMensual}</p>
              <p><strong>Egreso Mensual:</strong> ${solicitante.ingresoEgreso.egresoMensual}</p>
              <p><strong>Negocio:</strong> {solicitante.actividadEconomica.nombreNegocio}</p>
              <p><strong>Tiempo Actividad:</strong> {solicitante.actividadEconomica.tiempoActividad}</p>
            </div>
          </div>

          {/* CÓNYUGE */}
          {hasSpouse && (
            <div className="md:col-span-2">
              <h4 className="font-semibold text-gray-700 mb-2">Información del Cónyuge</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Nombres:</strong> {conyuge.nombres} {conyuge.apellidos}</p>
                <p><strong>Cédula:</strong> {conyuge.cedula}</p>
                <p><strong>Teléfono:</strong> {conyuge.telefono}</p>
                <p><strong>Ocupación:</strong> {conyuge.ocupacion}</p>
                <p><strong>Empresa:</strong> {conyuge.empresaTrabajo}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DECLARACIÓN */}
      <p className="text-gray-600 mb-6 leading-relaxed">
        Antes de finalizar, certifica que toda la información proporcionada es
        verdadera, completa y corresponde a tu situación actual. Esta declaración
        es obligatoria para continuar con el proceso y aplicar a futuros créditos.
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
          Declaro que la información ingresada es verídica, completa y autorizo su
          uso para la evaluación de solicitudes de crédito.
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={isLoading}
          className="px-6 py-3 rounded-xl border border-gray-400 text-gray-700
                     hover:bg-gray-100 transition disabled:opacity-50"
        >
          ← Atrás
        </button>

        <button
          onClick={onSubmit}
          disabled={!accepted || isLoading}
          className={`px-6 py-3 rounded-xl font-semibold transition shadow-md
            ${
              accepted && !isLoading
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {isLoading ? "Guardando..." : "Finalizar y Enviar"}
        </button>
      </div>
    </div>
  );
}
