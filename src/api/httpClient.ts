import { emitUnauthorizedEvent } from "./auth/authEvents";
import { readStoredToken } from "./auth/authStorage";
import { API_BASE_URL } from "./config";
import { ApiError } from "./errors";

const PUBLIC_PATH_PREFIXES = ["/api/auth/"];
const PUBLIC_ROUTE_RULES = [
  { method: "POST", path: "/api/credits/public-request" },
  { method: "POST", path: "/api/cooperatives" },
];

function normalizePath(urlOrPath: string): string {
  if (/^https?:\/\//i.test(urlOrPath)) {
    return new URL(urlOrPath).pathname;
  }

  return urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
}

function shouldSendAuthHeader(path: string, method: string, auth?: boolean) {
  if (typeof auth === "boolean") {
    return auth;
  }

  if (PUBLIC_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return false;
  }

  return !PUBLIC_ROUTE_RULES.some(
    (rule) => rule.method === method && rule.path === path,
  );
}

type HttpClientOptions = Omit<RequestInit, "body"> & {
  auth?: boolean;
  body?: BodyInit | object | null;
};

export async function httpClient<T = unknown>(
  urlOrPath: string,
  options: HttpClientOptions = {},
): Promise<T> {
  const { auth, headers, ...rest } = options;
  const method = (rest.method ?? "GET").toUpperCase();
  const path = normalizePath(urlOrPath);
  const shouldAuth = shouldSendAuthHeader(path, method, auth);
  const token = readStoredToken();
  const finalUrl = /^https?:\/\//i.test(urlOrPath)
    ? urlOrPath
    : `${API_BASE_URL}${path}`;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  if (
    rest.body &&
    !(rest.body instanceof FormData) &&
    !(rest.body instanceof URLSearchParams)
  ) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (shouldAuth && token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(finalUrl, {
    ...rest,
    body:
      rest.body &&
      typeof rest.body === "object" &&
      !(rest.body instanceof FormData) &&
      !(rest.body instanceof URLSearchParams)
        ? JSON.stringify(rest.body)
        : rest.body,
    headers: finalHeaders,
  });

  const text = await response.text();
  const data = text ? safeParse(text) : null;

  if (!response.ok) {
    let msg = "Request failed";

    if (data && typeof data === "object") {
      if ("message" in data && data.message) {
        msg = String(data.message);
      } else if ("error" in data && data.error) {
        msg = String(data.error);
      }
    } else if (typeof data === "string" && data) {
      msg = data;
    } else if (text) {
      msg = text;
    } else {
      const statusMessages: Record<number, string> = {
        400: "Solicitud invalida",
        401: "Sesion expirada",
        403: "No autorizado",
        404: "Recurso no encontrado",
        409: "Esta accion ya ha sido realizada anteriormente",
        500: "Error en el servidor",
      };
      msg = statusMessages[response.status] || `Error ${response.status}`;
    }

    const error = new ApiError(msg, {
      status: response.status,
      data,
    });

    // httpClient.ts
    if (response.status === 401 && shouldAuth) {
      // solo 401
      emitUnauthorizedEvent();
    }

    throw error;
  }

  return data as T;
}

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
