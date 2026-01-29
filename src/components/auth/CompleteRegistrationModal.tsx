import { useState } from "react";
import { completeRegistration } from "../../api/auth.api";

type Props = {
  defaultEmail?: string;
  onCompleted: () => void;
};

export default function CompleteRegistrationModal({
  defaultEmail = "",
  onCompleted,
}: Props) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!email || !password) {
      setError("Correo y contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      await completeRegistration({ email, password });
      onCompleted();
    } catch (e: any) {
      setError(e?.message || "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-1">Completa tu registro</h2>
        <p className="text-sm text-neutral-600 mb-4">
          Acabas de activar tu cuenta. Define una contraseña para continuar.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-primary"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-primary"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-secondary to-brand-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Completar registro"}
          </button>
        </div>
      </div>
    </div>
  );
}
