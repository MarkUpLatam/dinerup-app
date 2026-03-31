import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

import { getCooperatives } from "../api/cooperatives.api";
import {
  getMyCreditRequests,
  createCreditRequest,
} from "../api/creditRequests.api";
import { getErrorMessage } from "../api/errors";
import { getFormularioClienteStatus } from "../api/onboarding.api";

import type { Cooperative } from "../types/cooperative";
import type { CreditRequest } from "../types/credit";

import CooperativeCard from "../components/cooperative/CooperativeCard";
import CreditCard from "../components/credit/CreditCard";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import OnboardingPopup from "../components/onboarding/OnboardingPopup";
import NewCreditModal from "../components/credit/NewCreditModal";
import NewInvestmentModal from "../components/investment/NewInvestmentModal";

export default function DashboardClient() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [activeTab, setActiveTab] = useState<"cooperatives" | "requests">(
    "requests",
  );

  const [needsOnboarding, setNeedsOnboarding] = useState(true);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);
  const [showOnboardingCompletedPopup, setShowOnboardingCompletedPopup] =
    useState(false);

  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [creditSuccess, setCreditSuccess] = useState(false);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      void loadData();
      void syncOnboardingStatus();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    setPageError("");
    try {
      const [coopsData, requestsData] = await Promise.all([
        getCooperatives(),
        getMyCreditRequests(),
      ]);

      setCooperatives(coopsData ?? []);
      setCreditRequests(requestsData ?? []);
    } catch (error) {
      setPageError(getErrorMessage(error, "No se pudieron cargar tus datos."));
    } finally {
      setIsLoading(false);
    }
  };

  const syncOnboardingStatus = async () => {
    try {
      setCheckingOnboarding(true);
      setPageError("");
      const status = await getFormularioClienteStatus();
      setNeedsOnboarding(!status.formularioCompleto);
    } catch (error) {
      setPageError(
        getErrorMessage(error, "No se pudo verificar el estado de onboarding."),
      );
      setNeedsOnboarding(true);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  const handleGoToOnboarding = async () => {
    try {
      setCheckingOnboarding(true);
      setPageError("");

      const status = await getFormularioClienteStatus();

      if (status.formularioCompleto) {
        setNeedsOnboarding(false);
        setShowOnboardingCompletedPopup(true);
        return;
      }

      navigate("/onboarding");
    } catch (error) {
      setPageError(
        getErrorMessage(error, "No se pudo verificar tu formulario actual."),
      );
      navigate("/onboarding");
    } finally {
      setCheckingOnboarding(false);
    }
  };

  const handleRequestCredit = () => {
    if (needsOnboarding) return;
    setShowCreditModal(true);
  };

  const handleRequestInvestment = () => {
    if (needsOnboarding) return;
    setShowInvestmentModal(true);
  };

  const handleCreditSubmit = async (data: { amount: number; type: string }) => {
    try {
      await createCreditRequest({
        monto: data.amount,
        type: "CREDITO",
        creditType: data.type,
      });
      setCreditSuccess(true);
      setTimeout(() => setCreditSuccess(false), 5000);
      void loadData();
    } catch (error) {
      setPageError(
        getErrorMessage(error, "No se pudo enviar la solicitud de crédito."),
      );
    }
  };

  const handleInvestmentSubmit = async (data: { amount: number }) => {
    try {
      await createCreditRequest({
        monto: data.amount,
        type: "INVERSION",
        creditType: null, // ✅ no aplica para inversiones
      });
      setInvestmentSuccess(true);
      setTimeout(() => setInvestmentSuccess(false), 5000);
      void loadData();
    } catch (error) {
      setPageError(
        getErrorMessage(error, "No se pudo registrar la inversión."),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {needsOnboarding && (
          <div className="mb-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Completa tu formulario una sola vez para enviar solicitudes a
                  todas las cooperativas
                </h2>
                <p className="text-amber-50 mb-4 sm:mb-6 text-sm sm:text-base">
                  Para solicitar creditos o realizar inversiones necesitamos
                  conocer tus datos. Es un proceso rapido que solo haras una
                  vez.
                </p>
                <button
                  disabled={checkingOnboarding}
                  onClick={handleGoToOnboarding}
                  className="bg-white text-orange-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <CheckCircle className="w-5 h-5" />
                  {checkingOnboarding
                    ? "Verificando..."
                    : "Completar Formulario Ahora"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Bienvenid@ {user?.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {needsOnboarding
              ? "Completa tu perfil para acceder a todas las funciones"
              : "Gestiona tus solicitudes y encuentra las mejores opciones financieras"}
          </p>
        </div>

        {pageError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div
            className={`bg-white rounded-2xl shadow-md p-5 sm:p-6 border-2 ${
              needsOnboarding
                ? "border-gray-200 opacity-75"
                : "border-blue-100 hover:border-blue-300"
            }`}
          >
            <div className="bg-blue-100 p-3 rounded-xl mb-4 w-fit">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Solicitar Credito
            </h3>
            <p className="text-gray-600 mb-4 text-xs sm:text-sm">
              Accede a creditos de multiples cooperativas
            </p>
            <button
              disabled={needsOnboarding}
              onClick={handleRequestCredit}
              className={`w-full py-2.5 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                needsOnboarding
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-primary-600 text-white hover:bg-primary-700 shadow-md"
              }`}
            >
              <Plus className="w-5 h-5" />
              Nueva Solicitud
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl shadow-md p-5 sm:p-6 border-2 ${
              needsOnboarding
                ? "border-gray-200 opacity-75"
                : "border-emerald-100 hover:border-emerald-300"
            }`}
          >
            <div className="bg-emerald-100 p-3 rounded-xl mb-4 w-fit">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Realizar Inversion
            </h3>
            <p className="text-gray-600 mb-4 text-xs sm:text-sm">
              Invierte de forma segura con buenas tasas
            </p>
            <button
              disabled={needsOnboarding}
              onClick={handleRequestInvestment}
              className={`w-full py-2.5 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                needsOnboarding
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
              }`}
            >
              <Plus className="w-5 h-5" />
              Nueva Inversion
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="border-b bg-gray-50 flex">
            {(["requests", "cooperatives"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-medium ${
                  activeTab === tab
                    ? "bg-white text-primary-600"
                    : "text-gray-600"
                }`}
              >
                {tab === "requests" ? "Mis Solicitudes" : "Cooperativas"}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="text-center py-16">Cargando...</div>
            ) : activeTab === "requests" ? (
              creditRequests.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                  <p className="mb-4 text-gray-600">
                    {needsOnboarding
                      ? "Completa tu perfil para crear solicitudes"
                      : "Crea tu primera solicitud"}
                  </p>
                  {needsOnboarding ? (
                    <button
                      onClick={handleGoToOnboarding}
                      className="bg-primary-600 text-white px-6 py-3 rounded-xl"
                    >
                      Completar Perfil
                    </button>
                  ) : (
                    <button
                      onClick={handleRequestCredit}
                      className="bg-primary-600 text-white px-6 py-3 rounded-xl"
                    >
                      Crear Solicitud
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {creditRequests.map((r) => (
                    <CreditCard key={`${r.solicitudId}`} request={r} />
                  ))}
                </div>
              )
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {cooperatives.map((c) => (
                  <CooperativeCard key={c.id} cooperative={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <OnboardingPopup
        open={showOnboardingCompletedPopup}
        title="Formulario completado"
        message="Tu informacion ya fue registrada correctamente. Ya puedes solicitar creditos y tus datos ya fueron enviados a las cooperativas."
        primaryText="Solicitar credito"
        onPrimary={() => {
          setShowOnboardingCompletedPopup(false);
          setShowCreditModal(true);
        }}
        onClose={() => setShowOnboardingCompletedPopup(false)}
      />

      <NewCreditModal
        open={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        onSubmit={handleCreditSubmit}
      />

      <NewInvestmentModal
        open={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
        onSubmit={handleInvestmentSubmit}
      />

      {creditSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-40">
          <CheckCircle className="w-5 h-5" />
          Tu solicitud de credito fue enviada exitosamente
        </div>
      )}

      {investmentSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-40">
          <CheckCircle className="w-5 h-5" />
          Tu inversion fue registrada exitosamente
        </div>
      )}

      <Footer />
    </div>
  );
}
