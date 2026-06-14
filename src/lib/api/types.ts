/**
 * Standard API envelope returned by the backend.
 * The backend uses `status: "success" | "error"`; we also accept the
 * boolean `success` form for forward compatibility.
 */
export interface ApiResponse<T> {
  status?: "success" | "error";
  success?: boolean;
  data: T;
  message?: string;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status = 0, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}
