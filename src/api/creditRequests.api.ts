import { httpClient } from "./httpClient";
import type {
  CreditRequest,
  CooperativeCreditRequest,
  CreditRequestCooperative,
} from "../types/credit";
import { CreditDecision } from "../types/creditDecision";

/**
 * CLIENTE
 * GET /api/credits/me
 */
export const getMyCreditRequests = async (): Promise<CreditRequest[]> => {
  const data = await httpClient<CreditRequest | CreditRequest[]>("/me", {
    baseUrl: import.meta.env.VITE_API_CREDIT_REQUESTS,
    auth: true,
  });

  // Handle both single object and array responses
  if (!data) return [];

  const requests = Array.isArray(data) ? data : [data];

  return requests.map((item) => ({
    ...item,
    monto: item.monto ?? 0, // Default to 0 if monto is null
  }));
};

/**
 * COOPERATIVA
 * GET /api/credits/cooperative/me/requests
 */
export const getMyCooperativeRequests = async (): Promise<
  CooperativeCreditRequest[]
> => {
  const data = await httpClient<CooperativeCreditRequest[]>(
    "/cooperative/me/requests",
    {
      baseUrl: import.meta.env.VITE_API_CREDIT_REQUESTS,
      auth: true,
    }
  );

  return data ?? [];
};

/**
 * COOPERATIVA
 * PUT /api/credits/cooperative/me/requests/{solicitudId}/decision
 */
export const decideCreditRequest = async (
  solicitudId: number,
  decision: CreditDecision
): Promise<void> => {
  await httpClient<void>(`/cooperative/me/requests/${solicitudId}/decision`, {
    method: "PUT",
    baseUrl: import.meta.env.VITE_API_CREDIT_REQUESTS,
    auth: true,
    body: JSON.stringify({ decision }),
  });
};

/**
 * CLIENTE
 * GET /api/credits/me/{solicitudId}/pre-approved
 */
export const getCreditRequestCooperatives = async (
  solicitudId: number
): Promise<CreditRequestCooperative[]> => {
  const data = await httpClient<CreditRequestCooperative[]>(
    `/me/${solicitudId}/pre-approved`,
    {
      baseUrl: import.meta.env.VITE_API_CREDIT_REQUESTS,
      auth: true,
    }
  );

  return data ?? [];
};

/**
 * CLIENTE
 * PUT /api/credits/me/{solicitudId}/cooperatives/{cooperativaId}/accept
 */
export const acceptCreditCooperative = async (
  solicitudId: number,
  cooperativaId: number
): Promise<void> => {
  await httpClient<void>(
    `/me/${solicitudId}/cooperatives/${cooperativaId}/accept`,
    {
      method: "PUT",
      baseUrl: import.meta.env.VITE_API_CREDIT_REQUESTS,
      auth: true,
    }
  );
};
