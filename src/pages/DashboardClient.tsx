import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCooperatives, getCreditRequestsByClient } from '../utils/mockAPI';
import type { Cooperative, CreditRequest } from '../types';
import CooperativeCard from '../components/CooperativeCard';
import CreditCard from '../components/CreditCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardClient() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cooperatives' | 'requests'>('cooperatives');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coopsData, requestsData] = await Promise.all([
        getCooperatives(),
        getCreditRequestsByClient(user?.id || ''),
      ]);
      setCooperatives(coopsData);
      setCreditRequests(requestsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestCredit = () => {
    navigate('/credit-request');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-600">
            Explora nuestras cooperativas aliadas y solicita tu crédito
          </p>
        </div>

        {/* Botón de acción principal */}
        <div className="mb-6">
          <button
             // onClick={handleRequestCredit}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Solicitar Crédito</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('cooperatives')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'cooperatives'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Cooperativas Aliadas
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                {cooperatives.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'requests'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mis Solicitudes
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                {creditRequests.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        ) : (
          <>
            {activeTab === 'cooperatives' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cooperatives.map((coop) => (
                  <CooperativeCard key={coop.id} cooperative={coop} />
                ))}
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                {creditRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      No tienes solicitudes
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Comienza solicitando tu primer crédito
                    </p>
                    <button
                      //onClick={handleRequestCredit}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Solicitar Crédito</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {creditRequests.map((request) => (
                      <CreditCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
