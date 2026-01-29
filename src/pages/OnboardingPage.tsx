import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Step1Identity from "./steps/Step1Identity";
import Step2PersonalDetails from "./steps/Step2PersonalDetails";
import Step3Address from "./steps/Step3Address";
import Step4Review from "./steps/Step4Review";

import { submitOnboarding } from "../api/onboarding.api";

export default function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    identity: {
      tipoIdentificacion: "",
      identification: "",
      first_name1: "",
      first_name2: "",
      last_name1: "",
      last_name2: "",
      birthdate: "",
    },
    details: {
      gender: "",
      nationality: "",
      civilStatus: "",
      phone: "",
      email: "",
    },
    address: {
      province: "",
      city: "",
      parish: "",
      address: "",
      reference: "",
      housingType: "",
      residenceTime: "",
    },
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      const response = await submitOnboarding({
        infoPersonal: {
          tipoIdentificacion: formData.identity.tipoIdentificacion,
          identificacion: formData.identity.identification,
          primerNombre: formData.identity.first_name1,
          segundoNombre: formData.identity.first_name2,
          primerApellido: formData.identity.last_name1,
          segundoApellido: formData.identity.last_name2,
          fechaNacimiento: formData.identity.birthdate,
          sexo: formData.details.gender,
          nacionalidad: formData.details.nationality,
          estadoCivil: formData.details.civilStatus,
          telefono: formData.details.phone,
          correo: formData.details.email,
        },
        domicilio: {
          provincia: formData.address.province,
          ciudad: formData.address.city,
          parroquia: formData.address.parish,
          direccion: formData.address.address,
          referencia: formData.address.reference,
          tipoVivienda: formData.address.housingType,
          tiempoResidencia: formData.address.residenceTime,
        },
      });

      if (response?.status === "COMPLETED") {
        updateUser({ ...user, onboarding: true });
        navigate("/dashboard-client");
      } else {
        throw new Error("Onboarding no completado");
      }

    } catch (error) {
      console.error("❌ Error enviando onboarding:", error);
      alert("Ocurrió un error al guardar la información.");
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-4 py-10 flex justify-center">
      <div className="bg-white w-full max-w-3xl p-10 rounded-2xl shadow-xl border border-gray-100">

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Identidad</span>
            <span>Datos Personales</span>
            <span>Domicilio</span>
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
          Este formulario se llena una sola vez. Luego podrás solicitar créditos sin volver a ingresar tus datos.
        </p>

        {/* Steps */}
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
          <Step4Review
            data={formData}
            prevStep={prevStep}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
