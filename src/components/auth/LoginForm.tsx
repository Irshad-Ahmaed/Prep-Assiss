import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/TextField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginSchema, type LoginInput } from "@/features/auth/auth.schema";
import { useAuth } from "@/features/auth/AuthProvider";
import { ApiError } from "@/lib/api/types";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userId: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      await login(values);
      toast.success("Welcome back!");
      router.navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed. Try again.";
      setServerError(message);
    }
  };

  const submitting = methods.formState.isSubmitting;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <TextField<LoginInput>
          name="userId"
          label="User ID"
          placeholder="Enter User ID"
          autoComplete="username"
        />
        
        <div className="space-y-3">
          <TextField<LoginInput>
            name="password"
            label="Password"
            type="password"
            placeholder="Enter Password"
            autoComplete="current-password"
          />

          <div className="flex justify-start">
            <button
              type="button"
              className="text-[14px] font-medium text-[#5988EF] hover:underline"
              onClick={() => toast.info("Contact your admin to reset your password.")}
            >
              Forgot password?
            </button>
          </div>
        </div>

        <Button type="submit" className="h-[48px] w-full text-base rounded-[8px] bg-[#5988EF] hover:bg-[#5988EF]/90 text-white font-medium shadow-none" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {submitting ? "Signing in…" : "Login"}
        </Button>
      </form>
    </FormProvider>
  );
}
