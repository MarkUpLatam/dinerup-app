const BASE_URL = import.meta.env.VITE_AUTH_API_URL;
// ej: http://localhost:8081/api/auth

export const loginRequest = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciales incorrectas");
  }

  return res.json(); // Devuelve { token, user }
};
