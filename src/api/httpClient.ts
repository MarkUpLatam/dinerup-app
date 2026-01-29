// src/api/httpClient.ts
export async function httpClient<T = any>(
  urlOrPath: string,
  options: RequestInit & {
    baseUrl?: string;
    auth?: boolean;
  } = {}
): Promise<T | null> {
  const { baseUrl = "", auth = true, headers, ...rest } = options;

  const token = localStorage.getItem("auth_token");
  const finalUrl = baseUrl ? `${baseUrl}${urlOrPath}` : urlOrPath;

  console.log("Llamada a:", finalUrl);
  console.log("Token enviado:", auth ? token : "NO AUTH");

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // 🔹 Solo setear Content-Type cuando NO sea GET
  if (rest.method && rest.method !== "GET") {
    finalHeaders["Content-Type"] = "application/json";
  }

  // 🔹 Agregar Authorization solo si auth === true
  if (auth && token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(finalUrl, {
    ...rest,
    body:
      rest.body && typeof rest.body === "object"
        ? JSON.stringify(rest.body)
        : rest.body,
    headers: finalHeaders,
  });

  // SOLO manejar 401 automático cuando auth === true
  if (response.status === 401 && auth) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  // Leer body una sola vez
  const text = await response.text();
  const data = text ? safeParse(text) : null;

  if (!response.ok) {
    // Intentar extraer el mensaje del servidor en este orden:
    // 1. data.message (formato JSON con campo 'message')
    // 2. data.error (formato JSON con campo 'error')
    // 3. data si es string
    // 4. text completo
    // 5. Mensaje por defecto según status
    let msg = "Request failed";

    if (data && typeof data === "object") {
      if ("message" in data && data.message) {
        msg = (data as any).message;
      } else if ("error" in data && data.error) {
        msg = (data as any).error;
      }
    } else if (typeof data === "string" && data) {
      msg = data;
    } else if (text) {
      msg = text;
    } else {
      // Mensajes por defecto según status HTTP
      const statusMessages: Record<number, string> = {
        409: "Esta acción ya ha sido realizada anteriormente",
        400: "Solicitud inválida",
        404: "Recurso no encontrado",
        500: "Error en el servidor",
      };
      msg = statusMessages[response.status] || `Error ${response.status}`;
    }

    const error = new Error(msg);
    (error as any).status = response.status;
    throw error;
  }

  return data as T | null;
}

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
