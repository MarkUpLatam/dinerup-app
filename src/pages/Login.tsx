import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, User } from "lucide-react";
import { useAuth } from "../context/useAuth";
import CompleteRegistrationModal from "../components/auth/CompleteRegistrationModal";
import PublicCreditRequestModal from "../components/credit/PublicCreditRequestModal";
import WelcomePopup from "../components/layout/WelcomePopup";
import CooperativesCarousel from "../components/cooperative/CooperativesCarousel";
import PlatformVisitsCounter from "../components/layout/PlatformVisitsCounter";
import LogoDinerop from "../images/LogoDinerop.png";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  userType: z.enum(["client", "cooperative"]),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCompleteRegistration, setShowCompleteRegistration] = useState(false);
  const [showCreditRequestModal, setShowCreditRequestModal] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [creditRequestType, setCreditRequestType] = useState<"CREDITO" | "INVERSION">("CREDITO");

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const justActivated = localStorage.getItem("just_activated") === "true";
    if (justActivated) {
      const activatedEmail = localStorage.getItem("activated_email") ?? "";
      if (activatedEmail) loginForm.setValue("email", activatedEmail);
      setShowCompleteRegistration(true);
      localStorage.removeItem("just_activated");
      localStorage.removeItem("activated_email");
    }
  }, []);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", userType: "client" },
  });

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await authLogin(data.email, data.password);
      const rawRole = typeof result?.role === "string" ? result.role.toLowerCase() : "";
      if (!rawRole) { setError("No se pudo determinar el tipo de usuario."); return; }
      if (rawRole !== "client" && rawRole !== "cooperative") { setError("Tipo de cuenta no reconocido."); return; }
      if (rawRole !== data.userType) {
        const roleLabel = rawRole === "client" ? "Cliente" : "Cooperativa";
        setError(`Esta cuenta es de tipo ${roleLabel}. Por favor selecciona el perfil correcto.`);
        return;
      }
      navigate(rawRole === "client" ? "/dashboard-client" : "/dashboard-cooperative");
    } catch {
      setError("Credenciales incorrectas o error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCredit = (type: "CREDITO" | "INVERSION") => {
    setCreditRequestType(type);
    setShowCreditRequestModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-x-hidden">

      {/* ── Panel izquierdo (hero) ── */}
      <div
        className="w-full lg:w-3/5 flex items-center justify-center relative overflow-hidden"
        style={{
          padding: "40px 32px",
          background: "linear-gradient(145deg, #312e81 0%, #3730a3 40%, #1e1b4b 100%)",
          minHeight: "auto",
        }}
      >
        {/* Anillos decorativos — solo visibles en lg+ para no saturar móvil */}
        <div className="hidden lg:block" style={{
          position: "absolute", top: -100, right: -100,
          width: 420, height: 420, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
          animation: "spin-ring 55s linear infinite", pointerEvents: "none",
        }} />
        <div className="hidden lg:block" style={{
          position: "absolute", top: -60, right: -60,
          width: 280, height: 280, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.06)",
          animation: "spin-ring-rev 35s linear infinite", pointerEvents: "none",
        }} />
        <div className="hidden lg:block" style={{
          position: "absolute", bottom: -80, left: -80,
          width: 360, height: 360, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.07)",
          animation: "spin-ring 45s linear infinite", pointerEvents: "none",
        }} />

        {/* Contenido */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 480, width: "100%" }}>

          {/* Logo — solo en móvil (en desktop está en el panel derecho) */}
          <div className="flex justify-center mb-6 lg:hidden">
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "#ffffff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={LogoDinerop} alt="Dinerop" style={{ height: 46, objectFit: "contain" }} />
            </div>
          </div>

          {/* Título */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{
              fontSize: "clamp(1.6rem, 5vw, 2.35rem)",
              fontWeight: 800, color: "#fff", lineHeight: 1.15,
              marginBottom: 12, letterSpacing: "-0.02em",
              textAlign: "center",
            }}>
              Bienvenido a{" "}
              <span style={{
                background: "linear-gradient(90deg, #a5b4fc, #c7d2fe)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Dinerop
              </span>
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.72)", fontSize: "0.88rem",
              lineHeight: 1.75, textAlign: "center",
            }}>
              Conectamos personas con oportunidades financieras de manera
              transparente y eficiente.
            </p>
          </div>

          {/* Features — colapsadas en móvil, expandidas en lg */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            <FeatureItem title="Elige entre cooperativas según tu ubicación" />
            <FeatureItem title="Solicita tu crédito en línea" />
            <FeatureItem title="Compara beneficios, tasas y tiempos" />
            <FeatureItem title="Sin trámites complejos, desde tu hogar" />
          </div>

          {/* Botones CTA */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <button
              className="left-btn-shimmer"
              onClick={() => handleOpenCredit("CREDITO")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff", fontWeight: 700, fontSize: "0.85rem",
                padding: "12px 14px", borderRadius: 14, border: "none", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(16,185,129,0.38)",
                transition: "transform 0.15s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(16,185,129,0.48)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,185,129,0.38)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 9h.01M18 15h.01" />
              </svg>
              <span>Solicitar crédito</span>
            </button>

            <button
              className="left-btn-shimmer"
              onClick={() => handleOpenCredit("INVERSION")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#fff", fontWeight: 700, fontSize: "0.85rem",
                padding: "12px 14px", borderRadius: 14, border: "none", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(245,158,11,0.38)",
                transition: "transform 0.15s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,158,11,0.48)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(245,158,11,0.38)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
              </svg>
              <span>Realizar inversión</span>
            </button>
          </div>

          {/* Divider + Carousel & Contador */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "center" }}>
              <CooperativesCarousel />
              <PlatformVisitsCounter />
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel derecho (formulario) ── */}
      <div
        className="w-full lg:w-2/5 flex items-center justify-center p-6"
        style={{ background: "linear-gradient(160deg, #f8fafc 0%, #eef2f7 100%)" }}
      >
        <div className="max-w-sm w-full">

          {/* Logo — solo en desktop */}
          <div className="hidden lg:flex mb-7 flex-col items-center">
            <div
              style={{
                width: 56, height: 56, borderRadius: 16,
                background: "#ffffff",
                boxShadow: "0 8px 24px rgba(111,104,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <img src={LogoDinerop} alt="DinerUp Logo" style={{ height: 50, objectFit: "contain" }} />
            </div>
            <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Texto de acceso en móvil */}
          <p className="lg:hidden text-sm text-gray-500 text-center mb-5">
            Ingresa tus credenciales para continuar
          </p>

          {/* Card formulario */}
          <div
            className="bg-white rounded-2xl p-7 border"
            style={{
              borderColor: "rgba(226,232,240,0.9)",
              boxShadow: "0 4px 6px -1px rgba(15,23,42,0.04), 0 12px 40px -4px rgba(15,23,42,0.09)",
            }}
          >
            {error && (
              <div
                className="mb-5 p-3 rounded-xl flex items-center gap-2"
                style={{ background: "#fef2f2", border: "1px solid #fecaca", borderLeft: "4px solid #f87171" }}
              >
                <span className="text-red-400 text-base leading-none">⚠</span>
                <p className="text-red-700 text-sm font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
              <UserTypeSelector register={loginForm.register} />

              <InputField
                label="Correo electrónico"
                type="email"
                register={loginForm.register("email")}
                error={loginForm.formState.errors.email?.message}
                placeholder="tu@email.com"
              />

              <InputField
                label="Contraseña"
                type="password"
                register={loginForm.register("password")}
                error={loginForm.formState.errors.password?.message}
                placeholder="••••••••"
              />

              <div className="text-right" style={{ marginTop: 2 }}>
                <a
                  href="/forgot-password"
                  className="text-sm font-semibold transition-colors"
                  style={{ color: "#4f46e5" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#3730a3")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#4f46e5")}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="login-btn-shimmer w-full text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  marginTop: 8,
                  background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                  boxShadow: "0 4px 18px rgba(79,70,229,0.35)",
                  fontSize: "0.95rem", letterSpacing: "0.01em",
                  transition: "transform 0.15s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 26px rgba(79,70,229,0.45)";
                  }
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 18px rgba(79,70,229,0.35)";
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="login-spinner" />
                    Ingresando...
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </form>
          </div>

          {/* Footer confianza */}
          <div className="mt-5 flex items-center justify-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-xs text-gray-400">
              Conexión segura SSL · Al ingresar aceptas nuestra{" "}
              <a href="#" className="text-indigo-400 font-medium hover:text-indigo-600 transition-colors">
                Política de privacidad
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showCompleteRegistration && (
        <CompleteRegistrationModal
          defaultEmail={loginForm.watch("email")}
          onClose={() => setShowCompleteRegistration(false)}
          onCompleted={() => {
            setShowCompleteRegistration(false);
            setError("Registro completado. Ahora puedes iniciar sesión.");
          }}
        />
      )}

      <PublicCreditRequestModal
        open={showCreditRequestModal}
        onClose={() => setShowCreditRequestModal(false)}
        type={creditRequestType}
      />

      {showWelcomePopup && <WelcomePopup onContinue={() => setShowWelcomePopup(false)} />}
    </div>
  );
}

/* ── Sub-componentes ── */

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

function InputField({
  label, type, register, error, placeholder,
}: {
  label: string; type: string; register: unknown; error?: string; placeholder: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2.5">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          {...(register as object)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all bg-gray-50 placeholder-gray-400 text-gray-900 pr-12"
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition">
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7 1.21-2.73 3.49-4.88 6.22-5.96M9.88 9.88a3 3 0 104.24 4.24M3 3l18 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
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

function UserTypeOption({
  value, icon: Icon, label, register,
}: {
  value: string; icon: unknown; label: string; register: unknown;
}) {
  const IconComponent = Icon as React.ComponentType<{ className: string }>;
  return (
    <label className="cursor-pointer group">
      <input type="radio" value={value} {...(register as (name: string) => object)("userType")} className="peer sr-only" />
      <div className="p-4 border-2 border-gray-200 rounded-xl text-center peer-checked:border-brand-primary peer-checked:bg-brand-primary/10 transition-all hover:border-gray-300 group-hover:shadow-md">
        <IconComponent className="w-6 h-6 mx-auto mb-2 text-gray-500 peer-checked:text-brand-primary transition-colors" />
        <span className="text-sm font-bold text-gray-700 peer-checked:text-brand-primary transition-colors">{label}</span>
      </div>
    </label>
  );
}
