import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, DollarSign, Calendar, MapPin, CheckCircle, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createCreditRequest, getEligibleCooperatives } from '../utils/mockAPI';
import type { Cooperative } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CooperativeCard from '../components/CooperativeCard';

const creditRequestSchema = z.object({
  amount: z.number().min(500000, 'El monto mínimo es $500,000').max(100000000, 'El monto máximo es $100,000,000'),
  term: z.number().min(6, 'El plazo mínimo es 6 meses').max(84, 'El plazo máximo es 84 meses'),
  city: z.string().min(3, 'Selecciona una ciudad'),
});

type CreditRequestFormData = z.infer<typeof creditRequestSchema>;

const cities = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Pereira',
  'Manizales',
];

export default function CreditRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'results' | 'success'>('form');
  const [eligibleCooperatives, setEligibleCooperatives] = useState<Cooperative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreditRequestFormData | null>(null);

  const form = useForm<CreditRequestFormData>({
    resolver: zodResolver(creditRequestSchema),
    defaultValues: {
      amount: 5000000,
      term: 24,
      city: '',
    },
  });

  const onSubmit = async (data: CreditRequestFormData) => {
    setIsLoading(true);
    setFormData(data);

    try {
      const cooperatives = await getEligibleCooperatives(data.amount, data.term, data.city);
      setEligibleCooperatives(cooperatives);
      setStep('results');
    } catch (error) {
      console.error('Error al buscar cooperativas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRequest = async () => {
    if (!user || !formData) return;

    setIsLoading(true);
    try {
      await createCreditRequest(
        user.id,
        user.name,
        formData.amount,
        formData.term,
        formData.city
      );
      setStep('success');
    } catch (error) {
      console.error('Error al crear solicitud:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Paso 1: Formulario */}
        {step === 'form' && (
          <>
            <button
              onClick={() => navigate('/dashboard-client')}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al dashboard
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Solicitar Crédito
                </h1>
                <p className="text-gray-600">
                  Completa la información para encontrar las mejores opciones
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Monto solicitado
                  </label>
                  <input
                    type="number"
                    {...form.register('amount', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5000000"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Valor actual: {formatCurrency(form.watch('amount') || 0)}
                  </p>
                  {form.formState.errors.amount && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Plazo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Plazo en meses
                  </label>
                  <input
                    type="number"
                    {...form.register('term', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="24"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {form.watch('term')} meses
                  </p>
                  {form.formState.errors.term && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.term.message}
                    </p>
                  )}
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Ciudad
                  </label>
                  <select
                    {...form.register('city')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una ciudad</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Buscando cooperativas...' : 'Buscar Cooperativas'}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Paso 2: Resultados */}
        {step === 'results' && (
          <>
            <button
              onClick={() => setStep('form')}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Modificar búsqueda
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Resumen de tu solicitud
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Monto</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formatCurrency(formData?.amount || 0)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Plazo</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formData?.term} meses
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Ciudad</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formData?.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Cooperativas que aprueban tu crédito
              </h2>
              <p className="text-gray-600">
                Encontramos {eligibleCooperatives.length} cooperativa(s) para ti
              </p>
            </div>

            {eligibleCooperatives.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No encontramos cooperativas
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar el monto, plazo o ciudad de tu solicitud
                </p>
                <button
                  onClick={() => setStep('form')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Modificar búsqueda
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {eligibleCooperatives.map((coop) => (
                    <CooperativeCard key={coop.id} cooperative={coop} />
                  ))}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <button
                    onClick={handleConfirmRequest}
                    disabled={isLoading}
                    className="w-full bg-success-600 text-white py-3 rounded-lg font-medium hover:bg-success-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Enviando solicitud...' : 'Confirmar y Enviar Solicitud'}
                  </button>
                  <p className="text-sm text-gray-600 text-center mt-3">
                    Tu solicitud será enviada a todas las cooperativas que aprueban tu crédito
                  </p>
                </div>
              </>
            )}
          </>
        )}

        {/* Paso 3: Éxito */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-success-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ¡Solicitud Enviada!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Tu solicitud ha sido enviada exitosamente. Las cooperativas revisarán tu información y te contactarán pronto.
            </p>
            <button
              onClick={() => navigate('/dashboard-client')}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
