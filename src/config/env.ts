/**
 * Centralized environment configuration.
 * The API base URL can be overridden with VITE_API_BASE_URL; otherwise it
 * falls back to the staging backend provided in the assignment brief.
 */
export const env = {
  API_BASE_URL:
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api/proxy",
} as const;
