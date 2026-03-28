import { httpClient } from "./httpClient";
import type {
  CreditRequest,
  CooperativeCreditRequest,
  CreditRequestCooperative,
} from "../types/credit";
import { CreditDecision } from "../types/creditDecision";

export const getMyCreditRequests = async (): Promise<CreditRequest[]> => {
  const data = await httpClient<CreditRequest | CreditRequest[]>(
    "/api/credits/me",
    {
      auth: true,
    },
  );

  if (!data) return [];

  const requests = Array.isArray(data) ? data : [data];

  return requests.map((item) => ({
    ...item,
    monto: item.monto ?? 0,
  }));
};

export const getMyCooperativeRequests = async (): Promise<
  CooperativeCreditRequest[]
> => {
  const data = await httpClient<CooperativeCreditRequest[]>(
    "/api/credits/cooperative/me/requests",
    {
      auth: true,
    },
  );

  return data ?? [];
};

export const decideCreditRequest = async (
  solicitudId: number,
  decision: CreditDecision,
): Promise<void> => {
  await httpClient<void>(
    `/api/credits/cooperative/me/requests/${solicitudId}/decision`,
    {
      method: "PUT",
      auth: true,
      body: { decision },
    },
  );
};

export const getCreditRequestCooperatives = async (
  solicitudId: number,
): Promise<CreditRequestCooperative[]> => {
  const data = await httpClient<CreditRequestCooperative[]>(
    `/api/credits/me/${solicitudId}/pre-approved`,
    {
      auth: true,
    },
  );

  return data ?? [];
};

export const requestGuaranteeForCreditRequest = async (
  solicitudId: number,
): Promise<void> => {
  await httpClient<void>(
    `/api/credits/cooperative/me/requests/${solicitudId}/solicitar-garante`,
    {
      method: "PUT",
      auth: true,
    },
  );
};

export const createCreditRequest = async (payload: {
  monto: number;
  type: string;
  creditType?: string | null;
}): Promise<void> => {
  await httpClient<void>("/api/credits/me", {
    method: "POST",
    auth: true,
    body: payload,
  });
};

export const acceptCreditCooperative = async (
  solicitudId: number,
  cooperativaId: number,
): Promise<void> => {
  await httpClient<void>(
    `/api/credits/me/${solicitudId}/cooperatives/${cooperativaId}/accept`,
    {
      method: "PUT",
      auth: true,
    },
  );
};
