import { httpClient } from "./httpClient";

const BASE_URL = import.meta.env.VITE_API_ONBOARDING;

export interface DireccionData {
  provincia: string;
  canton: string;
  barrio: string;
  callePrincipal: string;
  numero: string;
  referenciaUbicacion: string;
  tipoVivienda: "PROPIA" | "ALQUILADA" | "FAMILIAR";
}

export interface ActividadEconomicaData {
  nombreNegocio: string;
  direccionNegocio: string;
  tiempoActividad: string;
  telefonoNegocio: string;
}

export interface IngresoEgresoData {
  ingresoMensual: number;
  egresoMensual: number;
}

export interface ReferenciaData {
  nombreCompleto: string;
  tipo: "PERSONAL" | "LABORAL" | "COMERCIAL";
  parentesco: string;
  telefono: string;
}

export interface SolicitanteData {
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  estadoCivil: string;
  ocupacion: string;
  empresaTrabajo: string;
  telefono: string;
  email: string;
  tieneConyuge: boolean;
  direccion: DireccionData;
  actividadEconomica: ActividadEconomicaData;
  ingresoEgreso: IngresoEgresoData;
  referencias: ReferenciaData[];
}

export interface OnboardingPayload {
  destinoCredito: string;
  solicitante: SolicitanteData;
  conyuge?: SolicitanteData;
}

export interface OnboardingSubmitResponse {
  status: string;
  message: string;
  id?: string;
}

export async function submitOnboarding(
  payload: OnboardingPayload,
): Promise<OnboardingSubmitResponse> {
  return httpClient(`/api/onboarding/cliente/solicitante`, {
    baseUrl: BASE_URL,
    method: "POST",
    body: payload,
    auth: true,
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
    console.error("Error fetching onboarding status:", error);
    return null;
  });
}
