import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import type { User } from "@/types";
import { authService } from "./auth.service";
import type { LoginInput } from "./auth.schema";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    setToken(storage.get<string>(STORAGE_KEYS.token));
    setUser(storage.get<User>(STORAGE_KEYS.user));
    setHydrated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isHydrated,
      login: async (input) => {
        const result = await authService.login(input);
        storage.set(STORAGE_KEYS.token, result.token);
        storage.set(STORAGE_KEYS.user, result.user);
        setToken(result.token);
        setUser(result.user);
      },
      logout: () => {
        storage.remove(STORAGE_KEYS.token);
        storage.remove(STORAGE_KEYS.user);
        setToken(null);
        setUser(null);
      },
    }),
    [user, token, isHydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
