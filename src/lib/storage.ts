/** Safe localStorage wrappers — no-op on SSR. */
const isBrowser = typeof window !== "undefined";

export const storage = {
  get<T = unknown>(key: string): T | null {
    if (!isBrowser) return null;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown) {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* noop */
    }
  },
  remove(key: string) {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
  },
};

export const STORAGE_KEYS = {
  token: "preproute.token",
  user: "preproute.user",
} as const;
