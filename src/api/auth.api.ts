import { httpClient } from "./httpClient";

const AUTH_API = import.meta.env.VITE_AUTH_API_URL;

// 🔐 LOGIN
export const loginRequest = async (email: string, password: string) => {
  const res = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciales incorrectas");
  }

  return res.json(); // { accessToken, user }
};

// ✅ ACTIVAR CUENTA
export async function activateAccount(token: string) {
  return httpClient(`${AUTH_API}/activate?token=${encodeURIComponent(token)}`, {
    method: "GET",
    auth: false,
  });
}

// ✅ COMPLETAR REGISTRO (ESTO FALTABA)
export async function completeRegistration(payload: {
  email: string;
  password: string;
}) {
  return httpClient(`${AUTH_API}/complete-registration`, {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

//RECUPERAR CONTRASEÑA

export async function forgotPassword(email: string) {
  return httpClient(`${AUTH_API}/password/forgot`, {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}) {
  return httpClient(`${AUTH_API}/password/reset`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}
