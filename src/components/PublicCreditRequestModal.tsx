import { useState } from "react";
import { X, AlertCircle, Loader } from "lucide-react";
import { httpClient } from "../api/httpClient";
import SuccessRequestModal from "./SuccessRequestModal";
import { ecuadorProvinces } from "../data/ecuadorProvinces";

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

// Validaciones personalizadas
const validations = {
  // Valida cédula ecuatoriana usando el algoritmo oficial
  isValidEcuadorianID: (id: string): boolean => {
    const cleanID = id.replace(/\D/g, "");
    
    // Debe tener exactamente 10 dígitos
    if (cleanID.length !== 10) return false;

    // El dígito verificador está en la posición 9
    const digits = cleanID.split("").map(Number);
    const verifierDigit = digits[9];

    // Algoritmo de validación de cédula ecuatoriana
    const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      let product = digits[i] * multipliers[i];
      // Si el producto es >= 10, restar 9
      if (product >= 10) {
        product -= 9;
      }
      sum += product;
    }

    const calculatedVerifier = (10 - (sum % 10)) % 10;
    return verifierDigit === calculatedVerifier;
  },

  // Valida que solo contenga letras y espacios
  isOnlyLetters: (value: string): boolean => {
    return /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value);
  },

  // Valida que sea un email válido
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Valida teléfono ecuatoriano (10 dígitos)
  isValidPhone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length === 10;
  },
};


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

  // Obtener ciudades disponibles para la provincia seleccionada
  const getAvailableCities = (): string[] => {
    const provinceData = ecuadorProvinces.Ecuador.find(
      (p) => p.provincia === formData.province
    );
    return provinceData ? provinceData.ciudades : [];
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    } else if (!validations.isOnlyLetters(formData.firstName)) {
      newErrors.firstName = "El nombre solo puede contener letras";
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    } else if (!validations.isOnlyLetters(formData.lastName)) {
      newErrors.lastName = "El apellido solo puede contener letras";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!validations.isValidEmail(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!validations.isValidPhone(formData.phone)) {
      newErrors.phone = "El teléfono debe tener 10 dígitos";
    }

    // Validar cédula ecuatoriana
    if (!formData.identification.trim()) {
      newErrors.identification = "La identificación es requerida";
    } else if (!validations.isValidEcuadorianID(formData.identification)) {
      newErrors.identification = "La cédula no es válida. Verifica los dígitos";
    }

    // Validar provincia
    if (!formData.province.trim()) {
      newErrors.province = "La provincia es requerida";
    }

    // Validar ciudad
    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    // Validar monto
    if (formData.amount <= 0) {
      newErrors.amount = "El monto debe ser mayor a 0";
    } else if (formData.amount > 999999999) {
      newErrors.amount = "El monto es demasiado alto";
    }

    // Validar plazo
    if (formData.plazoMeses <= 0) {
      newErrors.plazoMeses = "El plazo debe ser mayor a 0";
    } else if (formData.plazoMeses > 360) {
      newErrors.plazoMeses = "El plazo no puede ser mayor a 360 meses";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Aplicar restricciones en tiempo real
    switch (name) {
      case "firstName":
      case "lastName":
        // Solo letras y espacios
        finalValue = value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, "");
        break;

      case "identification":
        // Solo números (para cédula ecuatoriana)
        finalValue = value.replace(/\D/g, "").slice(0, 10);
        break;

      case "phone":
        // Solo números (teléfono ecuatoriano)
        finalValue = value.replace(/\D/g, "").slice(0, 10);
        break;

      case "province":
        // Cuando cambia la provincia, resetear la ciudad
        setFormData((prev) => ({
          ...prev,
          province: value,
          city: "", // Resetear ciudad
        }));
        // Limpiar error del campo
        if (errors.province) {
          setErrors((prev) => ({ ...prev, province: "" }));
        }
        return;

      case "city":
      case "creditType":
        // Estos valores se usan como están
        break;

      case "amount":
      case "plazoMeses":
        // Solo números
        finalValue = value.replace(/\D/g, "");
        break;

      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        ["amount", "plazoMeses"].includes(name) && finalValue
          ? parseFloat(finalValue)
          : finalValue,
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
                  placeholder="Ej: Juan"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.firstName
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-brand-primary"
                  }`}
                  maxLength={50}
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
                  placeholder="Ej: García"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.lastName
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-brand-primary"
                  }`}
                  maxLength={50}
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
                placeholder="ejemplo@correo.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  errors.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-brand-primary"
                }`}
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
                  placeholder="Ej: 0987654321"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-brand-primary"
                  }`}
                  maxLength={10}
                />
                {formData.phone && (
                  <p className="mt-1 text-xs text-gray-500">{formData.phone.length}/10 dígitos</p>
                )}
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
                  placeholder="Ej: 1234567890"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.identification
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-brand-primary"
                  }`}
                  maxLength={10}
                />
                {formData.identification && (
                  <p className="mt-1 text-xs text-gray-500">{formData.identification.length}/10 dígitos</p>
                )}
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
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.province
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-brand-primary"
                  }`}
                >
                  <option value="">Selecciona una provincia</option>
                  {ecuadorProvinces.Ecuador.map((province) => (
                    <option key={province.provincia} value={province.provincia}>
                      {province.provincia}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="mt-1 text-xs text-red-600">{errors.province}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ciudad *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!formData.province}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    !formData.province
                      ? "bg-gray-100 cursor-not-allowed opacity-50"
                      : ""
                  } ${
                    errors.city
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-brand-primary"
                  }`}
                >
                  <option value="">
                    {formData.province ? "Selecciona una ciudad" : "Primero selecciona una provincia"}
                  </option>
                  {getAvailableCities().map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
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
                  type="text"
                  inputMode="numeric"
                  name="amount"
                  value={formData.amount || ""}
                  onChange={handleInputChange}
                  placeholder="Ej: 5000"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.amount
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-brand-primary"
                  }`}
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
                  type="text"
                  inputMode="numeric"
                  name="plazoMeses"
                  value={formData.plazoMeses || ""}
                  onChange={handleInputChange}
                  placeholder="Ej: 12"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.plazoMeses
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-brand-primary"
                  }`}
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
