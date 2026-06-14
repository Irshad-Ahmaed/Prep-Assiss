/**
 * Centralized environment configuration.
 * The API base URL is always routed through the local proxy.
 */
export const env = {
  /**
   * The frontend ALWAYS calls the local proxy, ensuring the upstream URL is never exposed to the client.
   */
  API_BASE_URL: "/api/proxy",
} as const;
