import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { getCooperatives } from "../api/cooperatives.api";
import { getMyCreditRequests } from "../api/creditRequests.api";
import { getOnboardingStatus } from "../api/onboarding.api";

import type { Cooperative } from "../types/cooperative";
import type { CreditRequest } from "../types";

import CooperativeCard from '../components/CooperativeCard';
import CreditCard from '../components/CreditCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OnboardingPopup from "../components/OnboardingPopup";
import NewCreditModal from "../components/NewCreditModal";
import NewInvestmentModal from "../components/NewInvestmentModal";

export default function DashboardClient() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cooperatives' | 'requests'>('requests');

  const [needsOnboarding, setNeedsOnboarding] = useState(true);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);
  const [showOnboardingCompletedPopup, setShowOnboardingCompletedPopup] = useState(false);
  
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [creditSuccess, setCreditSuccess] = useState(false);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
      syncOnboardingStatus();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coopsData, requestsData] = await Promise.all([
        getCooperatives(),
        getMyCreditRequests(),
      ]);

      setCooperatives(coopsData ?? []);
      setCreditRequests(requestsData ?? []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncOnboardingStatus = async () => {
    try {
      setCheckingOnboarding(true);
      const status = await getOnboardingStatus();
      // Solo actualizar si la respuesta es válida
      if (status && typeof status === 'object' && 'completed' in status) {
        setNeedsOnboarding(!status.completed);
      } else {
        // Fallback conservador: si no hay respuesta válida, asumir que necesita onboarding
        setNeedsOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // En caso de error (incluyendo 500), asumir que necesita onboarding
      setNeedsOnboarding(true);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  const handleGoToOnboarding = async () => {
    try {
      setCheckingOnboarding(true);

      const status = await getOnboardingStatus();

      if (status && status.completed) {
        setNeedsOnboarding(false);
        setShowOnboardingCompletedPopup(true);
        return;
      }

      navigate('/onboarding');
    } catch (error) {
      console.error("Error verificando onboarding:", error);
      navigate('/onboarding');
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

  const handleCreditSubmit = (data: { amount: number; type: string }) => {
    console.log("Solicitud de crédito:", data);
    setCreditSuccess(true);
    // Aquí irá la integración con API cuando esté lista
    setTimeout(() => setCreditSuccess(false), 5000);
  };

  const handleInvestmentSubmit = (data: { amount: number }) => {
    console.log("Solicitud de inversión:", data);
    setInvestmentSuccess(true);
    // Aquí irá la integración con API cuando esté lista
    setTimeout(() => setInvestmentSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Banner Onboarding */}
        {needsOnboarding && (
          <div className="mb-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Completa tu formulario una sola vez para enviar solicitudes a todas las cooperativas
                </h2>
                <p className="text-amber-50 mb-4 sm:mb-6 text-sm sm:text-base">
                  Para solicitar créditos o realizar inversiones necesitamos conocer tus datos.
                  Es un proceso rápido que <strong>solo harás una vez.</strong>
                </p>
                <button
                  disabled={checkingOnboarding}
                  onClick={handleGoToOnboarding}
                  className="bg-white text-orange-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <CheckCircle className="w-5 h-5" />
                  {checkingOnboarding ? "Verificando..." : "Completar Formulario Ahora"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Bienvenid@ {user?.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {needsOnboarding
              ? 'Completa tu perfil para acceder a todas las funciones'
              : 'Gestiona tus solicitudes y encuentra las mejores opciones financieras'}
          </p>
        </div>

        {/* Acciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Crédito */}
          <div className={`bg-white rounded-2xl shadow-md p-5 sm:p-6 border-2 ${
            needsOnboarding ? 'border-gray-200 opacity-75' : 'border-blue-100 hover:border-blue-300'
          }`}>
            <div className="bg-blue-100 p-3 rounded-xl mb-4 w-fit">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Solicitar Crédito
            </h3>
            <p className="text-gray-600 mb-4 text-xs sm:text-sm">
              Accede a créditos de múltiples cooperativas
            </p>
            <button
              disabled={needsOnboarding}
              onClick={handleRequestCredit}
              className={`w-full py-2.5 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                needsOnboarding
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              }`}
            >
              <Plus className="w-5 h-5" />
              Nueva Solicitud
            </button>
          </div>

          {/* Inversión */}
          <div className={`bg-white rounded-2xl shadow-md p-5 sm:p-6 border-2 ${
            needsOnboarding ? 'border-gray-200 opacity-75' : 'border-emerald-100 hover:border-emerald-300'
          }`}>
            <div className="bg-emerald-100 p-3 rounded-xl mb-4 w-fit">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Realizar Inversión
            </h3>
            <p className="text-gray-600 mb-4 text-xs sm:text-sm">
              Invierte de forma segura con buenas tasas
            </p>
            <button
              disabled={needsOnboarding}
              onClick={handleRequestInvestment}
              className={`w-full py-2.5 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                needsOnboarding
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
              }`}
            >
              <Plus className="w-5 h-5" />
              Nueva Inversión
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="border-b bg-gray-50 flex">
            {(['requests', 'cooperatives'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-medium ${
                  activeTab === tab ? 'bg-white text-primary-600' : 'text-gray-600'
                }`}
              >
                {tab === 'requests' ? 'Mis Solicitudes' : 'Cooperativas'}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="text-center py-16">Cargando...</div>
            ) : activeTab === 'requests' ? (
              creditRequests.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                  <p className="mb-4 text-gray-600">
                    {needsOnboarding
                      ? 'Completa tu perfil para crear solicitudes'
                      : 'Crea tu primera solicitud'}
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
                    <CreditCard
                      key={`${r.solicitudId}`}
                      request={r}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {cooperatives.map(c => (
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
        message="Tu información ya fue registrada correctamente. Ya puedes solicitar créditos y tus datos ya fueron enviados a las cooperativas."
        primaryText="Solicitar crédito"
        onPrimary={() => {
          setShowOnboardingCompletedPopup(false);
          setShowCreditModal(true);
        }}
        onClose={() => setShowOnboardingCompletedPopup(false)}
      />

      {/* Modales de solicitud */}
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

      {/* Notificaciones de éxito */}
      {creditSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-40">
          <CheckCircle className="w-5 h-5" />
          Tu solicitud de crédito fue enviada exitosamente
        </div>
      )}

      {investmentSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-40">
          <CheckCircle className="w-5 h-5" />
          Tu inversión fue registrada exitosamente
        </div>
      )}

      <Footer />
    </div>
  );
}
