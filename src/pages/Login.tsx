import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, User, Shield, Zap, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../utils/mockAPI';

// Schema de validación simplificado (solo login)
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  userType: z.enum(['client', 'cooperative']),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

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
      const user = await apiLogin(data.email, data.password);

      if (!user) {
        setError('Credenciales incorrectas');
        return;
      }

      if (user.type !== data.userType) {
        setError(`Esta cuenta es de tipo ${user.type === 'client' ? 'cliente' : 'cooperativa'}`);
        return;
      }

      authLogin(user);
      navigate(user.type === 'client' ? '/dashboard-client' : '/dashboard-cooperative');
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Columna izquierda - Información */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 items-center justify-center relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          {/* Logo y título */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-2xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
              DinerUp
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Conecta clientes con cooperativas de manera simple y segura.
            </p>
          </div>

          {/* Características destacadas */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-0.5">
                  Seguridad garantizada
                </h3>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Datos protegidos con encriptación avanzada.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-0.5">
                  Rápido y eficiente
                </h3>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Gestión en segundos con interfaz intuitiva.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-0.5">
                  Crecimiento continuo
                </h3>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Herramientas para escalar tu negocio.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-0.5">
                  Comunidad activa
                </h3>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Miles de usuarios confían en nuestra plataforma.
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-blue-200 text-xs">Cooperativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-blue-200 text-xs">Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-blue-200 text-xs">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna derecha - Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-md w-full">
          {/* Logo móvil */}
          <div className="lg:hidden mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mb-3 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">DinerUp</h1>
          </div>

          {/* Título */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido
            </h1>
            <p className="text-gray-600">
              Inicia sesión para continuar
            </p>
          </div>

          {/* Card de Login */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              {/* Tipo de usuario */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de cuenta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer group">
                    <input
                      type="radio"
                      value="client"
                      {...loginForm.register('userType')}
                      className="peer sr-only"
                    />
                    <div className="p-3 border-2 border-gray-200 rounded-xl text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all hover:border-gray-300 hover:shadow-md">
                      <User className="w-6 h-6 mx-auto mb-1 text-gray-500 peer-checked:text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-gray-700 peer-checked:text-blue-600">
                        Cliente
                      </span>
                    </div>
                  </label>
                  <label className="cursor-pointer group">
                    <input
                      type="radio"
                      value="cooperative"
                      {...loginForm.register('userType')}
                      className="peer sr-only"
                    />
                    <div className="p-3 border-2 border-gray-200 rounded-xl text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all hover:border-gray-300 hover:shadow-md">
                      <Building2 className="w-6 h-6 mx-auto mb-1 text-gray-500 peer-checked:text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-gray-700 peer-checked:text-blue-600">
                        Cooperativa
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  {...loginForm.register('email')}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="tu@email.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Contraseña
                  </label>
                  <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <input
                  type="password"
                  {...loginForm.register('password')}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Botón de login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            {/* Link de registro */}
            <div className="mt-5 pt-5 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                ¿No tienes una cuenta?{' '}
                <a href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}