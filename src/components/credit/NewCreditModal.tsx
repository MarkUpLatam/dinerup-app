import { useState } from "react";
import { X, AlertCircle, DollarSign, Tag, MapPin, ChevronDown } from "lucide-react";
import { ecuadorProvinces } from "../../data/ecuadorProvinces";

interface NewCreditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; type: string }) => void;
}

const creditTypes = [
  { id: "PERSONAL", label: "Crédito Personal" },
  { id: "BUSINESS", label: "Crédito Empresarial" },
  { id: "AUTO", label: "Crédito para Auto" },
  { id: "HOME", label: "Crédito para Vivienda" },
];

export default function NewCreditModal({
  open,
  onClose,
  onSubmit,
}: NewCreditModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [creditType, setCreditType] = useState<string>("PERSONAL");
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [parroquia, setParroquia] = useState<string>("");
  const [errors, setErrors] = useState<{ amount?: string }>({});

  const selectedProvinciaData = ecuadorProvinces.Ecuador.find(
    (p) => p.provincia === province
  );

  const selectedCantonData = selectedProvinciaData?.cantones.find(
    (c) => c.nombre === city
  );

  const handleProvinceChange = (val: string) => {
    setProvince(val);
    setCity("");
    setParroquia("");
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    setParroquia("");
  };

  const handleSubmit = () => {
    const newErrors: { amount?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Ingresa un monto válido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // El onSubmit se mantiene exactamente igual que antes
    onSubmit({
      amount: parseFloat(amount),
      type: creditType,
    });

    // Reset
    setAmount("");
    setCreditType("PERSONAL");
    setProvince("");
    setCity("");
    setParroquia("");
    setErrors({});
    onClose();
  };

  if (!open) return null;

  const selectClass = (hasError?: boolean) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition appearance-none bg-white ${
      hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
    }`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Solicitar Crédito</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Tu solicitud será enviada a:</p>
              <p>
                Todas las cooperativas de tu ciudad. Estaremos atentos para
                notificarte por correo o en la plataforma cuando recibas respuestas.
              </p>
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                Monto que deseas solicitar
              </div>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({});
              }}
              placeholder="Ej: 5000"
              min="0"
              step="100"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.amount ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
            )}
            {amount && (
              <p className="text-xs text-gray-500 mt-2">
                Monto: $
                {parseFloat(amount).toLocaleString("es-EC", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>

          {/* Tipo de Crédito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-600" />
                Tipo de crédito
              </div>
            </label>
            <div className="relative">
              <select
                value={creditType}
                onChange={(e) => setCreditType(e.target.value)}
                className={selectClass()}
              >
                {creditTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Ubicación — solo visual, no afecta el submit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                Ubicación
              </div>
            </label>
            <div className="space-y-3">

              {/* Provincia */}
              <div className="relative">
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className={selectClass()}
                >
                  <option value="">Selecciona una provincia</option>
                  {ecuadorProvinces.Ecuador.map((p) => (
                    <option key={p.provincia} value={p.provincia}>
                      {p.provincia}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Cantón — se habilita al elegir provincia */}
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  disabled={!province}
                  className={`${selectClass()} disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {province ? "Selecciona un cantón" : "Primero elige una provincia"}
                  </option>
                  {selectedProvinciaData?.cantones.map((c) => (
                    <option key={c.nombre} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Parroquia — se habilita al elegir cantón */}
              <div className="relative">
                <select
                  value={parroquia}
                  onChange={(e) => setParroquia(e.target.value)}
                  disabled={!city}
                  className={`${selectClass()} disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {city ? "Selecciona una parroquia" : "Primero elige un cantón"}
                  </option>
                  {selectedCantonData?.parroquias.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

            </div>
          </div>

          {/* Aviso */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-800">
              <strong>Importante:</strong> Una vez envíes esta solicitud, no
              podrás cambiarla. Por favor verifica que todos los datos sean
              correctos.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Solicitud
          </button>
        </div>

      </div>
    </div>
  );
}
