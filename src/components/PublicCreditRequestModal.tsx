import { useState, useMemo } from "react";
import {
  X,
  AlertCircle,
  Loader,
  CheckCircle2,
  User,
  MapPin,
  Wallet,
} from "lucide-react";
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    if (!formData.email) newErrors.email = "Correo inválido";
    if (!formData.phone || formData.phone.length !== 10)
      newErrors.phone = "10 dígitos";
    if (!formData.identification || formData.identification.length !== 10)
      newErrors.identification = "Cédula inválida";
    if (!formData.province) newErrors.province = "Requerido";
    if (!formData.city) newErrors.city = "Requerido";
    if (formData.amount <= 0) newErrors.amount = "Monto inválido";
    if (formData.plazoMeses <= 0) newErrors.plazoMeses = "Plazo inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (["phone", "identification", "amount", "plazoMeses"].includes(name))
      finalValue = value.replace(/\D/g, "");

    setFormData((prev) => ({
      ...prev,
      [name]:
        ["amount", "plazoMeses"].includes(name) && finalValue
          ? parseInt(finalValue)
          : finalValue,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await httpClient("/public-request", {
        baseUrl: import.meta.env.VITE_API_CREDIT_REQUESTS,
        method: "POST",
        body: {
          ...formData,
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

  const SectionCard = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-brand-secondary/10 p-2 rounded-lg">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Input = ({ name, placeholder, value, type = "text" }: any) => (
    <div className="relative">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition
        ${
          errors[name]
            ? "border-red-400 focus:ring-red-500"
            : "border-gray-300 focus:ring-brand-secondary"
        }`}
      />
      {!errors[name] && value && (
        <CheckCircle2 className="absolute right-3 top-3.5 w-4 h-4 text-green-500" />
      )}
      {errors[name] && (
        <p className="text-xs text-red-600 mt-1">{errors[name]}</p>
      )}
    </div>
  );

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
          <button onClick={onClose}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          <SectionCard
            title="Información personal"
            icon={<User className="w-5 h-5 text-brand-secondary" />}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="Nombres "
                value={formData.firstName}
              />
              <Input
                name="lastName"
                placeholder="Apellidos"
                value={formData.lastName}
              />
            </div>
            <Input
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
              />
              <Input
                name="identification"
                placeholder="Cédula"
                value={formData.identification}
              />
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

              {/* PARROQUIA */}
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

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={onClose}
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
