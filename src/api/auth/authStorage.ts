import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../config";

const LEGACY_TOKEN_KEYS = ["access_token", "accessToken", "token"] as const;

export type AuthUser = Record<string, unknown> & {
  role?: string;
  name?: string;
};

export function readStoredToken() {
  const storageKeys = [AUTH_TOKEN_KEY, ...LEGACY_TOKEN_KEYS];

  for (const key of storageKeys) {
    const value = localStorage.getItem(key);
    if (value) {
      if (key !== AUTH_TOKEN_KEY) {
        localStorage.setItem(AUTH_TOKEN_KEY, value);
        localStorage.removeItem(key);
      }
      return value;
    }
  }

  return null;
}

export function readStoredUser() {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser || rawUser === "undefined" || rawUser === "null") {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function storeAuthSession(token: string, user: AuthUser) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function storeAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);

  for (const key of LEGACY_TOKEN_KEYS) {
    localStorage.removeItem(key);
  }
}

export function extractToken(payload: Record<string, unknown> | null | undefined) {
  const value =
    payload?.accessToken ??
    payload?.access_token ??
    payload?.token ??
    payload?.jwt ??
    null;

  return typeof value === "string" ? value : null;
}
