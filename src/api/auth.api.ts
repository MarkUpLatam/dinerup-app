import { httpClient } from "./httpClient";

type LoginResponse = {
  accessToken: string;
  user: Record<string, unknown>;
};

export const loginRequest = async (email: string, password: string) => {
  return httpClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
};

export async function activateAccount(token: string) {
  return httpClient(`/api/auth/activate?token=${encodeURIComponent(token)}`, {
    method: "GET",
    auth: false,
  });
}

export async function completeRegistration(payload: {
  email: string;
  password: string;
}) {
  return httpClient("/api/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function forgotPassword(email: string) {
  return httpClient("/api/auth/password/forgot", {
    method: "POST",
    auth: false,
    body: { email },
  });
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}) {
  return httpClient("/api/auth/password/reset", {
    method: "POST",
    auth: false,
    body: payload,
  });
}
