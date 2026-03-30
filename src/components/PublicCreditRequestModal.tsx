import { useState, useMemo } from "react";
import { X, Loader, User, MapPin, Wallet } from "lucide-react";
import { httpClient } from "../api/httpClient";
import SuccessRequestModal from "./SuccessRequestModal";
import { ecuadorProvinces } from "../data/ecuadorProvinces";

interface PublicCreditRequestModalProps {
  open: boolean;
  onClose: () => void;
  type: "CREDITO" | "INVERSION";
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identification: string;
  province: string;
  city: string;
  amount: string;
  plazoMeses: string;
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

/* ================= VALIDADORES ================= */
const onlyLetters = (value: string) =>
  value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, "");

const onlyNumbers = (value: string, maxLength?: number) => {
  const cleaned = value.replace(/\D/g, "");
  return maxLength ? cleaned.slice(0, maxLength) : cleaned;
};

const isValidEcuadorId = (cedula: string): boolean => {
  if (!/^\d{10}$/.test(cedula)) return false;

  const digits = cedula.split("").map(Number);
  const province = parseInt(cedula.substring(0, 2));
  if (province < 1 || province > 24) return false;

  const checkDigit = digits.pop()!;
  const sum = digits.reduce((acc, digit, index) => {
    if (index % 2 === 0) {
      const doubled = digit * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + digit;
  }, 0);

  const calculated = (10 - (sum % 10)) % 10;
  return calculated === checkDigit;
};

/* ================= COMPONENTES AUX ================= */

interface InputProps {
  name: string;
  placeholder: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  error?: string;
}

export type { InputProps };

function Input({ name, placeholder, value, onChange, error }: InputProps) {
  return (
    <div className="space-y-2">
      <input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition
          ${error ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-brand-secondary"}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SectionCard({ title, icon, children }: SectionCardProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}
/* ================= COMPONENTE Para que se reinicien los campos ================= */

const getInitialFormState = (type: "CREDITO" | "INVERSION"): FormData => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  identification: "",
  province: "",
  city: "",
  amount: "",
  plazoMeses: "12",
  type,
  creditType: "MICROCREDITO",
});

/* ================= COMPONENTE PRINCIPAL ================= */

export default function PublicCreditRequestModal({
  open,
  onClose,
  type,
}: PublicCreditRequestModalProps) {
  const [formData, setFormData] = useState<FormData>(getInitialFormState(type));
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const resetForm = () => {
    setFormData(getInitialFormState(type));
    setErrors({});
    setAcceptedTerms(false);
    setShowFullTerms(false);
  };

  const availableCities = useMemo(() => {
    const provinceData = ecuadorProvinces.Ecuador.find(
      (p) => p.provincia === formData.province,
    );
    return provinceData ? provinceData.ciudades : [];
  }, [formData.province]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName) newErrors.firstName = "Requerido";
    if (!formData.lastName) newErrors.lastName = "Requerido";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Correo inválido";
    if (!formData.phone || formData.phone.length !== 10)
      newErrors.phone = "10 dígitos";
    if (!isValidEcuadorId(formData.identification))
      newErrors.identification = "Cédula inválida";
    if (!formData.province) newErrors.province = "Requerido";
    if (!formData.city) newErrors.city = "Requerido";
    if (
      !formData.amount ||
      Number(formData.amount) <= 0 ||
      formData.amount.length > 6
    )
      newErrors.amount = "Máximo 6 dígitos";
    if (
      !formData.plazoMeses ||
      Number(formData.plazoMeses) <= 0 ||
      Number(formData.plazoMeses) > 60
    )
      newErrors.plazoMeses = "Máximo 60 meses";

    if (!acceptedTerms)
      newErrors.terms = "Debes aceptar los términos y condiciones para continuar";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    switch (name) {
      case "firstName":
      case "lastName":
        finalValue = onlyLetters(value);
        break;

      case "phone":
        finalValue = onlyNumbers(value, 10);
        break;

      case "identification":
        finalValue = onlyNumbers(value, 10);
        break;

      case "amount":
        finalValue = onlyNumbers(value, 6);
        break;

      case "plazoMeses":
        finalValue = onlyNumbers(value, 2);
        if (Number(finalValue) > 60) finalValue = "60";
        break;

      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await httpClient("/api/credits/public-request", {
        method: "POST",
        body: {
          ...formData,
          amount: Number(formData.amount),
          plazoMeses: Number(formData.plazoMeses),
          type,
          creditType: type === "CREDITO" ? formData.creditType : "INVERSION",
        },
        auth: false,
      });

      setShowSuccessModal(true);
    } catch {
      setErrors({
        submit: "Error al enviar. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-secondary to-brand-dark text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {type === "CREDITO" ? "Solicitar Crédito" : "Realizar Inversión"}
            </h2>
            <p className="text-sm opacity-90">
              Completa la información y te conectaremos con cooperativas.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          <SectionCard
            title="Información personal"
            icon={<User className="w-5 h-6 text-brand-secondary" />}
          >
            <div className="space-y-6">
              {/* Nombres y Apellidos */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  name="firstName"
                  placeholder="Nombres"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <Input
                  name="lastName"
                  placeholder="Apellidos"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>

              {/* Email */}
              <Input
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              {/* Teléfono y Cédula */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
                <Input
                  name="identification"
                  placeholder="Cédula"
                  value={formData.identification}
                  onChange={handleChange}
                  error={errors.identification}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Ubicación"
            icon={<MapPin className="w-5 h-5 text-brand-secondary" />}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* PROVINCIA */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Provincia
                </label>

                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition
      ${
        errors.province
          ? "border-red-400 focus:ring-red-500"
          : "border-gray-300 focus:ring-brand-secondary"
      }`}
                >
                  <option value="">Selecciona una provincia</option>
                  {ecuadorProvinces.Ecuador.map((p) => (
                    <option key={p.provincia} value={p.provincia}>
                      {p.provincia}
                    </option>
                  ))}
                </select>

                {errors.province && (
                  <p className="text-xs text-red-600">{errors.province}</p>
                )}
              </div>

              {/* PARROQUIAS */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Parroquia
                </label>

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!formData.province}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition
            ${
              !formData.province
                ? "bg-gray-100 cursor-not-allowed opacity-70"
                : ""
            }
            ${
              errors.city
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-brand-secondary"
            }`}
                >
                  <option value="">
                    {formData.province
                      ? "Selecciona una parroquia"
                      : "Primero selecciona provincia"}
                  </option>

                  {availableCities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                {errors.city && (
                  <p className="text-xs text-red-600">{errors.city}</p>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title={
              type === "CREDITO"
                ? "Detalles del crédito"
                : "Detalles de inversión"
            }
            icon={<Wallet className="w-5 h-5 text-brand-secondary" />}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* MONTO */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Monto a invertir
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 text-sm">
                    $
                  </span>

                  <input
                    name="amount"
                    value={formData.amount || ""}
                    onChange={handleChange}
                    placeholder="Ej: 5000"
                    className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition
        ${
          errors.amount
            ? "border-red-400 focus:ring-red-500"
            : "border-gray-300 focus:ring-brand-secondary"
        }`}
                  />
                </div>

                {errors.amount && (
                  <p className="text-xs text-red-600">{errors.amount}</p>
                )}
              </div>

              {/* PLAZO */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Plazo en meses
                </label>

                <div className="relative">
                  <input
                    name="plazoMeses"
                    value={formData.plazoMeses}
                    onChange={handleChange}
                    placeholder="Ej: 12"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition
        ${
          errors.plazoMeses
            ? "border-red-400 focus:ring-red-500"
            : "border-gray-300 focus:ring-brand-secondary"
        }`}
                  />
                </div>

                {errors.plazoMeses && (
                  <p className="text-xs text-red-600">{errors.plazoMeses}</p>
                )}
              </div>
            </div>
            {type === "CREDITO" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Tipo de crédito
                </label>

                <div className="relative mt-1">
                  <select
                    name="creditType"
                    value={formData.creditType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-secondary"
                  >
                    {creditTypes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </SectionCard>

          {/* ===== TÉRMINOS Y CONDICIONES ===== */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (e.target.checked && errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: "" }));
                  }
                }}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-brand-secondary cursor-pointer flex-shrink-0"
              />
              <span className="text-xs text-gray-700">
                He leído y acepto los <strong>Términos y Condiciones</strong> y autorizo el{" "}
                <strong>tratamiento de mis datos personales</strong>.{" "}
                <button
                  type="button"
                  onClick={() => setShowFullTerms((v) => !v)}
                  className="text-brand-secondary underline hover:opacity-80 transition"
                >
                  {showFullTerms ? "Ocultar" : "Ver más"}
                </button>
              </span>
            </label>

            {showFullTerms && (
              <p className="text-xs text-gray-500 leading-relaxed pl-7 border-t pt-2">
                Al enviar este formulario, usted autoriza a <strong>DinerUp</strong> y a las cooperativas
                asociadas al tratamiento de sus datos personales (nombre, identificación, correo electrónico,
                teléfono, ubicación e información financiera) con la finalidad exclusiva de evaluar y gestionar
                su solicitud de {type === "CREDITO" ? "crédito" : "inversión"}. El tratamiento se realizará
                conforme a la <strong>Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP)</strong>{" "}
                y sus reglamentos vigentes. Sus datos no serán vendidos ni compartidos con terceros ajenos al
                proceso. Puede ejercer sus derechos ARCO contactando a <strong>soporte@dinerup.com</strong>.
              </p>
            )}

            {errors.terms && (
              <p className="text-xs text-red-600 pl-7">{errors.terms}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1 border border-gray-300 rounded-xl py-3 font-medium"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-brand-secondary to-brand-dark text-white rounded-xl py-3 font-semibold flex justify-center items-center gap-2 shadow-lg hover:shadow-xl transition"
            >
              {isLoading && <Loader className="animate-spin w-4 h-4" />}

              {isLoading
                ? "Enviando..."
                : type === "CREDITO"
                  ? "Solicitar crédito"
                  : "Realizar inversión"}
            </button>
          </div>
        </div>
      </div>

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
