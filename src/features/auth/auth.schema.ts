import { z } from "zod";

export const loginSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required").max(120),
  password: z.string().min(1, "Password is required").max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;
