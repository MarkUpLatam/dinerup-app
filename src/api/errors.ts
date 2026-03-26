export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, options?: { status?: number; data?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = options?.status;
    this.data = options?.data;
  }
}

export function getErrorMessage(
  error: unknown,
  fallback = "Ocurrio un error inesperado.",
) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}
