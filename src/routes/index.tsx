import { createFileRoute, redirect } from "@tanstack/react-router";
import { storage, STORAGE_KEYS } from "@/lib/storage";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const token = storage.get<string>(STORAGE_KEYS.token);
    throw redirect({ to: token ? "/dashboard" : "/login" });
  },
});
