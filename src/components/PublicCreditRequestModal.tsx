import { useState } from "react";
import { X, AlertCircle, Loader } from "lucide-react";
import { httpClient } from "../api/httpClient";
import SuccessRequestModal from "./SuccessRequestModal";

interface PublicCreditRequestModalProps {
  open: boolean;
  onClose: () => void;
  type: "CREDITO" | "INVERSION"; // Tipo de solicitud
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identification: string;
  province: string;
  city: string;
  amount: number;
  plazoMeses: number;
  type: "CREDITO" | "INVERSION";
  creditType: string;
}

interface FormErrors {
  [key: string]: string;
}

const creditTypes = [
  { id: "MICROCREDITO", label: "Microcrédito" },
  { id: "CONSUMO", label: "Consumo" },
];

export default function PublicCreditRequestModal({
  open,
  onClose,
  type,
}: PublicCreditRequestModalProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    identification: "",
    province: "",
    city: "",
    amount: 0,
    plazoMeses: 12,
    type: type,
    creditType: "MICROCREDITO",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.phone.trim() || !/^\d{7,}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Teléfono inválido (mínimo 7 dígitos)";
    }
    if (!formData.identification.trim()) {
      newErrors.identification = "La identificación es requerida";
    }
    if (!formData.province.trim()) {
      newErrors.province = "La provincia es requerida";
    }
    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }
    if (formData.amount <= 0) {
      newErrors.amount = "El monto debe ser mayor a 0";
    }
    if (formData.plazoMeses <= 0) {
      newErrors.plazoMeses = "El plazo debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["amount", "plazoMeses"].includes(name) ? parseFloat(value) || 0 : value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // Preparar datos para enviar
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        identification: formData.identification,
        province: formData.province,
        city: formData.city,
        amount: formData.amount,
        plazoMeses: formData.plazoMeses,
        type: type === "CREDITO" ? "CREDITO" : "INVERSION",
        creditType: type === "CREDITO" ? formData.creditType : "INVERSION",
      };

      // Hacer petición POST al endpoint público
      await httpClient(
        "/public-request",
        {
          baseUrl: import.meta.env.VITE_API_CREDIT_REQUESTS,
          method: "POST",
          body: dataToSend,
          auth: false, // No se requiere autenticación para solicitudes públicas
        }
      );

      // Mostrar mensaje de éxito
      setSuccessMessage(`Tu solicitud de ${type === "CREDITO" ? "crédito" : "inversión"} ha sido registrada exitosamente. Te contactaremos pronto.`);

      // Mostrar el modal de éxito
      setShowSuccessModal(true);

      // Limpiar formulario después de 500ms
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          identification: "",
          province: "",
          city: "",
          amount: 0,
          plazoMeses: 12,
          type: type,
          creditType: "MICROCREDITO",
        });
        setSuccessMessage("");
      }, 500);
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      setErrors({
        submit: "Error al enviar la solicitud. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {type === "CREDITO" ? "Solicitar Crédito" : "Realizar Inversión"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">¡Importante!</p>
              <p>
                Tu {type === "CREDITO" ? "solicitud de crédito" : "inversión"} será enviada a múltiples cooperativas en tu área. 
                Recibirás notificaciones sobre las respuestas en tu correo electrónico.
              </p>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800 text-sm">
              <p className="font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800 text-sm">
              <p className="font-semibold">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Tu apellido"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Teléfono e Identificación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Ej: +56912345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Identificación *
                </label>
                <input
                  type="text"
                  name="identification"
                  value={formData.identification}
                  onChange={handleInputChange}
                  placeholder="Ej: 123456789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.identification && (
                  <p className="mt-1 text-xs text-red-600">{errors.identification}</p>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Provincia *
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  placeholder="Tu provincia"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.province && (
                  <p className="mt-1 text-xs text-red-600">{errors.province}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Tu ciudad"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                )}
              </div>
            </div>

            {/* Monto y Tipo de Crédito */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monto solicitado *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount || ""}
                  onChange={handleInputChange}
                  placeholder="Ej: 5000"
                  min="1"
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
                )}
              </div>
              {type === "CREDITO" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de crédito *
                  </label>
                  <select
                    name="creditType"
                    value={formData.creditType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    {creditTypes.map((ct) => (
                      <option key={ct.id} value={ct.id}>
                        {ct.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Plazo en Meses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plazo en meses *
                </label>
                <input
                  type="number"
                  name="plazoMeses"
                  value={formData.plazoMeses || ""}
                  onChange={handleInputChange}
                  placeholder="Ej: 12"
                  min="1"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {errors.plazoMeses && (
                  <p className="mt-1 text-xs text-red-600">{errors.plazoMeses}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-secondary to-brand-dark text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-60 font-medium flex items-center justify-center gap-2"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                {isLoading ? "Enviando..." : "Enviar solicitud"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de éxito */}
      <SuccessRequestModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        type={type}
        email={formData.email}
      />
    </div>
  );
}
