import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/features/auth/AuthProvider";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";

export const Route = createFileRoute("/_authed")({
  component: AuthedLayout,
});

function AuthedLayout() {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.navigate({ to: "/login" });
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) {
    return <LoadingSpinner label="Loading…" className="min-h-screen" />;
  }

  const isQuestionsPage = router.state.location.pathname.match(/\/tests\/[^/]+\/questions/);

  return (
    <AppShell hideSidebar={!!isQuestionsPage}>
      <Outlet />
    </AppShell>
  );
}
