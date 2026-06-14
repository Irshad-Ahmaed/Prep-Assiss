import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

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
    <div className="h-screen w-full overflow-hidden bg-white">
      {/* Left: illustration on light blue */}
      <div className="hidden h-full w-full relative items-center bg-brand-blue-soft p-12 lg:flex">
        <div className="h-full w-full max-w-xl flex items-center">
          <img src="/login.png" alt="Login Illustration" className="max-h-full w-auto object-contain drop-shadow-xl" />
        </div>

        {/* Right: form card */}
        <div className="absolute w-[40%] right-5 top-1/2 -translate-y-1/2 flex h-[96vh] overflow-y-auto items-center justify-center p-6 rounded-sm border border-[#E5E7EB] bg-white md:p-10">
          <div className="w-full p-8">
            <PreprouteLogo className="mb-10" />
            <h1 className="text-[24px] font-bold text-[#1F2937]">Login</h1>
            <p className="mt-2 text-[14px] text-[#6B7180]">
              Use your company provided Login credentials
            </p>

            <div className="mt-10">
              <LoginForm />
            </div>

            {/* Hidden/Subtle test credentials */}
            <div className="mt-12 opacity-50 hover:opacity-100 transition-opacity">
              <p className="rounded-md bg-gray-50 p-3 text-xs text-gray-500 text-center">
                <span className="font-semibold text-gray-700">Test credentials:</span> vedant-admin / vedant123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
