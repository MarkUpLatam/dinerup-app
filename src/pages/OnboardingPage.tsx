import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Step1Identity from "./steps/Step1Identity";
import Step2PersonalDetails from "./steps/Step2PersonalDetails";
import Step3Address from "./steps/Step3Address";
import Step4Economic from "./steps/Step4Economic";
import Step5Spouse from "./steps/Step5Spouse";
import Step4Review from "./steps/Step4Review";
import SuccessOnboardingModal from "../components/SuccessOnboardingModal";

import {
  submitOnboarding,
  type OnboardingPayload,
  type SolicitanteData,
} from "../api/onboarding.api";

/* =======================
   MODELO BASE SOLICITANTE
======================= */
const EMPTY_SOLICITANTE: SolicitanteData = {
  nombres: "",
  apellidos: "",
  cedula: "",
  fechaNacimiento: "",
  estadoCivil: "",
  ocupacion: "",
  empresaTrabajo: "",
  telefono: "",
  tieneConyuge: false,
  direccion: {
    provincia: "",
    canton: "",
    barrio: "",
    callePrincipal: "",
    numero: "",
    referenciaUbicacion: "",
    tipoVivienda: "PROPIA",
  },
  actividadEconomica: {
    nombreNegocio: "",
    direccionNegocio: "",
    tiempoActividad: "",
    telefonoNegocio: "",
  },
  ingresoEgreso: {
    ingresoMensual: 0,
    egresoMensual: 0,
  },
  referencias: [
    {
      nombreCompleto: "",
      tipo: "PERSONAL",
      parentesco: "",
      telefono: "",
    },
  ],
};

export default function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "already_completed">("success");

  /* =======================
     ESTADO CENTRAL
  ======================= */
  const [formData, setFormData] = useState({
    destinoCredito: "",
    solicitante: { ...EMPTY_SOLICITANTE },
    conyuge: null as SolicitanteData | null,
  });

  const hasSpouse = formData.solicitante.tieneConyuge;

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const totalSteps = hasSpouse ? 6 : 5;
  const progress = (step / totalSteps) * 100;

  /* =======================
     SUBMIT FINAL
  ======================= */
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      const payload: OnboardingPayload = {
        destinoCredito: formData.destinoCredito || "CREDITO",
        solicitante: formData.solicitante,
      };

      if (hasSpouse && formData.conyuge) {
        payload.conyuge = formData.conyuge;
      }

      const response = await submitOnboarding(payload);

      if (response?.status === "COMPLETED" || response?.status === "success") {
        updateUser({ ...user, onboarding: true });
        // Mostrar modal de éxito
        setModalType("success");
        setShowModal(true);
      } else {
        throw new Error(response?.message || "Onboarding no completado");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorStatus = (err as any)?.status;

      console.error("❌ Error enviando onboarding:", err);

      // 🔹 MANEJO DE ERROR DE NEGOCIO: Ya completó onboarding
      if (
        errorStatus === 400 &&
        errorMessage.includes("ya ha completado el formulario de onboarding")
      ) {
        console.log(
          "ℹ️ Usuario ya completó onboarding, mostrando modal..."
        );
        // Actualizar el estado del usuario
        updateUser({ ...user, onboarding: true });
        // Mostrar modal de ya completado
        setModalType("already_completed");
        setShowModal(true);
        return;
      }

      // 🔹 OTROS ERRORES: mostrar mensaje de error genérico
      setError("Ocurrió un error al guardar la información. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Redirigir al dashboard después de cerrar el modal
    setTimeout(() => {
      navigate("/dashboard-client");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-4 py-10 flex justify-center">
      <div className="bg-white w-full max-w-3xl p-10 rounded-2xl shadow-xl border border-gray-100">

        {/* PROGRESS */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Identidad</span>
            <span>Datos Personales</span>
            <span>Domicilio</span>
            <span>Economía</span>
            {hasSpouse && <span>Cónyuge</span>}
            <span>Confirmación</span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Completar Información
        </h1>

        <p className="text-gray-600 mb-8">
          Este formulario se llena una sola vez. Luego podrás solicitar créditos
          sin volver a ingresar tus datos.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <span className="text-xl">✓</span>
            {successMessage}
          </div>
        )}

        {/* Modal de éxito/completado */}
        <SuccessOnboardingModal
          open={showModal}
          onClose={handleModalClose}
          type={modalType}
        />

        {/* STEPS */}
        {step === 1 && (
          <Step1Identity
            data={formData}
            setData={setFormData}
            nextStep={nextStep}
          />
        )}

        {step === 2 && (
          <Step2PersonalDetails
            data={formData}
            setData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 3 && (
          <Step3Address
            data={formData}
            setData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 4 && (
          <Step4Economic
            data={formData}
            setData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {hasSpouse && step === 5 && (
          <Step5Spouse
            data={formData}
            setData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === totalSteps && (
          <Step4Review
            data={formData}
            prevStep={prevStep}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
