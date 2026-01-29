import { httpClient } from "./httpClient";

const BASE_URL = import.meta.env.VITE_API_ONBOARDING;

export interface OnboardingSubmitResponse {
  status: "COMPLETED";
  message: string;
}

export async function submitOnboarding(
  payload: any
): Promise<OnboardingSubmitResponse> {
  return httpClient(`${BASE_URL}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type OnboardingStatusResponse = {
  clientId: number;
  status: string;
  completed: boolean;
};

export function getOnboardingStatus(): Promise<OnboardingStatusResponse | null> {
  return httpClient<OnboardingStatusResponse>("/api/onboarding/me/status", {
    baseUrl: import.meta.env.VITE_API_ONBOARDING,
    method: "GET",
    auth: true,
  }).catch((error) => {
    // En caso de error (incluyendo 500), loguear y retornar null
    console.error("Error fetching onboarding status:", error);
    return null;
  });
}
