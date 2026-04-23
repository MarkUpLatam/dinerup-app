import { httpClient } from "./httpClient";

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
  id: number;
  estado: string;
  destinoCredito: string;
  fechaCreacion: string;
}

export async function submitOnboarding(
  payload: OnboardingPayload,
): Promise<OnboardingSubmitResponse> {
  return httpClient(`/api/onboarding/cliente/solicitante`, {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export type FormularioClienteStatus = {
  formularioCompleto: boolean;
  estadoFormulario: "PENDIENTE" | "SOLICITADO" | "COMPLETO";
};

export function getFormularioClienteStatus(): Promise<FormularioClienteStatus> {
  return httpClient<FormularioClienteStatus>(
    "/api/onboarding/cliente/formulario-status",
    { method: "GET", auth: true },
  );
}

export interface GuaranteeOnboardingResponse {
  id: number;
  estado: string;
  destinoCredito: string;
  fechaCreacion: string;
}

export async function submitGuaranteeOnboarding(
  payload: OnboardingPayload,
): Promise<GuaranteeOnboardingResponse> {
  return httpClient<GuaranteeOnboardingResponse>(
    `/api/onboarding/cliente/garante/completar`,
    {
      method: "POST",
      body: payload,
      auth: true,
    },
  );
}
