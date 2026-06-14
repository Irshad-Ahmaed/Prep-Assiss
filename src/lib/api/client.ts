import axios, { AxiosError, type AxiosInstance } from "axios";
import { env } from "@/config/env";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { ApiError, type ApiResponse } from "./types";

/**
 * Shared Axios instance.
 *  - Attaches the JWT from localStorage to every request.
 *  - Normalizes `{ success, data }` envelopes so callers receive `data` directly.
 *  - On 401, clears auth state and redirects to /login.
 */
export const api: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = storage.get<string>(STORAGE_KEYS.token);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string; status?: string }>) => {
    const status = error.response?.status ?? 0;

    if (status === 401 && typeof window !== "undefined") {
      storage.remove(STORAGE_KEYS.token);
      storage.remove(STORAGE_KEYS.user);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";

    return Promise.reject(new ApiError(message, status, error.response?.data));
  },
);

/** Helper: unwrap the API envelope (`status: "success"` or `success: true`). */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await promise;
  const ok = res.data?.status === "success" || res.data?.success === true;
  if (!ok) {
    throw new ApiError(res.data?.message ?? "Request failed");
  }
  return res.data.data;
}
