import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, User, Shield, Zap, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoDinerUp from '../images/LogoDinerUp.png';
import CompleteRegistrationModal from '../components/auth/CompleteRegistrationModal';

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

    } catch (err: any) {
      console.error(err);
      setError('Credenciales incorrectas o error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-neutral-50 flex overflow-hidden">
      {/* Columna izquierda - Información */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-gradientStart to-brand-gradientEnd p-8 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-2xl overflow-hidden">
              <img src={LogoDinerUp} alt="DinerUp Logo" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-4xl font-bold text-brand-primary mb-3 leading-tight">DinerUP</h2>
            <p className="text-neutral-50/90 text-lg">
              Conecta clientes con cooperativas de manera simple y segura.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <Feature icon={Shield} title="Seguridad garantizada" text="Datos protegidos con encriptación avanzada." />
            <Feature icon={Zap} title="Rápido y eficiente" text="Gestión en segundos con interfaz intuitiva." />
            <Feature icon={TrendingUp} title="Crecimiento continuo" text="Herramientas para escalar tu negocio." />
            <Feature icon={Users} title="Comunidad activa" text="Miles de usuarios confían en nuestra plataforma." />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
            <Stat number="500+" label="Cooperativas" />
            <Stat number="10K+" label="Clientes" />
            <Stat number="99.9%" label="Uptime" />
          </div>
        </div>
      </div>

      {/* Columna derecha - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-md w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Bienvenido</h1>
            <p className="text-neutral-600">Inicia sesión para continuar</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-neutral-100">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
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

              <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-sm font-semibold text-brand-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
              </div>


              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-secondary to-brand-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
              >
                {isLoading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 🧩 Modal opcional de completar registro */}
      {showCompleteRegistration && (
        <CompleteRegistrationModal
          defaultEmail={loginForm.watch("email")}
          onCompleted={() => {
            setShowCompleteRegistration(false);
            setError("Registro completado. Ahora puedes iniciar sesión.");
          }}
          onClose={() => {
            setShowCompleteRegistration(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------------- Components ---------------- */

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
      <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-brand-primary" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-sm mb-0.5">{title}</h3>
        <p className="text-neutral-50/80 text-xs">{text}</p>
      </div>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white mb-1">{number}</div>
      <div className="text-neutral-50/70 text-xs">{label}</div>
    </div>
  );
}

function InputField({ label, type, register, error, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{label}</label>
      <input
        type={type}
        {...register}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all"
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}

function UserTypeSelector({ register }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-700 mb-2">Tipo de cuenta</label>
      <div className="grid grid-cols-2 gap-3">
        <UserTypeOption value="client" icon={User} label="Cliente" register={register} />
        <UserTypeOption value="cooperative" icon={Building2} label="Cooperativa" register={register} />
      </div>
    </div>
  );
}

function UserTypeOption({ value, icon: Icon, label, register }) {
  return (
    <label className="cursor-pointer group">
      <input type="radio" value={value} {...register('userType')} className="peer sr-only" />
      <div className="p-3 border-2 border-neutral-200 rounded-xl text-center peer-checked:border-brand-primary peer-checked:bg-brand-primary/10 transition-all">
        <Icon className="w-6 h-6 mx-auto mb-1 text-neutral-600 peer-checked:text-brand-primary" />
        <span className="text-sm font-semibold text-neutral-700 peer-checked:text-brand-primary">
          {label}
        </span>
      </div>
    </label>
  );
}
