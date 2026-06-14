import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginIllustration } from "@/components/auth/LoginIllustration";
import { PreprouteLogo } from "@/components/brand/PreprouteLogo";
import { useAuth } from "@/features/auth/AuthProvider";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — PrepRoute" },
      { name: "description", content: "Sign in to manage and publish your tests." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left: illustration on light blue */}
      <div className="hidden items-center justify-center bg-brand-blue-soft p-12 lg:flex">
        <LoginIllustration />
      </div>

      {/* Right: form card */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm md:p-12">
          <PreprouteLogo className="mb-10" />
          <h1 className="text-2xl font-semibold text-foreground">Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use your company provided Login credentials
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-8 rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Test credentials</span>
            <br />
            User ID: <code className="font-mono">vedant-admin</code>
            <br />
            Password: <code className="font-mono">vedant123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
