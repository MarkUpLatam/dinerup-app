import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoDinerUp from '../images/LogoDinerUp.png';
import CompleteRegistrationModal from '../components/auth/CompleteRegistrationModal';
import PublicCreditRequestModal from '../components/PublicCreditRequestModal';

// Schema de validación
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  userType: z.enum(['client', 'cooperative']),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCompleteRegistration, setShowCompleteRegistration] = useState(false);
  const [showCreditRequestModal, setShowCreditRequestModal] = useState(false);
  const [creditRequestType, setCreditRequestType] = useState<"CREDITO" | "INVERSION">("CREDITO");

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  // 🔹 Mostrar modal solo como sugerencia tras activación
  useEffect(() => {
    const justActivated = localStorage.getItem("just_activated") === "true";
    if (justActivated) {
      setShowCompleteRegistration(true);
      localStorage.removeItem("just_activated");
    }
  }, []);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      userType: 'client',
    },
  });

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authLogin(data.email, data.password);
      const rawRole = result?.role.toLowerCase();

      if (!rawRole) {
        setError('No se pudo determinar el tipo de usuario.');
        return;
      }

      const userRole = rawRole === 'client' ? 'client' : 'cooperative';

      if (userRole !== data.userType) {
        setError(`Esta cuenta es de tipo ${rawRole}`);
        return;
      }

      navigate(userRole === 'client' ? '/dashboard-client' : '/dashboard-cooperative');

    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas o error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Columna izquierda - Información DinerUp */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-brand-secondary via-brand-secondary to-brand-dark p-12 items-center justify-center relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative z-10 max-w-md w-full text-center lg:text-left">
          {/* Logo y título */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-2xl overflow-hidden">
              <img src={LogoDinerUp} alt="DinerUp Logo" className="w-10 h-10 object-contain" />
            </div>
            <h2 className="text-5xl font-bold text-white mb-4 leading-tight">DinerOP</h2>
            <p className="text-white/90 text-base leading-relaxed">
              Invierte con total seguridad o accede a créditos inmediatos a través de múltiples instituciones financieras cercanas a tu localidad.
            </p>  
          </div>

          {/* Lista de características */}
          <div className="space-y-3 mb-8">
            <FeatureItem title="Invierte con confianza" />
            <FeatureItem title="Elige entre cooperativas según tu ubicación" />
            <FeatureItem title="Solicita tu crédito en línea" />
            <FeatureItem title="Elige entre cooperativas que más te convengan" />
            <FeatureItem title="Compara beneficios, tasas y tiempos" />
            <FeatureItem title="Sin trámites complejos, desde la comodidad de tu hogar" />
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => {
                setCreditRequestType("CREDITO");
                setShowCreditRequestModal(true);
              }}
              className="bg-success hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 duration-200 flex items-center justify-center gap-2"
            >
              <span>Solicitar crédito</span>
              <span>→</span>
            </button>
            <button 
              onClick={() => {
                setCreditRequestType("INVERSION");
                setShowCreditRequestModal(true);
              }}
              className="bg-accent hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 duration-200 flex items-center justify-center gap-2"
            >
              <span>Realizar inversión</span>
              <span>→</span>
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">50+</div>
              <div className="text-white/70 text-sm font-medium">Cooperativas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">10k+</div>
              <div className="text-white/70 text-sm font-medium">Usuarios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna derecha - Login */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-sm w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
            <p className="text-gray-500 text-sm">Inicia una solicitud de credito o inversion para crear tu cuenta y puedas ver el estado de tus solicitudes</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <p className="text-red-700 text-sm font-medium flex items-center gap-2"><span>⚠️</span>{error}</p>
              </div>
            )}

            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
              <UserTypeSelector register={loginForm.register} />

              <InputField
                label="Correo electrónico"
                type="email"
                register={loginForm.register('email')}
                error={loginForm.formState.errors.email?.message}
                placeholder="tu@email.com"
              />

              <InputField
                label="Contraseña"
                type="password"
                register={loginForm.register('password')}
                error={loginForm.formState.errors.password?.message}
                placeholder="••••••••"
              />

              <div className="text-right pt-1">
                  <a
                    href="/forgot-password"
                    className="text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-secondary to-brand-dark text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed duration-200 mt-6"
              >
                {isLoading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal opcional de completar registro */}
      {showCompleteRegistration && (
        <CompleteRegistrationModal
          defaultEmail={loginForm.watch("email")}
          onCompleted={() => {
            setShowCompleteRegistration(false);
            setError("Registro completado. Ahora puedes iniciar sesión.");
          }}
        />
      )}

      {/* Modal de solicitud pública de crédito/inversión */}
      <PublicCreditRequestModal
        open={showCreditRequestModal}
        onClose={() => setShowCreditRequestModal(false)}
        type={creditRequestType}
      />
    </div>
  );
}

/* ---------------- Components ---------------- */

function FeatureItem({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 text-white/95">
      <div className="flex-shrink-0 w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-md">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-sm font-medium leading-snug">{title}</p>
    </div>
  );
}

function InputField({ label, type, register, error, placeholder }: { label: string; type: string; register: unknown; error?: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2.5">{label}</label>
      <input
        type={type}
        {...(register as object)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all bg-gray-50 placeholder-gray-400 text-gray-900"
      />
      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1 font-medium">
          <span>✕</span> {error}
        </p>
      )}
    </div>
  );
}

function UserTypeSelector({ register }: { register: unknown }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">Tipo de cuenta</label>
      <div className="grid grid-cols-2 gap-3">
        <UserTypeOption value="client" icon={User} label="Cliente" register={register} />
        <UserTypeOption value="cooperative" icon={Building2} label="Cooperativa" register={register} />
      </div>
    </div>
  );
}

function UserTypeOption({ value, icon: Icon, label, register }: { value: string; icon: unknown; label: string; register: unknown }) {
  const IconComponent = Icon as React.ComponentType<{ className: string }>;
  return (
    <label className="cursor-pointer group">
      <input type="radio" value={value} {...((register as (name: string) => object)('userType'))} className="peer sr-only" />
      <div className="p-4 border-2 border-gray-200 rounded-xl text-center peer-checked:border-brand-primary peer-checked:bg-brand-primary/10 transition-all hover:border-gray-300 group-hover:shadow-md">
        <IconComponent className="w-6 h-6 mx-auto mb-2 text-gray-500 peer-checked:text-brand-primary transition-colors" />
        <span className="text-sm font-bold text-gray-700 peer-checked:text-brand-primary transition-colors">
          {label}
        </span>
      </div>
    </label>
  );
}
