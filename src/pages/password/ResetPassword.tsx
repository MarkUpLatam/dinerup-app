import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../../api/auth.api";

type Status = "idle" | "loading" | "success" | "error";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setStatus("error");
      setMessage("Falta el token en el enlace.");
      return;
    }
    setToken(t);
  }, [searchParams]);

  const submit = async () => {
    setMessage("");

    if (!newPassword || newPassword.length < 6) {
      setStatus("error");
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setStatus("loading");
      const res = await resetPassword({ token, newPassword });

      setStatus("success");
      setMessage(typeof res === "string" ? res : "Contraseña actualizada");

      setTimeout(() => navigate("/"), 1500);
    } catch (e: any) {
      setStatus("error");
      setMessage(e?.message || "No se pudo actualizar la contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 border border-neutral-100">
        <h1 className="text-2xl font-bold mb-2">Restablecer contraseña</h1>
        <p className="text-sm text-neutral-600 mb-4">
          Ingresa tu nueva contraseña.
        </p>

        {status !== "error" && token && (
          <>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-primary transition-all"
              placeholder="••••••••"
            />

            <button
              onClick={submit}
              disabled={status === "loading"}
              className="mt-4 w-full bg-gradient-to-r from-brand-secondary to-brand-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-60"
            >
              {status === "loading" ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-r-lg border-l-4 ${
            status === "success" ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
          }`}>
            <p className={`text-sm font-medium ${
              status === "success" ? "text-green-800" : "text-red-700"
            }`}>
              {message}
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm font-semibold text-brand-primary hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
