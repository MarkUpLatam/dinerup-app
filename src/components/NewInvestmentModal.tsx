import { useState } from "react";
import { X, DollarSign } from "lucide-react";

interface NewInvestmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number }) => void;
}

export default function NewInvestmentModal({
  open,
  onClose,
  onSubmit,
}: NewInvestmentModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [errors, setErrors] = useState<{ amount?: string }>({});

  const handleSubmit = () => {
    const newErrors: { amount?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Ingresa un monto válido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      amount: parseFloat(amount),
    });

    // Reset form
    setAmount("");
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Nueva Inversión
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Monto a Invertir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                Monto a invertir
              </div>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) {
                  setErrors({ ...errors, amount: undefined });
                }
              }}
              placeholder="Ej: 10000"
              min="0"
              step="100"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                errors.amount
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
            )}
            {amount && (
              <p className="text-xs text-gray-500 mt-2">
                Monto: ${parseFloat(amount).toLocaleString("es-EC", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-xs text-emerald-800">
              <strong>Beneficios:</strong> Obtén ganancias seguras con tasas
              competitivas en el mercado. Tu inversión estará protegida y podrás
              seguir su desempeño en tiempo real.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-800">
              <strong>Importante:</strong> Una vez confirmes esta inversión, no
              podrás cancelarla inmediatamente. Por favor verifica que el monto
              sea el correcto.
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
            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hacer Inversión
          </button>
        </div>
      </div>
    </div>
  );
}
