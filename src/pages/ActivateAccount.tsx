import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { activateAccount } from "../api/auth.api";

type Status = "loading" | "success" | "error";

export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("Activando tu cuenta...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Falta el token en el enlace de activación.");
      return;
    }

    (async () => {
      try {
        await activateAccount(token);
        setStatus("success");
        setMessage(" Cuenta activada correctamente. Redirigiendo al inicio de sesión...");
      } catch (e: any) {
        setStatus("error");
        setMessage(e?.message || "Token inválido o expirado.");
      } finally {

        localStorage.setItem("just_activated", "true");
        setTimeout(() => navigate("/"), 2000);
      }


    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Activación de cuenta</h1>
        <p className="text-slate-600 mb-6">{message}</p>

        {status === "loading" && (
          <div className="flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 space-y-3">
            <Link
              to="/"
              className="block w-full rounded-xl bg-slate-900 text-white py-3 font-medium"
            >
              Ir al login
            </Link>
            <p className="text-sm text-slate-500">
              Si el enlace expiró, solicita uno nuevo desde soporte o reintenta registro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
