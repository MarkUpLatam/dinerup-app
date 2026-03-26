const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";

function normalizeApiBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl() {
  if (!rawApiBaseUrl) {
    throw new Error(
      "Missing VITE_API_BASE_URL. Define it in the environment before building or running the app.",
    );
  }

  return normalizeApiBaseUrl(rawApiBaseUrl);
}

export const API_BASE_URL = resolveApiBaseUrl();
export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";
